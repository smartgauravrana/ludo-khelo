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

module.exports.getOne = async (req, res) => {
  const { matchId } = req.params;

  const match = await Match.findOne({ _id: matchId })
    .populate("createdBy")
    .populate("joinee");
  res.send(match);
};

module.exports.getAll = async (req, res) => {
  const { isOfficial, history, page } = req.query;
  let query;
  if (history) {
    query = Match.find().or([
      { createdBy: req.user._id },
      { joinee: req.user._id }
    ]);
  }
  if (isOfficial) {
    query = Match.find({ isOfficial: isOfficial || false })
      .populate("createdBy")
      .populate("joinee");
  }
  query = query
    .sort({
      _id: -1
    })
    .skip(page || 0)
    .limit(10);
  const matches = await query.exec();
  res.send(matches);
};

module.exports.update = async (req, res) => {
  const { matchId } = req.params;
  const { isJoinee, roomId } = req.body;
  let updateObj = {};
  if (isJoinee) {
    updateObj = {
      ...updateObj,
      joinee: req.user._id,
      status: MATCH_STATUS.playRequested
    };
  }

  if (roomId) {
    updateObj = {
      ...updateObj,
      status: MATCH_STATUS.playAccepted,
      roomId
    };
  }
  let match = await Match.findByIdAndUpdate(matchId, updateObj, {
    new: true
  }).populate("createdBy");
  if (isJoinee) {
    req.user.chips -= match.amount;
    req.user.save();
  }
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
