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
          console.log("match created from client: ", data);
          const match = await Match.find({ createdBy: data.id })
            .populate("createdBy")
            .sort({ _id: -1 })
            .limit(1)
            .exec();
          socket.broadcast.emit(SOCKET_EVENTS.serverMatchUpdates, match);
        });

        // server playRequested
        socket.on(SOCKET_EVENTS.clientPlayRequested, data => {
          console.log("Play requested from client: ", data);
          socket.broadcast.emit(SOCKET_EVENTS.serverPlayRequested, data);
        });

        // server playAccepted
        socket.on(SOCKET_EVENTS.clientPlayAccepted, data => {
          console.log("Play requested from client: ", data);
          socket.broadcast.emit(SOCKET_EVENTS.serverPlayAccepted, data);
        });

        socket.on(SOCKET_EVENTS.clientMatchDeleted, data => {
          console.log("Match Deleted by owner: ", data);
          socket.broadcast.emit(SOCKET_EVENTS.serverMatchDeleted, data);
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
