import Event from 'events';
import { constants } from './constants.js';
import Controller from './controller.js';

import SocketServer from "./socket.js";

const PORT = process.env.PORT || 9898;

const eventEmitter = new Event();

// async function testServer() {
//   const options = {
//     port: 9898,
//     host: 'localhost',
//     headers: {
//       Connection: 'Upgrade',
//       Upgrade: 'webSocket',
//     }
//   }

//   const http = await import('http');
//   const req = http.request(options);
//   req.end();

//   req.on('upgrade', (res, socket) => {
//     socket.on('data', data => {
//       console.log('Client received: ', data.toString());
//     });

//     setInterval(() => {
//       socket.write('hello server!');
//     }, 500);
//   });
// }

const socketServer = new SocketServer({ port: PORT });
const server = await socketServer.initialize(eventEmitter);

console.log('socket server is running at: ', server.address().port);
const controller = new Controller({ socketServer });

eventEmitter.on(
  constants.events.NEW_USER_CONNECTED, 
  controller.onNewConnection.bind(controller)
);

// eventEmitter.on(constants.events.NEW_USER_CONNECTED, socket => {
//   console.log('new connected: ', socket.id);

//   socket.on('data', data => {
//     console.log('server received: ', data.toString());
//     socket.write('hello client!');
//   });
// })

// await testServer();