export default class Controller {
  #users = new Map();

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

  #onSocketData(id) {
    return data => {
      console.log('onSocketData: ', data.toString());
    }
  }

  #onSocketClosed(id) {
    return data => {
      console.log('onSocketClosed: ');
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