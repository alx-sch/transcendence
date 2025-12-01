import Fastify from 'fastify';
import websocket from '@fastify/websocket';
import { WebSocket } from 'ws';

const fastify = Fastify();

// register the WebSocket plugin
await fastify.register(websocket);

// simple WebSocket route for testing
fastify.get('/ws', { websocket: true }, (connection, req) => {
  console.log('New client connected');

  // listen for messages from the client

  connection.socket.on('message', (message) => {
    console.log('Received:', message.toString());

    // send a response back to the client
    connection.socket.send(`Echo: ${message}`);
  });
});

fastify.listen({ port: 3002 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Game service running on ws://localhost:3002/ws`);
});
