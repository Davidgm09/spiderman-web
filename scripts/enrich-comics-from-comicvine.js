/**
 * Completa los cómics ya importados con datos reales de Comic Vine:
 * personajes, primeras apariciones y arcos argumentales.
 * (populate-comics-from-comicvine.js los dejó con characters: ['Spider-Man'] y el resto vacío.)
 *
 * Uso: node scripts/enrich-comics-from-comicvine.js [--dry-run] [--limit=N] [--force]
 *   --dry-run  muestra lo que haría sin escribir en la BD
 *   --limit=N  procesa solo N cómics
 *   --force    reprocesa también los que ya tienen personajes reales
 *   --credits  solo guionista/artista de los cómics que tienen "Marvel Comics" de relleno
 *              (si Comic Vine no tiene créditos, se dejan vacíos y la ficha no los muestra)
 *
 * Requiere COMICVINE_API_KEY en .env. Comic Vine limita a ~200 peticiones/hora por recurso
 * y bloquea ráfagas, así que va a una petición cada ~1,2 s.
 */

const { PrismaClient } = require('@prisma/client');
const https = require('https');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const API_KEY = process.env.COMICVINE_API_KEY;
const BASE_URL = 'https://comicvine.gamespot.com/api';
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const CREDITS = process.argv.includes('--credits');
const LIMIT = Number((process.argv.find((a) => a.startsWith('--limit=')) || '').split('=')[1]) || Infinity;
const MAX_CHARACTERS = 100; // Comic Vine los da en orden alfabético: se guardan todos y la ficha prioriza

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let lastCall = 0;
async function cvGet(endpoint, params = {}) {
  const wait = 1200 - (Date.now() - lastCall);
  if (wait > 0) await delay(wait);
  lastCall = Date.now();

  const url = new URL(`${BASE_URL}${endpoint}/`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('format', 'json');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  return new Promise((resolve, reject) => {
    https.get(url.toString(), { headers: { 'User-Agent': 'SentidoAracnido/1.0' } }, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.status_code !== 1) reject(new Error(`Comic Vine: ${parsed.error} (${parsed.status_code})`));
          else resolve(parsed);
        } catch {
          reject(new Error(`Respuesta no JSON (HTTP ${res.statusCode}) en ${endpoint}`));
        }
      });
    }).on('error', reject);
  });
}

