/**
 * Descarga y reduce las imágenes de los personajes de /juegos para servirlas desde la propia web
 * (public/juegos/personajes/<slug>.jpg). Así los juegos no cargan imágenes de Comic Vine ni Wikipedia,
 * que añaden cookies de terceros y a veces van lentas.
 *
 * Uso: node scripts/descargar-imagenes-juegos.js   (después: node scripts/build-juegos-data.js)
 * Requiere ffmpeg. Solo descarga las que falten; borra un .jpg para volver a bajarlo.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const DESTINO = path.join(__dirname, '..', 'public', 'juegos', 'personajes');

(async () => {
  fs.mkdirSync(DESTINO, { recursive: true });
  const personajes = await prisma.character.findMany({ where: { isActive: true }, select: { slug: true, image: true } });
  let nuevas = 0;
  const fallos = [];
  for (const { slug, image } of personajes) {
    const salida = path.join(DESTINO, `${slug}.jpg`);
    if (fs.existsSync(salida) || !/^https?:\/\//.test(image)) continue;
    try {
      const res = await fetch(image, { headers: { 'User-Agent': 'Mozilla/5.0 SentidoAracnido' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const tmp = path.join(os.tmpdir(), `juego-${slug}`);
      fs.writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
      // 320 px de ancho bastan para las miniaturas de los juegos (se muestran a 112 px como mucho)
      const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-vf', "scale='min(320,iw)':-2", '-q:v', '4', salida]);
      fs.rmSync(tmp, { force: true });
      if (r.status !== 0) throw new Error(String(r.stderr).slice(0, 200));
      nuevas++;
    } catch (e) {
      fallos.push(`${slug}: ${e.message}`);
    }
  }
  console.log(`${nuevas} imágenes nuevas en public/juegos/personajes`);
  if (fallos.length) console.warn(`No se pudieron descargar:\n  ${fallos.join('\n  ')}`);
  await prisma.$disconnect();
})();
