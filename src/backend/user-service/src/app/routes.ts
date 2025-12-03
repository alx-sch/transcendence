import { createHandlers } from './handlers.js';
import type { FastifyInstance } from "fastify";
import BetterSqlite3 from 'better-sqlite3';

// Register user-related routes with their handlers
export function registerUserRoutes(fastify: FastifyInstance, db: BetterSqlite3.Database) {

	const { testHandler, registerHandler, userHandler, loginHandler, sessionHandler, logoutHandler } = createHandlers(db);

	fastify.get('/', testHandler);
	fastify.get('/users', userHandler);
	fastify.post('/register', registerHandler);
	fastify.post('/login', loginHandler);
	fastify.get('/session', sessionHandler);
	fastify.post('/logout', logoutHandler);
}
