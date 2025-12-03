import { setupDatabase } from './core/db-setup.js';
import { registerUserRoutes } from './app/routes.js';
import { createFastifyServer } from './core/fastify-setup.js';
import { start } from './core/server.js';

const db = setupDatabase(); // Set up and get the database instance
const fastify = await createFastifyServer(); // Create Fastify server instance
registerUserRoutes(fastify, db); // Whenever a request comes in for /user/*, it will be handled by the user routes
start(fastify);	// Start the server
