// db related stuff
require("./api/data/db");
require("./api/data/model/user.model");

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const routes = require("./api/routes");

const app = express();

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

app.listen(3000, () => {
  console.log("Server is running at port 3000 ;)");
});
