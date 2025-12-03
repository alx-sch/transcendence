import dotenv from "dotenv";
import Fastify from 'fastify';
import type { FastifyInstance } from "fastify";
import formbody from '@fastify/formbody';
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";

// Create and configure Fastify server instance (with cookie and session support).
// @returns Configured Fastify instance.

export async function createFastifyServer(isDev: boolean): Promise<FastifyInstance> {

	// Setup Fastify server
	const fastify = Fastify({
	logger: isDev
		? {
			// DEV: Configuration object with pino-pretty transport
			transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:HH:MM:ss',
				ignore: 'pid,hostname',
			},
			},
		}
		: true, // PROD: Use `true` for default Fastify logger (JSON format)
	});

	// ------------------------------------
	// Set up session and cookie plugins
	// ------------------------------------

	// Load environment variables from .env file
	dotenv.config({ path: "../../../deployment/.env" });

	// Retrieve secrets from environment variables
	const COOKIE_SECRET = process.env.COOKIE_SECRET;
	const SESSION_SECRET = process.env.SESSION_SECRET;

	// If any of them are not there, the server cannot start
	if (!COOKIE_SECRET || !SESSION_SECRET) {
	fastify.log.error("FATAL ERROR: COOKIE_SECRET and SESSION_SECRET must be set in /deployment/.env.");
	process.exit(1);
	}

	// Set up Fastify plugins
	fastify.register(formbody); // Allows Fastify to read <form> POST data
	await fastify.register(fastifyCookie, { // Cookies are required for storing the session ID
	secret: COOKIE_SECRET // used to sign cookies
	});
	await fastify.register(fastifySession, { // Allows session management
	secret: SESSION_SECRET, 
	cookie: {
		secure: false,  // Should be true in production (requires HTTPS)
		maxAge: 1000 * 60 * 60 * 24 // 1 day
	}
	});

	return fastify;
}