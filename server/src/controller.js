import { constants } from "./constants.js";

export default class Controller {
  #users = new Map();
  #rooms = new Map();

  constructor({ socketServer }) {
    this.socketServer = socketServer;
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('connection stablised with: ', id);

    const userData = { id, socket };
    this.#updateGlobaUserData(id, userData);


    socket.on('data', this.#onSocketData(id));
    socket.on('error', this.#onSocketClosed(id));
    socket.on('end', this.#onSocketClosed(id));
  }

  async joinRoom(sockerId, data) {
    const userData = data;
    const { roomId } = userData;
    const user = this.#updateGlobaUserData(sockerId, userData);

    const users = this.#joinUserOnRoom(roomId, user);
    const currentUsers = Array.from(users.values())
      .map(({ id, userName }) => ({ userName, id }));

    this.socketServer.sendMessage(user.socket, constants.events.UPDATE_USERS, currentUsers);
    console.log(`${userData.userName} joined: ${[sockerId]}`);

    this.broadCast({
      sockerId,
      roomId,
      message: { id: sockerId, userName: userData.userName },
      events: constants.events.NEW_USER_CONNECTED,
    });
  }

  broadCast({ socketId, roomId, event, message, includeCurrentSocket = false, }) {
    const usersOnRoom = this.#rooms.get(roomId);

    for (const [key, user] of usersOnRoom) {
      if (!includeCurrentSocket && key === sockerId) continue;

      this.socketServer.sendMessage(user.socket, event, message);
    }
  }

  #joinUserOnRoom(roomId, user) {
    const usersOnRoom = this.#rooms.get(roomId) ?? new Map();
    usersOnRoom.set(user.id, user);
    this.#rooms.set(roomId, usersOnRoom);

    return usersOnRoom;
  }

  #onSocketData(id) {
    return data => {
      try {
        const { event, message } = JSON.parse(data);
        this[event](id, message);
      } catch(err) {
        console.log(`Wrong event format! `, data.toString());
      }
    }
  }

  #onSocketClosed(id) {
    return data => {
      console.log('onSocketClosed: ', id);
    }
  }

  #updateGlobaUserData(sockerId, userData) {
    const users = this.#users;
    const user = users.get(sockerId) ?? {};

    const updateUserData = {
      ...user,
      ...userData,
    };

    users.set(sockerId, updateUserData);

    return users.get(sockerId);
  }
}