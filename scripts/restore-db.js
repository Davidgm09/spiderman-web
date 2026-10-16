/**
 * Restaura una copia hecha con backup-db.js en la base de datos de .env.
 * Las tablas deben existir (si la base de datos es nueva: `npx prisma db push` antes).
 * Solo inserta las filas que faltan (no borra ni sobrescribe nada).
 *
 * Uso:
 *   node scripts/restore-db.js backups/<carpeta>            → simulación: muestra qué haría
 *   node scripts/restore-db.js backups/<carpeta> --apply    → restaura de verdad
 */

require('dotenv').config({ path: '.env' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const [dirArg, flag] = process.argv.slice(2);
const apply = flag === '--apply';

(async () => {
  if (!dirArg) throw new Error('Indica la carpeta de la copia: node scripts/restore-db.js backups/<carpeta>');
  const dir = path.resolve(dirArg);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  await client.connect();

  console.log(`${apply ? 'RESTAURANDO' : 'SIMULACIÓN (añade --apply para restaurar)'} desde ${dirArg} (${manifest.createdAt})\n`);
  for (const table of Object.keys(manifest.tables)) {
    const rows = JSON.parse(fs.readFileSync(path.join(dir, `${table}.json`), 'utf8'));
    const { rows: cols } = await client.query(
      "select column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = $1",
      [table]
    );
    if (!cols.length) { console.log(`  ⚠️  ${table}: la tabla no existe (ejecuta npx prisma db push)`); continue; }
    const jsonCols = new Set(cols.filter((c) => c.data_type === 'json' || c.data_type === 'jsonb').map((c) => c.column_name));
    const valid = new Set(cols.map((c) => c.column_name));
    const { rows: [{ n }] } = await client.query(`select count(*)::int as n from "${table}"`);

    let inserted = 0;
    if (apply) {
      for (const row of rows) {
        const keys = Object.keys(row).filter((k) => valid.has(k));
        const values = keys.map((k) => (jsonCols.has(k) && row[k] !== null ? JSON.stringify(row[k]) : row[k]));
        const sql = `insert into "${table}" (${keys.map((k) => `"${k}"`).join(', ')}) values (${keys.map((_, i) => `$${i + 1}`).join(', ')}) on conflict do nothing`;
        const r = await client.query(sql, values);
        inserted += r.rowCount;
      }
    }
    console.log(`  ${table.padEnd(28)} copia: ${String(rows.length).padStart(5)} · ahora: ${String(n).padStart(5)}${apply ? ` · insertadas: ${inserted}` : ''}`);
  }
  await client.end();
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
