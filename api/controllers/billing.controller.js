const mongoose = require("mongoose");
const SellRequest = mongoose.model("sellRequests");
const { SELLING_STATUS } = require("../../constants");
const { getMailServer, getUnseenMail } = require("../../services/mailbox");
const { getPaytmDetails, ErrorResponse } = require("../../utils");
const { asyncHandler } = require("../../middlewares");

// @desc      Buy Chips
// @route     POST /api/buy
// @access    Private
module.exports.buyChips = asyncHandler(async (req, res, next) => {
  const { transactionId, amount } = req.body;
  const mailServer = getMailServer();
  getUnseenMail(
    { server: mailServer, data: transactionId },
    async (err, data) => {
      if (err) return next(new ErrorResponse("Something went wrong!", 500));
      const { mailText, uid } = data;
      if (mailText) {
        const transaction = getPaytmDetails(mailText);
        if (
          transactionId === transaction.transactionId &&
          parseInt(amount, 10) === transaction.amount
        ) {
          mailServer.setFlags(uid, ["\\SEEN"], err => {
            if (err) console.log("error while setting flag", err);
          });
          req.user.chips += transaction.amount;
          const user = await req.user.save();
          res.send({ success: true, data: user });
        } else {
          return next(new ErrorResponse("Wrong details supplied!", 400));
        }
      } else {
        return next(new ErrorResponse("Transaction Id not exist!", 400));
      }
    }
  );
});

// @desc      GET All Sell Request
// @route     GET /api/sell
// @access    Private
module.exports.getAllSellRequests = asyncHandler(async (req, res, next) => {
  const sellRequests = await SellRequest.find()
    .sort({
      _id: -1
    })
    .limit(20)
    .exec();
  res.send({ success: true, data: sellRequests });
});

// @desc      Add a Sell Request
// @route     POST /api/sell
// @access    Private
module.exports.addSellRequest = asyncHandler(async (req, res, next) => {
  const { amount, phone } = req.body;
  if (req.user.chips >= amount && amount >= 50) {
    await new SellRequest({
      amount,
      userId: req.body._id,
      phone,
      status: SELLING_STATUS.active
    }).save();
    req.user.chips -= amount;
    const user = await req.user.save();
    return res.send({ success: true, data: user });
  }
  if (amount < 50) {
    return next(new ErrorResponse("Minimum amount is 50", 400));
  }
  next(new ErrorResponse("You don't have enough chips", 401));
});

// @desc      Delete a Sell Request
// @route     DELETE /api/sell/:sellId
// @access    Private
module.exports.deleteSellRequest = asyncHandler(async (req, res, next) => {
  const { sellId } = req.params;
  const sellRequest = await SellRequest.findByIdAndDelete(sellId);
  res.send({ success: true, data: sellRequest });
});
