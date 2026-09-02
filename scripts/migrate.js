// Standalone migration runner used by entrypoint.sh in the production image.
//
// This exists instead of `drizzle-kit migrate` so drizzle-kit can stay a dev
// dependency.
// drizzle-kit bundles esbuild, which drags Go stdlib CVEs into the runtime
// image even though the binary is never executed there. drizzle-orm's
// migrator reads the generated SQL in ./drizzle directly and needs neither
// drizzle.config.ts nor the schema source.
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { join } from 'node:path';

// Resolved from this file, not the CWD: a wrong CWD would otherwise make the
// migrator find no journal and report success without applying anything.
const migrationsFolder = join(import.meta.dirname, '..', 'drizzle');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error('DATABASE_URL is not set');

const client = new Database(databaseUrl);

try {
  // journal_mode is stored in the database file, so setting it here is what puts the
  // app's own connections into WAL too. foreign_keys is per-connection and only covers
  // the migration itself.
  client.pragma('journal_mode = WAL');
  client.pragma('foreign_keys = ON');

  migrate(drizzle(client), { migrationsFolder });
  console.log('Migrations applied.');
} finally {
  // Swallowed: a failing close must not replace the migration error that caused it.
  try {
    client.close();
  } catch {
    /* ignore */
  }
}
