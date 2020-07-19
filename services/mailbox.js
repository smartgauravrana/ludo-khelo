const Imap = require("imap");
// const inspect = require("util").inspect;

const getUnseenMail = ({ server, data }, getMailCb) => {
  console.log("unseen mail called!");
  server.openBox("INBOX", false, function (err, box) {
    if (err) {
      console.log(err);
      return getMailCb(err);
    }
    server.search(["UNSEEN", ["TEXT", data]], function (err, results) {
      if (err) {
        console.log("fetch unseen mail err! ", err);
        return getMailCb(err);
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
                getMailCb(null, { mailText: parsed.html, uid });
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
      } else {
        getMailCb(null, {});
      }
    });
  });
};

// let mailServer;

// function getMailServer() {
//   return mailServer;
// }

function getMailServer(cb) {
  // if (mailServer) {
  //   return mailServer;
  // }
  const mailServer = new Imap({
    user: process.env.MAIL_ID,
    password: process.env.MAIL_PWD,
    // host: "imap.gmail.com",
    host: "outlook.office365.com",
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
      cb(mailServer);
    });
  });
  // reconnecting
  // mailServer.once("end", () => {
  //   console.log("mailbox ended!");
  // });
  // mailServer.once("close", () => {
  //   console.log("mailbox closed!");
  //   mailServer = null;
  //   startMailServer();
  // });
  // new mail listener
  // mailServer.on("mail", function (num) {
  //   console.log("new mail ", num);
  // });
  mailServer.connect();
  // return mailServer;
}

module.exports = { getMailServer, getUnseenMail };
