/**
 * Aplica las sinopsis de cómics revisadas a mano (scripts/data/comic-synopses-es.json).
 * Sustituyen a las traducciones automáticas de Comic Vine, que tenían errores y a menudo
 * estaban cortadas. Formato del JSON: { "slug": "Párrafo 1\n\nPárrafo 2\n\n### Subtítulo\n\nPárrafo 3" }
 *
 * - longDescription: <h2>título</h2> + párrafos (### -> <h3>)
 * - description: primeras frases completas, hasta ~300 caracteres (cabecera de la ficha y buscadores)
 *
 * Uso: node scripts/apply-comic-synopses.js [--dry-run]
 * Tras volver a importar cómics desde Comic Vine, ejecútalo de nuevo para recuperar las sinopsis revisadas.
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');
const DATA = path.join(__dirname, 'data', 'comic-synopses-es.json');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function toHtml(title, text) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const body = blocks
    .map((b) => (b.startsWith('### ') ? `<h3>${escapeHtml(b.slice(4))}</h3>` : `<p>${escapeHtml(b)}</p>`))
    .join('');
  return `<h2>${escapeHtml(title)}</h2>${body}`;
}

function shortDescription(text, max = 300) {
  const plain = text.split(/\n\s*\n/).filter((b) => !b.startsWith('### ')).join(' ').replace(/\s+/g, ' ').trim();
  const sentences = plain.match(/[^.!?…]+[.!?…]+["»”)]*\s*/g) || [plain];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > max && out) break;
    out += s;
  }
  return out.trim();
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  let n = 0;
  for (const [slug, text] of Object.entries(data)) {
    const comic = await prisma.comic.findUnique({ where: { slug }, select: { title: true } });
    if (!comic) { console.log(`⚠️  No existe: ${slug}`); continue; }
    const longDescription = toHtml(comic.title, text);
    const description = shortDescription(text);
    if (DRY_RUN) console.log(`— ${slug}\n  ${description}\n`);
    else await prisma.comic.update({ where: { slug }, data: { longDescription, description } });
    n++;
  }
  console.log(`${DRY_RUN ? '🔎 Simulado' : '✅ Actualizado'}: ${n} cómics`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
