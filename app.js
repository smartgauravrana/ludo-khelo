require("dotenv").config();

// db related stuff
require("./api/data/db");
require("./api/data/model/match.model");
require("./api/data/model/user.model");
require("./api/data/model/sellRequest.model");
// for inject env variables from config

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

// Mail searching
const { startMailServer } = require("./services/mailbox");
startMailServer();

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

server.listen(3000, () => {
  console.log("Server is running at port 3000 ;)");
});
