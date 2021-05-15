require("dotenv").config();

// db related stuff
require("./api/data/db");
require("./api/data/model/setting.model");
require("./api/data/model/user.model");
require("./api/data/model/match.model");
require("./api/data/model/sellRequest.model");
require("./api/data//model/transaction.model");
// for inject env variables from config

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const expressStaticGzip = require("express-static-gzip");
// const socketIo = require("socket.io");
const IoService = require("./services/IoService");
const { errorHandler } = require("./middlewares");

// security related packages
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();
const server = http.createServer(app);

const io = new IoService(server);
const routes = require("./api/routes");

// Mail searching
// const { startMailServer } = require("./services/mailbox");
// startMailServer();

// Helmet
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//         defaultSrc: ["'self'"],
//         frameSrc: ["'self'", "*.youtube.com"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         scriptSrc: ["'self'", "'unsafe-inline'", "*.google-analytics.com", "*.googletagmanager.com", "*.onesignal.com", "onesignal.com"],
//         connectSrc: ["'self'", "*.google-analytics.com", "*.googleapis.com"],
//         imgSrc: ["*.google-analytics.com"]
//     }
//   }
// }));

const limit = rateLimit({
  max: 90,// max requests
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: 'Too many requests' // message to send
});

app.use('/api/register', limit); // Setting limiter on specific route

app.use(bodyParser.json({limit: '20kb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
// Data Sanitization against XSS attacks
app.use(xss())

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

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(
    expressStaticGzip("build", {
      enableBrotli: true,
      customCompressions: [
        {
          encodingName: "deflate",
          fileExtension: "zz"
        }
      ],
      orderPreference: ["br", "gz"]
    })
  );

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

server.listen(3000, () => {
  console.log("Server is running at port 3000 ;)");
});
