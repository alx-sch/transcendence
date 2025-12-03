import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';
import type { FastifyInstance } from "fastify";

// Setup and return the BetterSqlite3 database connection 
// (creates file if missing, applies schema, seeds data if table is empty).

export function setupDatabase(isDev: boolean, fastify: FastifyInstance): BetterSqlite3.Database {

// ------------------------------------
// Path Configuration
// ------------------------------------

// __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = process.cwd();

// ASSETS (Read-Only): Where do schema.sql and seed.sql live?
// - In Dev: ProjectRoot/data
// - In Prod: /app/dist/data (Copied via 'postbuild' script)
const assetsDir = isDev ? path.join(rootDir, 'data') : path.join(__dirname, 'data');

// STORAGE (Read-Write): Where does the SQLite file live?
// - In Docker: Setting DB_STORAGE_PATH to '/app/storage' via Docker Compose
// - In Dev: Default to the 'storage'
const storageDir = process.env.DB_STORAGE_PATH || path.join(rootDir, 'storage');
const dbFile = path.join(storageDir, 'app.sqlite');

fastify.log.info(`Assets (SQL) Path: ${assetsDir}`);
fastify.log.info(`Database Path: ${dbFile}`);

// Ensure storage directory exists
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// ------------------------------------
// Database Initialization
// ------------------------------------

// Delete old dev database if in dev-mode
if (isDev && fs.existsSync(dbFile)) {
  try {
	fs.unlinkSync(dbFile);
	fastify.log.info('Old dev database deleted.');
  } catch (e) {
	fastify.log.warn('Could not delete old dev DB, continuing...');
  }
}

// Open database (creates file if missing)
const db = new Database(dbFile);
// Optional but recommended: better concurrency and faster writes
db.pragma('journal_mode = WAL');

// ------------------------------------
// Schema & Seeding
// ------------------------------------

// Load scheme (CREATE TABLE IF NOT EXISTS ...)
const schemaPath = path.join(assetsDir, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSQL);
  fastify.log.info('Database schema applied.');
} else {
  fastify.log.error(`Schema file not found at ${schemaPath}`);
}

// Seed Data (if empty)
try {
  const retObj = db.prepare('SELECT COUNT(*) AS count FROM users').get() as {
	count: number;
  };
  const userCount = retObj.count;

  if (userCount === 0) {
	const seedPath = path.join(assetsDir, 'seed.sql');
	if (fs.existsSync(seedPath)) {
	  const seedSQL = fs.readFileSync(seedPath, 'utf-8');
	  db.exec(seedSQL);
	  fastify.log.info('Database seeded with demo users.');
	} else {
	  fastify.log.warn('No seed.sql found, skipping seed.');
	}
  } else {
	fastify.log.info('Users table already populated, skipping seed.');
  }
} catch (e) {
  fastify.log.error(e, 'Error checking user count or seeding:');
}
return db;
}
