import Events from "events";

import CliConfig from "./src/cliConfig.js";
import SocketClient from "./src/socket.js";

import TerminalController from "./src/terminalController.js";

const [ nodePath, filePath, ...commands ] = process.argv;

const componentEmitter = new Events();
const config = CliConfig.parseArguments(commands);
const socketClient = new SocketClient(config);

await socketClient.initialize();

// const controller = new TerminalController();
// await controller.initializeTable(componentEmitter);