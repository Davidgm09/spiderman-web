/**
 * Popula cómics de Spider-Man desde Marvel API
 * Uso: node scripts/populate-comics-from-marvel.js [--clean]
 *
 * Requiere en .env.local:
 *   MARVEL_PUBLIC_KEY=...   (o MARVEL_API_KEY)
 *   MARVEL_PRIVATE_KEY=...  (o MARVEL_API_PRIVATE_KEY)
 *   DATABASE_URL=...
 *
 * Auth: hash = MD5(ts + privateKey + publicKey)
 * Imágenes: thumbnail.path + '/portrait_uncanny.' + thumbnail.extension
 */

const { PrismaClient } = require('@prisma/client');
const https = require('https');
const crypto = require('crypto');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();

const PUBLIC_KEY =
  process.env.MARVEL_PUBLIC_KEY || process.env.MARVEL_API_KEY;
const PRIVATE_KEY =
  process.env.MARVEL_PRIVATE_KEY || process.env.MARVEL_API_PRIVATE_KEY;
const BASE_URL = 'https://gateway.marvel.com/v1/public';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Títulos de series a buscar en Marvel API
const SERIES_TO_FETCH = [
  'Amazing Spider-Man',
  'Ultimate Spider-Man',
  'Spectacular Spider-Man',
  'Miles Morales: Spider-Man',
  'Spider-Gwen',
  'Spider-Man',
  'Spider-Verse',
];

// Máximo de cómics por serie (Marvel API tiene límite de 100 por request)
const COMICS_PER_SERIES = 30;

// ── Auth ──────────────────────────────────────────────────────────────────────

function marvelAuth() {
  const ts = Date.now().toString();
  const hash = crypto
    .createHash('md5')
    .update(ts + PRIVATE_KEY + PUBLIC_KEY)
    .digest('hex');
  return { ts, apikey: PUBLIC_KEY, hash };
}

// ── HTTP ──────────────────────────────────────────────────────────────────────

function marvelGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  const auth = marvelAuth();
  Object.entries({ ...auth, ...params }).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );

  return new Promise((resolve, reject) => {
    https
      .get(url.toString(), (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            if (parsed.code && parsed.code !== 200) {
              reject(new Error(`Marvel API error: ${parsed.status}`));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            reject(new Error(`JSON parse error for ${path}`));
          }
        });
      })
      .on('error', reject);
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

/**
 * Construye la URL de imagen desde el thumbnail de Marvel.
 * Devuelve null si el thumbnail no está disponible o es el placeholder de Marvel.
 */
