/**
 * Popula cómics de Spider-Man desde Comic Vine API
 * Uso: node scripts/populate-comics-from-comicvine.js [--clean]
 *
 * Requiere en .env:
 *   COMICVINE_API_KEY=...
 *   DATABASE_URL=...
 *
 * Imágenes: vienen directamente de Comic Vine (image.medium_url / image.original_url)
 */

const { PrismaClient } = require('@prisma/client');
const https = require('https');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const API_KEY = process.env.COMICVINE_API_KEY;
const BASE_URL = 'https://comicvine.gamespot.com/api';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Series de Spider-Man a buscar en Comic Vine
const SERIES_TO_FETCH = [
  'Amazing Spider-Man',
  'Ultimate Spider-Man',
  'Spectacular Spider-Man',
  'Miles Morales Spider-Man',
  'Spider-Gwen',
  'Spider-Man',
  'Spider-Verse',
  'Superior Spider-Man',
];

// Máximo de issues por serie
const ISSUES_PER_SERIES = 20;

// ── HTTP ─────────────────────────────────────────────────────────────────────

function cvGet(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}/`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('format', 'json');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': 'Spider-World/1.0' } };
    https.get(url.toString(), options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.status_code !== 1) {
            reject(new Error(`Comic Vine error: ${parsed.error}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`JSON parse error for ${endpoint}`));
        }
      });
    }).on('error', reject);
  });
}

function generateSlug(title, year) {
  return `${title}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── Buscar volúmenes (series) ─────────────────────────────────────────────────

async function searchVolumes(seriesName) {
  console.log(`\n📚 Buscando volúmenes: "${seriesName}"...`);
  try {
    const data = await cvGet('/volumes', {
      filter: `name:${seriesName}`,
      field_list: 'id,name,start_year,publisher,count_of_issues,image,description,site_detail_url',
      limit: 5,
    });

    return (data.results || []).filter((v) => {
      const name = (v.name || '').toLowerCase();
      return (
        name.includes('spider-man') ||
        name.includes('spider-gwen') ||
        name.includes('miles morales') ||
        name.includes('spider-verse') ||
        name.includes('superior spider')
      );
    });
  } catch (e) {
    console.error(`  ❌ Error: ${e.message}`);
    return [];
  }
}

// ── Obtener issues de un volumen ──────────────────────────────────────────────

async function getIssuesFromVolume(volumeId, volumeName) {
  try {
    const data = await cvGet('/issues', {
      filter: `volume:${volumeId}`,
      field_list: 'id,name,issue_number,cover_date,image,description,volume,site_detail_url,person_credits',
      limit: ISSUES_PER_SERIES,
      sort: 'issue_number:asc',
    });
    console.log(`  📖 ${volumeName}: ${data.number_of_total_results} issues, obteniendo ${data.results?.length}`);
    return data.results || [];
  } catch (e) {
    console.error(`  ❌ Error obteniendo issues de ${volumeName}: ${e.message}`);
    return [];
  }
}

// ── Guardar cómic en BD ───────────────────────────────────────────────────────

async function saveComic(issue, volume) {
  const image = issue.image?.original_url || issue.image?.medium_url;
  if (!image || image.includes('default_cover')) {
    console.log(`  ⚠️  #${issue.issue_number} sin portada, omitido`);
    return null;
  }

  const title = `${volume.name} #${issue.issue_number}`;
  const year = issue.cover_date
    ? new Date(issue.cover_date).getFullYear()
    : (volume.start_year ? parseInt(volume.start_year) : 2000);
  const slug = generateSlug(title, year);

  const existing = await prisma.comic.findFirst({ where: { slug } });
  if (existing) return existing;

  const writers = (issue.person_credits || [])
    .filter((p) => p.role?.toLowerCase().includes('writer'))
    .map((p) => p.name);
  const artists = (issue.person_credits || [])
    .filter((p) => p.role?.toLowerCase().includes('penciler') || p.role?.toLowerCase().includes('artist'))
    .map((p) => p.name);

  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'spiderweb-20';
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(title + ' marvel comic')}&tag=${amazonTag}`;

  const cleanDesc = issue.description
    ? issue.description.replace(/<[^>]+>/g, '').substring(0, 500)
    : `Cómic ${title} de Marvel Comics.`;

  try {
    const comic = await prisma.comic.create({
      data: {
        title,
        subtitle: issue.name || `${volume.name} #${issue.issue_number}`,
        year: year.toString(),
        publisher: 'Marvel Comics',
        writer: writers[0] || 'Marvel Comics',
        artist: artists[0] || 'Marvel Comics',
        price: '$3.99',
        rating: 8.0,
        importance: 'Media',
        image,
        description: cleanDesc,
        longDescription: `<h2>${title}</h2><p>${cleanDesc}</p>`,
        slug,
        seoTitle: `${title} - Cómic Marvel | Spider-World`,
        seoDescription: `${cleanDesc.substring(0, 150)}...`,
        keywords: [volume.name.toLowerCase(), 'spider-man', 'marvel comics', `#${issue.issue_number}`, year.toString()],
        characters: ['Spider-Man'],
        storylines: [volume.name],
        firstAppearances: [],
        backdropImages: [],
        isActive: true,
      },
    });
    return comic;
  } catch (e) {
    console.error(`  ❌ Error guardando ${title}: ${e.message.split('\n')[0]}`);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function populateComicsFromComicVine() {
  try {
    console.log('🚀 Iniciando población de cómics desde Comic Vine...\n');

    if (!API_KEY) {
      console.error('❌ COMICVINE_API_KEY no configurada en .env');
      return;
    }

    if (process.argv.includes('--clean')) {
      const deleted = await prisma.comic.deleteMany();
      console.log(`🗑️  Eliminados ${deleted.count} cómics previos\n`);
    }

    let totalSaved = 0;
    const seenVolumeIds = new Set();

    for (const seriesName of SERIES_TO_FETCH) {
      const volumes = await searchVolumes(seriesName);
      await delay(500);

      for (const volume of volumes) {
        if (seenVolumeIds.has(volume.id)) continue;
        seenVolumeIds.add(volume.id);

        const issues = await getIssuesFromVolume(volume.id, volume.name);
        await delay(500);

        for (const issue of issues) {
          const saved = await saveComic(issue, volume);
          if (saved && !saved.createdAt) totalSaved++; // solo nuevos
          else if (saved) totalSaved++;
          await delay(200);
        }
      }
    }

    const total = await prisma.comic.count();
    console.log(`\n✅ Cómics guardados: ${totalSaved}`);
    console.log(`📊 Total en BD: ${total}`);
  } catch (e) {
    console.error('💥 Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  populateComicsFromComicVine();
}

module.exports = { populateComicsFromComicVine };
