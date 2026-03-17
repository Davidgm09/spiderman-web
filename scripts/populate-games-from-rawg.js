/**
 * Popula videojuegos de Spider-Man desde RAWG API
 * Uso: node scripts/populate-games-from-rawg.js [--clean]
 *
 * Requiere en .env.local:
 *   RAWG_API_KEY=...
 *   DATABASE_URL=...
 *
 * Imágenes: vienen directamente de RAWG como URLs completas (background_image)
 */

const { PrismaClient } = require('@prisma/client');
const https = require('https');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const RAWG_KEY = process.env.RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function generateSlug(title, year) {
  return `${title}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function rawgGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('key', RAWG_KEY);
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

function isSpiderManGame(game) {
  const name = (game.name || '').toLowerCase();
  const tags = (game.tags || []).map((t) => t.name.toLowerCase());
  return (
    name.includes('spider-man') ||
    name.includes('spiderman') ||
    name.includes('spider man') ||
    (name.includes('miles morales') &&
      tags.some((t) => t.includes('spider') || t.includes('marvel'))) ||
    (name.includes('venom') &&
      tags.some((t) => t.includes('spider') || t.includes('marvel')))
  );
}

// IDs verificados en RAWG para juegos oficiales de Spider-Man
const KNOWN_GAME_IDS = [
  58134,   // Marvel's Spider-Man (2018) - PS4
  663742,  // Marvel's Spider-Man Remastered (2022) - PC/PS5
  452634,  // Marvel's Spider-Man: Miles Morales (2020)
  662316,  // Marvel's Spider-Man 2 (2023)
  989789,  // Marvel's Spider-Man 2 PC Port (2025)
  249966,  // Spider-Man (2000) - PS1
  36795,   // Ultimate Spider-Man (2005)
  57794,   // Spider-Man 2: Enter Electro (2001)
  24687,   // Spider-Man: Web of Shadows (2008)
  57183,   // Spider-Man and Venom: Maximum Carnage (1994)
  53553,   // Spider-Man: Mysterio's Menace (GBA)
];

async function searchSpiderManGames() {
  const allGames = new Map();

  // Primero cargamos los IDs conocidos
  console.log('  📋 Cargando juegos por ID conocido...');
  for (const id of KNOWN_GAME_IDS) {
    try {
      const game = await rawgGet(`/games/${id}`);
      if (game && game.id) allGames.set(game.id, game);
      await delay(300);
    } catch (err) {
      console.error(`  ❌ Error con ID ${id}:`, err.message);
    }
  }

  // Búsqueda adicional para capturar juegos recientes
  const queries = ['spider-man marvel', 'miles morales spider'];
  for (const query of queries) {
    try {
      console.log(`  🔍 Buscando: "${query}"`);
      const data = await rawgGet('/games', {
        search: query,
        search_precise: true,
        page_size: 20,
        ordering: '-rating',
      });
      for (const game of data.results || []) {
        const hasRating = (game.rating || 0) >= 3.5 && (game.ratings_count || 0) >= 20;
        if (isSpiderManGame(game) && hasRating && !allGames.has(game.id)) {
          allGames.set(game.id, game);
        }
      }
    } catch (err) {
      console.error(`  ❌ Error buscando "${query}":`, err.message);
    }
    await delay(400);
  }

  return Array.from(allGames.values());
}

async function fetchGameDetails(gameId) {
  try {
    return await rawgGet(`/games/${gameId}`);
  } catch {
    return null;
  }
}

async function fetchGameScreenshots(gameId) {
  try {
    const data = await rawgGet(`/games/${gameId}/screenshots`);
    // RAWG screenshots son URLs completas, no paths
    return (data.results || []).map((s) => s.image).filter(Boolean);
  } catch {
    return [];
  }
}

function transformGameToDb(game, details, screenshots) {
  // Imagen desde RAWG: background_image ya es una URL completa
  const image = game.background_image || details?.background_image || null;
  if (!image) return null; // omitir juegos sin imagen

  const year = game.released
    ? parseInt(game.released.substring(0, 4))
    : 0;

  const platforms = (game.platforms || []).map((p) => p.platform.name);
  const genres = (game.genres || []).map((g) => g.name);
  const developer =
    (details?.developers || [])[0]?.name ||
    (game.developers || [])[0]?.name ||
    'Desconocido';
  const publisher =
    (details?.publishers || [])[0]?.name ||
    (game.publishers || [])[0]?.name ||
    null;
  const genre = genres[0] || 'Acción';
  const slug = generateSlug(game.name, year);

  // Rating: metacritic sobre 10, o rating de RAWG (ya sobre 5 → convertir a 10)
  const rating = game.metacritic
    ? game.metacritic / 10
    : game.rating
    ? game.rating * 2
    : 0;

  const description = details?.description_raw
    ? details.description_raw.substring(0, 500)
    : `${game.name} es un videojuego de Spider-Man lanzado en ${year}.`;

  // Capturas de pantalla — URLs completas desde RAWG
  const screenshotImages = screenshots.slice(0, 8).map((url, i) => ({
    url,
    title: `${game.name} — Captura ${i + 1}`,
    description: `Captura de pantalla de ${game.name}`,
  }));

  return {
    title: game.name,
    subtitle: null,
    year,
    platform: platforms,
    developer,
    publisher,
    genre,
    rating: Math.min(10, parseFloat(rating.toFixed(1))),
    importance: game.metacritic ? parseFloat((game.metacritic / 10).toFixed(1)) : null,
    image,
    description,
    longDescription: details?.description
      ? details.description
      : `<h2>${game.name}</h2><p>${description}</p>`,
    slug,
    seoTitle: `${game.name} (${year}) — Videojuego Spider-Man | Spider-World`,
    seoDescription: description.substring(0, 155),
    keywords: [
      game.name,
      'Spider-Man',
      'videojuego',
      year.toString(),
      ...platforms.slice(0, 3),
    ].filter(Boolean),
    playUrl: null,
    screenshotImages,
    characterImages: null,
    gameplayVideos: null,
    conceptArt: null,
  };
}

async function populateGames() {
  if (!RAWG_KEY) {
    console.error('❌ RAWG_API_KEY no configurada en .env.local');
    process.exit(1);
  }

  console.log('🎮 Buscando juegos de Spider-Man en RAWG...\n');

  const games = await searchSpiderManGames();
  console.log(`\n✅ Encontrados ${games.length} juegos relacionados con Spider-Man\n`);

  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const game of games) {
    try {
      console.log(`🔄 ${game.name}...`);

      const [details, screenshots] = await Promise.all([
        fetchGameDetails(game.id),
        fetchGameScreenshots(game.id),
      ]);
      await delay(400);

      const data = transformGameToDb(game, details, screenshots);
      if (!data) {
        console.log(`   ⚠️  Sin imagen en RAWG, omitido`);
        skipped++;
        continue;
      }

      const existing = await prisma.game.findUnique({ where: { slug: data.slug } });

      if (existing) {
        await prisma.game.update({
          where: { slug: data.slug },
          data: { ...data, views: existing.views, createdAt: existing.createdAt },
        });
        console.log(`   📝 Actualizado: ${data.title} (${data.year})`);
        updated++;
      } else {
        await prisma.game.create({ data });
        console.log(`   ➕ Añadido: ${data.title} (${data.year})`);
        added++;
      }
    } catch (err) {
      console.error(`   ❌ Error en ${game.name}:`, err.message);
      skipped++;
    }
  }

  const total = await prisma.game.count();
  console.log(`\n✅ Juegos: ${added} añadidos, ${updated} actualizados, ${skipped} omitidos`);
  console.log(`📊 Total en BD: ${total}`);
}

async function cleanAndRepopulate() {
  console.log('🧹 Limpiando tabla de juegos...');
  const { count } = await prisma.game.deleteMany({});
  console.log(`🗑️  ${count} juegos eliminados\n`);
  await populateGames();
}

async function main() {
  const clean = process.argv.includes('--clean');
  try {
    if (clean) {
      await cleanAndRepopulate();
    } else {
      await populateGames();
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('💥', err.message);
  process.exit(1);
});
