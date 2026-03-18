const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUrl(url) {
  if (!url) return 'NO_URL';
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) });
    return res.status;
  } catch { return 'ERROR'; }
}

async function checkSection(label, items, nameField = 'title') {
  console.log(`\n=== ${label} (${items.length}) ===`);
  let ok = 0, broken = 0;
  for (const item of items) {
    const status = await checkUrl(item.image);
    if (status !== 200) {
      console.log(`  ❌ [${status}] ${item[nameField]} -> ${item.image}`);
      broken++;
    } else ok++;
  }
  console.log(`  ✅ ${ok} ok, ❌ ${broken} rotas`);
}

async function main() {
  const chars   = await prisma.character.findMany({ select: { name: true, slug: true, image: true } });
  const comics  = await prisma.comic.findMany({ select: { title: true, slug: true, image: true } });
  const movies  = await prisma.movie.findMany({ select: { title: true, slug: true, image: true } });
  const series  = await prisma.series.findMany({ select: { title: true, slug: true, image: true } });
  const games   = await prisma.game.findMany({ select: { title: true, slug: true, image: true } });
  await prisma.$disconnect();

  await checkSection('PERSONAJES', chars, 'name');
  await checkSection('COMICS', comics);
  await checkSection('PELICULAS', movies);
  await checkSection('SERIES', series);
  await checkSection('JUEGOS', games);

  console.log('\n✅ Revisión completa.');
}

main().catch(console.error);
