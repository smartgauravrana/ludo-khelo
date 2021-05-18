const mongoose = require("mongoose");
const SellRequest = mongoose.model("sellRequests");
const Match = mongoose.model("matches");
const Transaction = mongoose.model('transactions');
const User = mongoose.model('users');
const { SELLING_STATUS, MATCH_STATUS } = require("../../constants");
// const { getMailServer, getUnseenMail } = require("../../services/mailbox");
const { ErrorResponse, getTime } = require("../../utils");
const { asyncHandler } = require("../../middlewares");
const PaytmService = require("../../services/paytmService");

// @desc      Buy Chips
// @route     POST /api/buy
// @access    Private
module.exports.buyChips = asyncHandler(async (req, res, next) => {
  if(req.user.referrer && req.user.firstTimeBuyer){
    req.user.chips += req.transaction.amount + 0.1*req.transaction.amount; // 10% bonus for first time referred user
    req.user.firstTimeBuyer = false;
  } else{
    req.user.chips += req.transaction.amount;
  }
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

    // checking for if user played any match
    const matchPlayed = await Match.findOne({$or: [{createdBy: req.user._id}, {joinee: req.user._id}], status: {$nin: [MATCH_STATUS.created, MATCH_STATUS.playRequested]}});
    console.log("matchPlayed", matchPlayed);
    if(!matchPlayed)
      return next(new ErrorResponse("Play atleast one Match for Withdrawl!", 400));

    // checking for sell request within last 24hrs
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

module.exports.createTransaction = asyncHandler(async (req, res, next) => {
  const {amount} = req.body;
  if(!amount) {
    return next(new ErrorResponse('Amount is required', 400));
  }
  const response = await PaytmService.createTransactionToken({ amount });
  await Transaction.create({
    userId: req.user._id,
    amount,
    orderId: response.orderId
  });
  res.send({ success: true, data: response });
});


module.exports.handlePostTransaction = asyncHandler(async (req, res, next) => {
  const {ORDERID, STATUS } = req.body;
  await Transaction.findOneAndUpdate({
    orderId: ORDERID
  }, {
    orderId: ORDERID,
    status: STATUS
  });

  if(STATUS === 'TXN_SUCCESS'){
    const txn = await Transaction.findOne({orderId: ORDERID});
    if(txn){
      const user = await User.findById(txn.userId);
      user.chips += txn.amount;
      await user.save();
    }
  } else{
    console.log("Pending or failed TXN: ", req.body);
  }

  if (process.env.NODE_ENV === "production"){
    res.redirect('/')
  }else {
    res.rediret('htpp://localhost:8080')
  }
});