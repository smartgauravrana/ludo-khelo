const socketIo = require("socket.io");
const { SOCKET_EVENTS } = require("../constants");

const mongoose = require("mongoose");
const Match = mongoose.model("matches");

module.exports = class IoService {
  constructor(server) {
    if (server && !IoService.instance) {
      this.io = socketIo(server);
      IoService.instance = this;

      // connection and disconnection events
      this.io.on("connection", socket => {
        console.log("User connected: ");

        socket.on(SOCKET_EVENTS.clientMatchPosted, async data => {
          console.log("Data received from client: ", data);
          const match = await Match.find({ createdBy: data.id })
            .sort({ _id: -1 })
            .limit(1)
            .exec();
          socket.broadcast.emit(SOCKET_EVENTS.serverMatchUpdates, match);
        });
        socket.on("disconnect", () => {
          console.log("Client disconnected");
        });
      });
    } else {
      this.io = IoService.instance.io;
    }
    return IoService.instance;
  }

  emit(event, data) {
    this.io.emit(event, data);
  }
};
