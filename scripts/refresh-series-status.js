/**
 * Refresca desde TMDB los datos que cambian con el tiempo (estado, temporadas, episodios, nota)
 * sin tocar textos, imágenes ni análisis. Conviene ejecutarlo de vez en cuando.
 * Uso: node scripts/refresh-series-status.js [--dry-run]
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const API_KEY = process.env.TMDB_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

// Títulos que TMDB no tiene en español
const TITLE_OVERRIDES = {
  'spiderman-toei-1978': 'Spider-Man (Toei)',
};

async function main() {
  const series = await prisma.series.findMany({ where: { tmdbId: { not: null } } });
  for (const s of series) {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${s.tmdbId}?language=es-ES&api_key=${API_KEY}`);
    if (!res.ok) { console.log(`⚠️  ${s.slug}: TMDB ${res.status}`); continue; }
    const t = await res.json();
    const data = {
      status: t.status ?? s.status,
      seasons: t.number_of_seasons ?? s.seasons,
      episodes: t.number_of_episodes ?? s.episodes,
      // Con pocos votos la nota de TMDB no es fiable: se mantiene la anterior
      rating: t.vote_count >= 20 ? Math.round(t.vote_average * 10) / 10 : s.rating,
      ...(TITLE_OVERRIDES[s.slug] ? { title: TITLE_OVERRIDES[s.slug] } : {}),
    };
    const changes = Object.entries(data).filter(([k, v]) => s[k] !== v).map(([k, v]) => `${k}: ${s[k]} → ${v}`);
    console.log(changes.length ? `📝 ${s.slug}: ${changes.join(' | ')}` : `✔️  ${s.slug}: sin cambios`);
    if (!DRY_RUN && changes.length) await prisma.series.update({ where: { id: s.id }, data });
  }
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
