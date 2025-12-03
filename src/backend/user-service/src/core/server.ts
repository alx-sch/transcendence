import { info } from '../utils/logger.js';
import type { FastifyInstance } from "fastify";

// Starts the backend server (Fastify instance) on port 3000.
export const start = async (fastify: FastifyInstance) => {
  try {
    await fastify.listen({ port: 3000 });
	info('Server listening at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
