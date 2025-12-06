import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import type { WebSocket } from 'ws';

const fastify = Fastify({ logger: true });
fastify.register(websocket);

const clients = new Set<WebSocket>();
fastify.register(async function (fastify) {
  fastify.get('/chat', { websocket: true }, (socket, req) => {
    clients.add(socket);
    socket.on('message', (message) => {
      const text = message.toString();
      for (const client of clients) client.send(`Client sent ${text}`);
    });
  });
  fastify.get('/test', async () => {
    return { hello: 'world' };
  });
});
fastify.listen({ port: 3001 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
