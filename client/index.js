import Events from "events";

import CliConfig from "./src/cliConfig.js";
import EventManager from "./src/eventManager.js";
import SocketClient from "./src/socket.js";

import TerminalController from "./src/terminalController.js";

const [ nodePath, filePath, ...commands ] = process.argv;

const componentEmitter = new Events();
const config = CliConfig.parseArguments(commands);
const socketClient = new SocketClient(config);
const eventManager = new EventManager({ componentEmitter, socketClient });

await socketClient.initialize();

const data = {
  roomId: config.room,
  userName: config.username,
};

eventManager.joinRoomAndWaitFortMessage(data);

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);