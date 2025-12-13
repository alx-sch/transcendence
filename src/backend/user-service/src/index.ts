import { createFastifyServer } from './core/fastify-setup.js';
import { setupDatabase } from './core/db-setup.js';
import { registerUserRoutes } from './app/routes.js';
import { start } from './core/server.js';

const isDev = process.env.NODE_ENV === 'development'; // Determine if in development mode

// ------------------------------------
// Main Application Entry Point
// ------------------------------------

const fastify = await createFastifyServer(isDev); // Create Fastify server instance
const db = setupDatabase(isDev, fastify); // Set up and get the database instance
registerUserRoutes(fastify, db); // Whenever a request comes in for /user/*, it will be handled by the user routes
start(fastify); // Start the server
