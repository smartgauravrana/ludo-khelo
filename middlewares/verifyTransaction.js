const { getMailServer, getUnseenMail } = require("../services/mailbox");
const { getPaytmDetails, ErrorResponse } = require("../utils");

const verifyTransaction = async (req, res, next) => {
  const { transactionId, amount } = req.body;
  // for dev testing
  if (transactionId === process.env.TEST_TRANSACTION) {
    req.transaction = {
      ...req.body
    };
    return next();
  }
  // getMailServer();
  const cb = (mailServer) => getUnseenMail(
    { server: mailServer, data: transactionId },
    async (err, data) => {
      if (err) return next(new ErrorResponse("Something went wrong!", 500));
      const { mailText, uid } = data;
      if (mailText) {
        const transaction = getPaytmDetails(mailText);
        console.log("transaction: ", transaction);
        console.log("body: ", req.body);
        if (
          transactionId === transaction.transactionId &&
          parseInt(amount, 10) === transaction.amount
        ) {
          mailServer.setFlags(uid, ["\\SEEN"], err => {
            if (err) console.log("error while setting flag", err);
          });
          req.transaction = transaction;
          next();
          // req.user.chips += transaction.amount;
          // const user = await req.user.save();
          // res.send({ success: true, data: user });
        } else {
          return next(new ErrorResponse("Wrong amount supplied!", 400));
        }
      } else {
        return next(new ErrorResponse("Transaction Id not exist!", 400));
      }
    }
  );
  getMailServer(cb);
};

module.exports = verifyTransaction;
