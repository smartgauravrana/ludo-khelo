const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", function () {
  console.log("mongoose connected to " + process.env.MONGO_URI);
});

mongoose.connection.on("disconnected", function () {
  console.log("mongoose disconnected");
});

mongoose.connection.on("error", function (err) {
  console.log("mongoose connection error" + err);
});

process.once("SIGUSR2", function () {
  mongoose.connection.close(function () {
    console.log("mongoose disconnected through app termination");
    process.kill(process.pid, "SIGUSR2");
  });
});
