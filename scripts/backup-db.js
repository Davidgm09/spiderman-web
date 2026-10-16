/**
 * Copia de seguridad de toda la base de datos en JSON (una carpeta con fecha en backups/).
 * El plan gratuito de Supabase no ofrece copias descargables: ejecútalo de vez en cuando
 * (por ejemplo, una vez a la semana y antes de cualquier cambio grande).
 *
 * Uso: node scripts/backup-db.js
 * Restaurar: node scripts/restore-db.js backups/<carpeta>   (ver ese script)
 */

require('dotenv').config({ path: '.env' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async () => {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Falta DIRECT_URL o DATABASE_URL en .env');
  const client = new Client({ connectionString: url });
  await client.connect();

  const stamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '');
  const dir = path.join(__dirname, '..', 'backups', stamp);
  fs.mkdirSync(dir, { recursive: true });

  const { rows: tables } = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' and table_name <> '_prisma_migrations' order by table_name"
  );

  const manifest = { createdAt: new Date().toISOString(), tables: {} };
  let total = 0;
  for (const { table_name: table } of tables) {
    const { rows } = await client.query(`select * from "${table}"`);
    fs.writeFileSync(path.join(dir, `${table}.json`), JSON.stringify(rows));
    manifest.tables[table] = rows.length;
    total += rows.length;
    console.log(`  ${table.padEnd(28)} ${rows.length}`);
  }
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 1));
  await client.end();

  const size = fs.readdirSync(dir).reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0);
  console.log(`\n✅ ${tables.length} tablas, ${total} filas, ${(size / 1024 / 1024).toFixed(1)} MB → backups/${stamp}`);
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
