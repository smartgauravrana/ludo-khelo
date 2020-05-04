const Imap = require("imap");
// const inspect = require("util").inspect;

const getUnseenMail = (server, getMailCb) => {
  console.log("unseen mail called!");
  server.openBox("INBOX", false, function (err, box) {
    if (err) {
      console.log(err);
      return;
    }
    server.search(["UNSEEN", ["TEXT", "28568591941"]], function (err, results) {
      if (err) {
        return console.log("fetch unseen mail err! ", err);
      }
      if (results && results.length) {
        const f = server.fetch(results, { bodies: "" });
        const simpleParser = require("mailparser").simpleParser;

        f.on("message", function (msg, seqno) {
          let uid = "";
          // let headers = "";

          // let body = "";
          msg.on("body", function (stream, info) {
            simpleParser(stream, (err, parsed) => {
              if (!err) {
                // console.log(parsed.text);
                getMailCb(parsed.text);
              }
            });
          });
          msg.once("attributes", function (attrs) {
            uid = attrs.uid;
            // server.setFlags(uid, ["\\SEEN"], err => {
            //   console.log("error while setting flag", err);
            // });
            // console.log(attrs);
          });
        });

        f.once("error", function (err) {
          return Promise.reject(err);
        });
      }
    });
  });
};

let mailServer;

function getMailServer() {
  return mailServer;
}

function startMailServer() {
  if (mailServer) {
    return mailServer;
  }
  mailServer = new Imap({
    user: "ludokhelo99@gmail.com",
    password: "vodafone8053",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    },
    authTimeout: 3000
  }).once("error", function (err) {
    console.log("Source Server Error:- ", err);
  });
  mailServer.once("ready", function () {
    mailServer.openBox("INBOX", true, function (err, box) {
      if (err) throw err;
      console.log("message", "server1 ready");
    });

    // mail operation
    // getUnseenMail(mailServer);
  });
  mailServer.on("mail", function (num) {
    console.log("new mail ", num);
  });
  mailServer.connect();
}

// const mailServer = new Imap({
//   user: "ludokhelo99@gmail.com",
//   password: "vodafone8053",
//   host: "imap.gmail.com",
//   port: 993,
//   tls: true,
//   tlsOptions: {
//     rejectUnauthorized: false
//   },
//   authTimeout: 3000
// }).once("error", function (err) {
//   console.log("Source Server Error:- ", err);
// });
// mailServer.once("ready", function () {
//   mailServer.openBox("INBOX", true, function (err, box) {
//     if (err) throw err;
//     console.log("message", "server1 ready");
//   });

//   // mail operation
//   getUnseenMail(mailServer);
// });
// mailServer.on("mail", function (num) {
//   console.log("new mail ", num);
// });
// mailServer.connect();

module.exports = { getMailServer, getUnseenMail, startMailServer };
