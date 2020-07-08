const mongoose = require("mongoose");
const SellRequest = mongoose.model("sellRequests");
const { SELLING_STATUS } = require("../../constants");
// const { getMailServer, getUnseenMail } = require("../../services/mailbox");
const { ErrorResponse, getTime } = require("../../utils");
const { asyncHandler } = require("../../middlewares");

// @desc      Buy Chips
// @route     POST /api/buy
// @access    Private
module.exports.buyChips = asyncHandler(async (req, res, next) => {
  req.user.chips += req.transaction.amount;
  const user = await req.user.save();
  res.send({ success: true, data: user });
});

// @desc      GET All Sell Request
// @route     GET /api/sell
// @access    Private
module.exports.getAllSellRequests = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
  // const sellRequests = await SellRequest.find()
  //   .sort({
  //     _id: -1
  //   })
  //   .limit(20)
  //   .exec();
  // res.send({ success: true, data: sellRequests });
});

// @desc      Add a Sell Request
// @route     POST /api/sell
// @access    Private
module.exports.addSellRequest = asyncHandler(async (req, res, next) => {
  const { amount, phone } = req.body;
  if (req.user.chips >= amount && amount >= 50) {
    const previousRequests = await SellRequest.find({
      userId: req.user._id,
      createdAt: { $gt: new Date(getTime() - 24 * 60 * 60 * 1000) }
    });
    if (previousRequests.length < 2) {
      await new SellRequest({
        amount,
        userId: req.user._id,
        phone,
        status: SELLING_STATUS.active
      }).save();
      req.user.chips -= amount;
      const user = await req.user.save();
      return res.send({ success: true, data: user });
    }

    return next(
      new ErrorResponse("You have too many Sell Request. Wait 24 hrs", 400)
    );
  }
  if (amount < 50) {
    return next(new ErrorResponse("Minimum amount is 50", 400));
  }
  next(new ErrorResponse("You don't have enough chips", 401));
});

// @desc      Update a Sell Request
// @route     UPDATE /api/sell/:sellId
// @access    Private
module.exports.updateSellRequest = asyncHandler(async (req, res, next) => {
  const { sellId } = req.params;
  const updatedSellRequest = await SellRequest.findByIdAndUpdate(
    sellId,
    req.body,
    { new: true }
  );
  res.send({ success: true, data: updatedSellRequest });
});

// @desc      Delete a Sell Request
// @route     DELETE /api/sell/:sellId
// @access    Private
module.exports.deleteSellRequest = asyncHandler(async (req, res, next) => {
  const { sellId } = req.params;
  const sellRequest = await SellRequest.findByIdAndDelete(sellId);
  res.send({ success: true, data: sellRequest });
});