function getMarvelImageUrl(thumbnail, size = 'portrait_uncanny') {
  if (!thumbnail || !thumbnail.path || !thumbnail.extension) return null;
  if (thumbnail.path.includes('image_not_available')) return null;
  return `${thumbnail.path}/${size}.${thumbnail.extension}`;
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchComicsByTitle(titleStartsWith) {
  const results = [];

  try {
    const data = await marvelGet('/comics', {
      titleStartsWith,
      format: 'comic',
      noVariants: true,
      orderBy: '-issueNumber',
      limit: COMICS_PER_SERIES,
      offset: 0,
    });

    if (data.data?.results) {
      results.push(...data.data.results);
    }
  } catch (err) {
    console.error(`  Error fetching "${titleStartsWith}":`, err.message);
  }

  return results;
}

// ── Transform ─────────────────────────────────────────────────────────────────

function transformComicToDb(comic) {
  // Imagen principal — solo si Marvel la tiene (no placeholder)
  const image = getMarvelImageUrl(comic.thumbnail, 'portrait_uncanny');
  if (!image) return null;

  // Año de publicación
  const onsaleDate = comic.dates?.find((d) => d.type === 'onsaleDate')?.date;
  const year = onsaleDate
    ? new Date(onsaleDate).getFullYear().toString()
    : '2000';

  // Creadores
  const creators = comic.creators?.items || [];
  const writer =
    creators.find((c) => c.role === 'writer')?.name || 'Stan Lee';
  const artist =
    creators.find(
      (c) => c.role === 'penciler' || c.role === 'artist' || c.role === 'penciller'
    )?.name || 'Steve Ditko';

  // Precio
  const printPrice = comic.prices?.find((p) => p.type === 'printPrice')?.price;
  const price =
    printPrice && printPrice > 0 ? `$${printPrice.toFixed(2)}` : '$3.99';

  const title = comic.title || `Comic #${comic.issueNumber}`;
  const slug = generateSlug(title, year);

  const rawDescription = comic.description || '';
  const description = rawDescription
    ? rawDescription.replace(/<[^>]*>/g, '').substring(0, 500)
    : `${title} es un cómic de Spider-Man publicado en ${year} por Marvel Comics.`;

  // Variantes de portada — imágenes adicionales del mismo cómic
  const coverVariants = (comic.images || [])
    .map((img, i) => {
      const url = getMarvelImageUrl(img, 'portrait_uncanny');
      if (!url) return null;
      return {
        url,
        title: `Variante ${i + 1} — ${title}`,
        description: 'Portada alternativa',
        artist,
      };
    })
    .filter(Boolean)
    .slice(0, 4);

  // Personajes
  const characters = (comic.characters?.items || []).map((c) => c.name);

  // URL para comprar (link oficial de Marvel)
  const marvelDetailUrl =
    (comic.urls || []).find((u) => u.type === 'detail')?.url || null;

  return {
    title,
    subtitle: comic.variantDescription || null,
    year,
    writer,
    artist,
    publisher: 'Marvel Comics',
    pages: comic.pageCount > 0 ? comic.pageCount : null,
    price,
    rating: 8.0, // Marvel API no provee rating de usuarios
    importance: 'Bueno',
    image,
    description,
    longDescription: `<h2>${title}</h2><p>${description}</p>`,
    slug,
    seoTitle: `${title} (${year}) — Cómic Spider-Man | Spider-World`,
    seoDescription: description.substring(0, 155),
    keywords: [
      title,
      'Spider-Man',
      'cómic',
      year,
      'Marvel Comics',
      writer,
    ].filter(Boolean),
    characters,
    storylines: [],
    firstAppearances: [],
    coverVariants,
    pagePreview: null,
    artistPhotos: null,
    conceptArt: null,
    backdropImages: [],
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function populateComics() {
  if (!PUBLIC_KEY || !PRIVATE_KEY) {
    console.error(
      '❌ MARVEL_PUBLIC_KEY y MARVEL_PRIVATE_KEY no configuradas en .env.local'
    );
    process.exit(1);
  }

  console.log('📚 Iniciando población de cómics desde Marvel API...\n');

  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const seriesTitle of SERIES_TO_FETCH) {
    console.log(`📖 Buscando cómics: "${seriesTitle}"...`);
    const comics = await fetchComicsByTitle(seriesTitle);
    console.log(`   ${comics.length} resultados`);

    for (const comic of comics) {
      try {
        const data = transformComicToDb(comic);

        if (!data) {
          skipped++;
          continue;
        }

        // Manejar slugs duplicados (mismo slug, distinto cómic)
        let slug = data.slug;
        const existing = await prisma.comic.findUnique({ where: { slug } });

        if (existing) {
          if (existing.title === data.title) {
            // Misma entrada, actualizar
            await prisma.comic.update({
              where: { slug },
              data: { ...data, views: existing.views, createdAt: existing.createdAt },
            });
            console.log(`   📝 Actualizado: ${data.title} (${data.year})`);
            updated++;
          } else {
            // Distinto cómic, mismo slug generado — añadir issue number
            const issueNum = comic.issueNumber || Date.now();
            slug = `${data.slug}-${issueNum}`;
            data.slug = slug;
            await prisma.comic.create({ data });
            console.log(`   ➕ Añadido (slug ajustado): ${data.title}`);
            added++;
          }
        } else {
          await prisma.comic.create({ data });
          console.log(`   ➕ Añadido: ${data.title} (${data.year})`);
          added++;
        }
      } catch (err) {
        if (err.code === 'P2002') {
          // Unique constraint — slug ya existe
          console.log(`   ⚠️  Slug duplicado: ${comic.title}, omitido`);
        } else {
          console.error(`   ❌ Error en ${comic.title}:`, err.message);
        }
        skipped++;
      }
    }

    // Respetar el rate limit de Marvel (3000 llamadas/día)
    await delay(600);
  }

  const total = await prisma.comic.count();
  console.log(
    `\n✅ Cómics: ${added} añadidos, ${updated} actualizados, ${skipped} omitidos`
  );
  console.log(`📊 Total en BD: ${total}`);
}

async function cleanAndRepopulate() {
  console.log('🧹 Limpiando tabla de cómics...');
  const { count } = await prisma.comic.deleteMany({});
  console.log(`🗑️  ${count} cómics eliminados\n`);
  await populateComics();
}

async function main() {
  const clean = process.argv.includes('--clean');
  try {
    if (clean) {
      await cleanAndRepopulate();
    } else {
      await populateComics();
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('💥', err.message);
  process.exit(1);
});