// "Amazing Spider-Man #300" -> { volumeName: 'Amazing Spider-Man', issueNumber: '300' }
function parseTitle(title) {
  const m = title.match(/^(.*?)\s*#\s*([\w.\/-]+)\s*$/);
  return m ? { volumeName: m[1].trim(), issueNumber: m[2] } : null;
}

// Nombre del archivo de la portada, para confirmar que el número de Comic Vine es el mismo cómic
const coverKey = (url) => (url || '').split('/').pop().split('?')[0].toLowerCase();

const volumeCache = new Map();
async function findVolumes(volumeName) {
  if (volumeCache.has(volumeName)) return volumeCache.get(volumeName);
  const data = await cvGet('/volumes', {
    filter: `name:${volumeName}`,
    field_list: 'id,name,start_year,publisher,count_of_issues',
    limit: 50,
  });
  const vols = (data.results || []).filter(
    (v) => v.name.toLowerCase() === volumeName.toLowerCase() && (!v.publisher || /marvel/i.test(v.publisher.name || ''))
  );
  volumeCache.set(volumeName, vols);
  return vols;
}

async function findIssue(comic) {
  const parsed = parseTitle(comic.title);
  if (!parsed) return null;
  const year = parseInt(comic.year, 10);
  const vols = (await findVolumes(parsed.volumeName))
    .filter((v) => !v.start_year || !year || parseInt(v.start_year, 10) <= year)
    .sort((a, b) => parseInt(b.start_year || 0, 10) - parseInt(a.start_year || 0, 10)); // la más reciente que empezó antes

  const target = coverKey(comic.image);
  for (const vol of vols.slice(0, 4)) {
    const data = await cvGet('/issues', {
      filter: `volume:${vol.id},issue_number:${parsed.issueNumber}`,
      field_list: 'id,issue_number,cover_date,image',
      limit: 5,
    });
    const issues = data.results || [];
    // Coincidencia segura: misma portada. Si no, mismo año de portada.
    const byCover = issues.find((i) => target && [i.image?.original_url, i.image?.medium_url].some((u) => coverKey(u) === target));
    if (byCover) return { issue: byCover, match: 'portada' };
    const byYear = issues.find((i) => i.cover_date && new Date(i.cover_date).getFullYear() === year);
    if (byYear) return { issue: byYear, match: 'año' };
  }
  return null;
}

async function main() {
  if (!API_KEY) {
    console.error('❌ Falta COMICVINE_API_KEY en .env (gratis en https://comicvine.gamespot.com/api/)');
    process.exit(1);
  }

  const comics = await prisma.comic.findMany({ orderBy: { slug: 'asc' } });
  const pending = comics
    .filter((c) => CREDITS
      ? c.writer === 'Marvel Comics' || c.artist === 'Marvel Comics'
      : FORCE || (c.characters.length === 1 && c.characters[0] === 'Spider-Man') || c.characters.length === 0)
    .slice(0, LIMIT);
  console.log(`📚 ${pending.length} cómics por completar${DRY_RUN ? ' (simulación, no se escribe nada)' : ''}\n`);

  const stats = { ok: 0, notFound: 0, errors: 0 };
  for (const [i, comic] of pending.entries()) {
    const tag = `[${i + 1}/${pending.length}] ${comic.title} (${comic.year})`;
    try {
      const found = await findIssue(comic);
      if (!found) {
        console.log(`⚠️  ${tag}: no encontrado en Comic Vine`);
        stats.notFound++;
        continue;
      }
      if (CREDITS) {
        const { person_credits: people = [] } = (await cvGet(`/issue/4000-${found.issue.id}`, { field_list: 'person_credits' })).results;
        const byRole = (re) => people.filter((p) => re.test(p.role || '')).map((p) => p.name);
        const writer = byRole(/writer/i)[0] || '';
        const artist = byRole(/penciler|artist/i)[0] || '';
        const data = {
          ...(comic.writer === 'Marvel Comics' ? { writer } : {}),
          ...(comic.artist === 'Marvel Comics' ? { artist } : {}),
        };
        console.log(`✅ ${tag} [${found.match}]: guion "${data.writer ?? comic.writer}" · arte "${data.artist ?? comic.artist}"`);
        if (!DRY_RUN) await prisma.comic.update({ where: { id: comic.id }, data });
        stats.ok++;
        continue;
      }

      const detail = (await cvGet(`/issue/4000-${found.issue.id}`, {
        field_list: 'character_credits,first_appearance_characters,story_arc_credits',
      })).results;

      const characters = (detail.character_credits || []).map((c) => c.name);
      // Spider-Man primero, el resto en el orden de Comic Vine
      characters.sort((a, b) => (b === 'Spider-Man') - (a === 'Spider-Man'));
      const data = {
        characters: characters.length ? characters.slice(0, MAX_CHARACTERS) : comic.characters,
        firstAppearances: (detail.first_appearance_characters || []).map((c) => c.name),
        storylines: (detail.story_arc_credits || []).length
          ? detail.story_arc_credits.map((a) => a.name.replace(/^"[^"]*"\s*/, '').trim())
          : comic.storylines,
      };
      console.log(
        `✅ ${tag} [${found.match}]: ${data.characters.length} personajes` +
        (data.firstAppearances.length ? `, 1ª aparición: ${data.firstAppearances.join(', ')}` : '') +
        ` | ${data.characters.slice(0, 6).join(', ')}${data.characters.length > 6 ? '…' : ''}`
      );
      if (!DRY_RUN) await prisma.comic.update({ where: { id: comic.id }, data });
      stats.ok++;
    } catch (e) {
      console.log(`❌ ${tag}: ${e.message}`);
      stats.errors++;
      if (/rate|limit|420|107/i.test(e.message)) {
        console.log('⏸️  Límite de Comic Vine alcanzado: vuelve a ejecutar el script en una hora (continúa donde lo dejó).');
        break;
      }
    }
  }

  console.log(`\n📊 Completados: ${stats.ok} | No encontrados: ${stats.notFound} | Errores: ${stats.errors}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error('💥', e.message); process.exit(1); });
