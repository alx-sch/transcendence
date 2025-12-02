import { info } from '../../logger.js';
import type { FastifyInstance } from "fastify";

export const start = async (fastify: FastifyInstance) => { // Start the server
  try {
    await fastify.listen({ port: 3000 });
	info('Server listening at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
