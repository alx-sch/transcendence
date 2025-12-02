import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Fastify from 'fastify';
import formbody from '@fastify/formbody';
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import dotenv from "dotenv";
import Database from 'better-sqlite3';
import { info, warn, error, debug } from '../logger.js';
import { createHandlers } from './handlers.js';

// __filename and __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: "../../../deployment/.env" });

// Retrieve secrets from environment variables
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

// If any of them are not there, the server cannot start
if (!COOKIE_SECRET || !SESSION_SECRET) {
  error("FATAL ERROR: COOKIE_SECRET and SESSION_SECRET must be set in environment variables.");
  process.exit(1);
}

// Setup Fastify server
const fastify = Fastify({ logger: true });

// Set up Fastify plugins
fastify.register(formbody); // Allows Fastify to read <form> POST data
await fastify.register(fastifyCookie, { // Cookies are required for storing the session ID
  secret: COOKIE_SECRET // used to sign cookies
});
await fastify.register(fastifySession, { // Allows session management
  secret: SESSION_SECRET, 
  cookie: {
    secure: false,  // set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
});

const dbDir = path.join(__dirname, 'db');
const dbFile = path.join(dbDir, 'app.sqlite');

const isDev = process.env.NODE_ENV !== 'production';

// Delete old dev database if in dev-mode
if (isDev && fs.existsSync(dbFile)) {
  fs.unlinkSync(dbFile);
  info('Old dev database deleted.');  
}

// Open database (creates file if missing)
const db = new Database(dbFile);

// Optional but recommended: better concurrency and faster writes
db.pragma('journal_mode = WAL');

// Load scheme (CREATE TABLE IF NOT EXISTS ...)
const schemaPath = path.join(dbDir, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSQL);
  info('Dev database created with schema.');
} else {
  warn('schema.sql not found, database tables not created.');
}

// Seed demo users only if table is empty
const retObj = db.prepare('SELECT COUNT(*) AS count FROM users').get() as { count : number};
const userCount = retObj.count;

if (userCount === 0) {
  const seedPath = path.join(dbDir, 'seed.sql');
  if (fs.existsSync(seedPath)) {
    const seedSQL = fs.readFileSync(seedPath, 'utf-8');
    db.exec(seedSQL);
    info('Demo users seeded.');
  } else {
    warn('No seed.sql found, skipping seed.');
  }
} else {
  info('Users table already populated, skipping seed.');
}

// Routes
const { registerHandler, userHandler, loginHandler, sessionHandler, logoutHandler } = createHandlers(db);
fastify.get('/users', userHandler);
fastify.post('/register', registerHandler);
fastify.post('/login', loginHandler);
fastify.get('/session', sessionHandler);
fastify.post('/logout', logoutHandler);

fastify.get('/', (request, reply) => {
  return { hello: 'world' };
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    info('Server listening at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
