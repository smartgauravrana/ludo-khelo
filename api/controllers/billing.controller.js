const mongoose = require("mongoose");
const SellRequest = mongoose.model("sellRequests");
const { SELLING_STATUS } = require("../../constants");

module.exports.buyChips = async (req, res) => {
  // const {transactionId, amount} = req.body
  res.send(req.user);
};

module.exports.getAllSellRequests = async (req, res) => {
  const sellRequests = await SellRequest.find()
    .sort({
      _id: -1
    })
    .limit(20)
    .exec();
  res.send(sellRequests);
};

module.exports.addSellRequest = async (req, res) => {
  const { amount } = req.body;
  if (req.user.chips > amount && amount >= 50) {
    await new SellRequest({
      amount,
      userId: req.body._id,
      status: SELLING_STATUS.active
    }).save();
    req.user.chips -= amount;
    const user = await req.user.save();
    return res.send(user);
  }
  res.status(401).send({ msg: "You don't have enough chips" });
};

module.exports.deleteSellRequest = async (req, res) => {
  const { sellId } = req.params;
  const sellRequest = await SellRequest.findByIdAndDelete(sellId);
  res.send(sellRequest);
};
