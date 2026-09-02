import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';

// Defaults to the repo-root file used in development.
// In docker it's pointed at a mounted volume.
const client = new Database(env.DATABASE_URL || 'local.db');

export const db = drizzle(client);
