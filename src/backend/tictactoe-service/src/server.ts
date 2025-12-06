import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { gameLogic } from './gameLogic.js';

const fastify = Fastify({ logger: true });
fastify.register(websocket);

fastify.register(async function (fastify) {
  fastify.get('/tictactoe', { websocket: true }, (socket, req) => {
    socket.on('message', (message) => {
      const messageJson = JSON.parse(message.toString());
      const result = gameLogic(messageJson);
      if (result) {
        socket.send(JSON.stringify(result));
      }
    });
  });
});

fastify.listen({ port: 3002 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
