import Fastify from 'fastify';
import websocket from '@fastify/websocket';

const fastify = Fastify();
fastify.register(websocket);
fastify.register(async function (fastify) {
  fastify.get('/', { websocket: true }, (socket /* WebSocket */, req /* FastifyRequest */) => {
    socket.on('message', (message) => {
      // message.toString() === 'hi from client'
      socket.send('hi from server');
    });
  });
  fastify.get('/test', async () => {
    return { hello: 'world' };
  });
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
