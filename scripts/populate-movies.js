/**
 * Popula películas de Spider-Man desde TMDB API
 * Uso: node scripts/populate-movies.js [--clean]
 *
 * Requiere en .env.local:
 *   TMDB_API_KEY=...
 *   DATABASE_URL=...
 */

const { PrismaClient } = require('@prisma/client');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';
const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const IMG_W185 = 'https://image.tmdb.org/t/p/w185';

// IDs exactos de TMDB para películas del universo Spider-Man
const KNOWN_MOVIE_IDS = [
  557,     // Spider-Man (2002) - Sam Raimi
  558,     // Spider-Man 2 (2004) - Sam Raimi
  559,     // Spider-Man 3 (2007) - Sam Raimi
  1930,    // The Amazing Spider-Man (2012)
  102382,  // The Amazing Spider-Man 2 (2014)
  315635,  // Spider-Man: Homecoming (2017)
  324857,  // Spider-Man: Into the Spider-Verse (2018)
  429617,  // Spider-Man: Far From Home (2019)
  634649,  // Spider-Man: No Way Home (2021)
  569094,  // Spider-Man: Across the Spider-Verse (2023)
  335983,  // Venom (2018)
  580489,  // Venom: Let There Be Carnage (2021)
  526896,  // Morbius (2022)
  539972,  // Kraven the Hunter (2024)
  634492,  // Madame Web (2024)
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function generateSlug(title, year) {
  return `${title}-${year}`
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tmdbGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'es-ES');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  return new Promise((resolve, reject) => {
    https.get(url.toString(), (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error(`JSON parse error for ${path}`));
        }
      });
    }).on('error', reject);
  });
}

async function fetchMovieDetails(movieId) {
  try {
    return await tmdbGet(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,images',
    });
  } catch (err) {
    console.error(`  Error fetching TMDB ID ${movieId}:`, err.message);
    return null;
  }
}

function transformMovieToDb(movie) {
  // Imagen principal — solo si TMDB la tiene
  if (!movie.poster_path) return null;
  const image = `${IMG_W500}${movie.poster_path}`;

  const year = movie.release_date
    ? parseInt(movie.release_date.substring(0, 4))
    : 0;

  // Backdrops desde la API
  const backdropUrls = [];
  if (movie.backdrop_path) {
    backdropUrls.push(`${IMG_ORIGINAL}${movie.backdrop_path}`);
  }
  if (Array.isArray(movie.images?.backdrops)) {
    for (const b of movie.images.backdrops.slice(0, 5)) {
      const url = `${IMG_ORIGINAL}${b.file_path}`;
      if (!backdropUrls.includes(url)) backdropUrls.push(url);
    }
  }

  // Escenas para galería (usando backdrops)
  const sceneImages = backdropUrls.slice(0, 6).map((url, i) => ({
    url,
    title: `${movie.title} — Escena ${i + 1}`,
    description: movie.tagline || `Imagen de ${movie.title}`,
  }));

  // Reparto con fotos desde TMDB
  const castWithPhotos = (movie.credits?.cast || [])
    .filter((a) => a.profile_path) // solo actores con foto
    .slice(0, 8)
    .map((a) => ({
      name: a.name,
      character: a.character,
      photo: `${IMG_W185}${a.profile_path}`,
      bio: `${a.name} interpreta a ${a.character} en ${movie.title}`,
    }));

  // Actores (lista plana para el campo actors[])
  const actors = (movie.credits?.cast || []).slice(0, 10).map((a) => a.name);

  // Tráiler oficial de YouTube
  const trailer = (movie.videos?.results || []).find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const trailerUrl = trailer
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : null;

  // Director
  const director =
    (movie.credits?.crew || []).find((c) => c.job === 'Director')?.name || null;

  const slug = generateSlug(movie.title, year);
  const description =
    movie.overview || `Película de Spider-Man: ${movie.title} (${year}).`;

  return {
    title: movie.title,
    originalTitle: movie.original_title || movie.title,
    subtitle: movie.tagline || null,
    year,
    releaseDate: movie.release_date || null,
    duration: movie.runtime ? `${movie.runtime} min` : null,
    director,
    platform: 'Theatrical',
    rating: movie.vote_average || 0,
    image,
    description,
    longDescription: `<h2>${movie.title}</h2><p>${description}</p>`,
    slug,
    seoTitle: `${movie.title} (${year}) - Análisis Completo | Spider-World`,
    seoDescription: description.substring(0, 155),
    keywords: [
      movie.title,
      'Spider-Man',
      'película',
      year.toString(),
      director || 'Marvel',
    ].filter(Boolean),
    actors,
    genre: (movie.genres || []).map((g) => g.name),
    boxOffice: null,
    budget: null,
    studio: movie.production_companies?.[0]?.name || null,
    sceneImages,
    castWithPhotos,
    trailerUrl,
    backdropImages: backdropUrls,
  };
}

async function populateMovies() {
  if (!API_KEY) {
    console.error('❌ TMDB_API_KEY no configurada en .env.local');
    process.exit(1);
  }

  console.log('🎬 Iniciando población de películas desde TMDB...\n');

  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const movieId of KNOWN_MOVIE_IDS) {
    try {
      console.log(`🔄 TMDB ID ${movieId}...`);
      const movie = await fetchMovieDetails(movieId);

      if (!movie || movie.success === false) {
        console.log(`   ⚠️  No encontrado`);
        skipped++;
        await delay(300);
        continue;
      }

      const data = transformMovieToDb(movie);
      if (!data) {
        console.log(`   ⚠️  ${movie.title}: sin póster en TMDB, omitido`);
        skipped++;
        await delay(300);
        continue;
      }

      const existing = await prisma.movie.findUnique({ where: { slug: data.slug } });

      if (existing) {
        await prisma.movie.update({
          where: { slug: data.slug },
          data: { ...data, views: existing.views, createdAt: existing.createdAt },
        });
        console.log(`   📝 Actualizado: ${data.title} (${data.year})`);
        updated++;
      } else {
        await prisma.movie.create({ data });
        console.log(`   ➕ Añadido: ${data.title} (${data.year})`);
        added++;
      }
    } catch (err) {
      console.error(`   ❌ Error en ID ${movieId}:`, err.message);
      skipped++;
    }

    await delay(300);
  }

  const total = await prisma.movie.count();
  console.log(`\n✅ Películas: ${added} añadidas, ${updated} actualizadas, ${skipped} omitidas`);
  console.log(`📊 Total en BD: ${total}`);
}

async function cleanAndRepopulate() {
  console.log('🧹 Limpiando tabla de películas...');
  const { count } = await prisma.movie.deleteMany({});
  console.log(`🗑️  ${count} películas eliminadas\n`);
  await populateMovies();
}

async function main() {
  const clean = process.argv.includes('--clean');
  try {
    if (clean) {
      await cleanAndRepopulate();
    } else {
      await populateMovies();
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('💥', err.message);
  process.exit(1);
});
