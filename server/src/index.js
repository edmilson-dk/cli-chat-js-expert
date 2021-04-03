import Event from 'events';

import SocketServer from "./socket.js";

const PORT = process.env.PORT || 9898;

const eventEmitter = new Event();

const socketServer = new SocketServer({ port: PORT });
const server = await socketServer.initialize(eventEmitter);

console.log('socket server is running at: ', server.address().port);