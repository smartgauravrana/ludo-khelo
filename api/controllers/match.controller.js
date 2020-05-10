const mongoose = require("mongoose");
const Match = mongoose.model("matches");
const { MATCH_STATUS } = require("../../constants");

module.exports.addMatch = async (req, res) => {
  const { amount } = req.body;
  const match = await new Match({
    amount,
    isOfficial: req.user.isAdmin || false,
    createdBy: req.user,
    createdOn: new Date()
  }).save();
  req.user.chips -= amount;
  req.user.save();
  match.createdBy = req.user;
  res.send(match);
};

module.exports.getAll = async (req, res) => {
  const { isOfficial } = req.query;

  const matches = await Match.find({ isOfficial: isOfficial || false })
    .populate("createdBy")
    .populate("joinee")
    .sort({
      _id: -1
    })
    .limit(20)
    .exec();
  res.send(matches);
};

module.exports.update = async (req, res) => {
  const { matchId } = req.params;
  const { isJoinee } = req.body;
  let updateObj = {};
  if (isJoinee) {
    updateObj = {
      ...updateObj,
      joinee: req.user._id,
      status: MATCH_STATUS.playRequested
    };
  }
  let match = await Match.findByIdAndUpdate(matchId, updateObj, {
    new: true
  }).populate("createdBy");
  req.user.chips -= match.amount;
  req.user.save();
  match = match.toObject();
  match.joinee = req.user;
  res.send(match);
};

module.exports.delete = async (req, res) => {
  const { matchId } = req.params;
  const match = await Match.findOne({ _id: matchId, createdBy: req.user._id });
  req.user.chips += match.amount;
  match.delete();
  const user = await req.user.save();
  res.send(user);
};
