const mongoose = require("mongoose");
const Match = mongoose.model("matches");

module.exports.addMatch = async (req, res) => {
  const { amount } = req.body;
  const match = await new Match({
    amount,
    isOfficial: req.user.isAdmin || false,
    createdBy: req.user._id,
    createdOn: new Date()
  }).save();

  res.send(match);
};

module.exports.getAll = async (req, res) => {
  const { isOfficial } = req.query;

  const matches = await Match.find({ isOfficial: isOfficial || false });
  res.send(matches);
};

module.exports.update = async (req, res) => {
  const { matchId } = req.params;
  const match = await Match.findByIdAndUpdate(matchId, req.body);
  res.send(match);
};

module.exports.delete = async (req, res) => {
  const { matchId } = req.params;
  await Match.findOne({ _id: matchId, createdBy: req.user._id })
    .deleteOne()
    .exec();
  res.send();
};
