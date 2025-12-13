import type { FastifyInstance } from 'fastify';

// Starts the backend server (Fastify instance) on port 3000.
export async function start(fastify: FastifyInstance) {
  try {
    // '0.0.0.0' to listen on all interfaces within Docker
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('Server listening on all interfaces on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
