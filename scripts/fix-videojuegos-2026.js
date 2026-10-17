/**
 * Corrige desarrolladoras y distribuidoras de videojuegos mal importadas de RAWG.
 * Fuentes: Wikipedia (Spider-Man 2000: Neversoft; Web of Shadows: Shaba Games) y créditos de los juegos.
 *
 * Uso: node scripts/fix-videojuegos-2026.js (volver a ejecutar tras populate-games-from-rawg.js)
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });
const prisma = new PrismaClient();

const FIXES = {
  'spider-man-2000-2000': { developer: 'Neversoft', publisher: 'Activision' },
  'ultimate-spider-man-2005': {
    developer: 'Treyarch',
    publisher: 'Activision',
    replace: [['desarrollado por Vicarious Visions y Beenox Studios', 'desarrollado por Treyarch (Vicarious Visions hizo las versiones portátiles)']],
  },
  'spider-man-web-of-shadows-2008': { developer: 'Shaba Games', publisher: 'Activision' },
};

(async () => {
  for (const [slug, { replace = [], ...data }] of Object.entries(FIXES)) {
    const game = await prisma.game.findUnique({ where: { slug } });
    if (!game) { console.warn('No existe:', slug); continue; }
    let longDescription = game.longDescription;
    for (const [from, to] of replace) longDescription = longDescription?.replace(from, to);
    await prisma.game.update({ where: { slug }, data: { ...data, longDescription } });
    console.log('ok', slug, '→', data.developer);
  }
  await prisma.$disconnect();
})().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
