import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    // drizzle-kit is a dev dependency and only ever runs against the local file.
    // The production image applies the generated SQL with scripts/migrate.js instead.
    url: process.env.DATABASE_URL || 'local.db',
  },
});
