// db related stuff
require("./api/data/db");
require("./api/data/model/match.model");
require("./api/data/model/user.model");

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
// const socketIo = require("socket.io");
const IoService = require("./services/IoService");

const app = express();
const server = http.createServer(app);

const io = new IoService(server);
const routes = require("./api/routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["bdhaijadhnichb"]
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

require("./services/passport");

app.use("/api", routes);

// io.on("connection", socket => {
//   console.log("User connected: ", socket);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

server.listen(3000, () => {
  console.log("Server is running at port 3000 ;)");
});
