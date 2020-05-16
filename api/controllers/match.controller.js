const mongoose = require("mongoose");
const Match = mongoose.model("matches");
const User = mongoose.model("users");
const { MATCH_STATUS, RESULT_OPTIONS } = require("../../constants");
const { isEmpty } = require("../../utils");

module.exports.addMatch = async (req, res) => {
  const { amount } = req.body;
  const match = await new Match({
    amount,
    isOfficial: req.user.isAdmin || false,
    createdBy: req.user,
    createdOn: new Date()
  }).save();
  req.user.chips -= amount;
  req.user.matchInProgress = 1;
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
  } else {
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
    req.user.matchInProgress = 1;
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

module.exports.postResult = async (req, res) => {
  console.log("body: ", req.body);
  const { matchId, resultType, cancelReason, imgUrl } = req.body;

  // finding match
  const match = await Match.findById({ _id: matchId });
  if (!match) {
    res.status(404).send({ msg: "Match not found!" });
  }

  let result;

  // finding other User of match
  const otherUserId =
    req.user._id.toString() !== match.createdBy.toString()
      ? match.createdBy
      : match.joinee;

  // check for resultType
  switch (resultType) {
    case RESULT_OPTIONS.cancel:
      if (isEmpty(match.resultsPosted.cancel)) {
        console.log("inside if", match.resultsPosted);
        // on hold and push data
        result = await Match.findByIdAndUpdate(
          matchId,
          {
            $set: { status: MATCH_STATUS.onHold },
            $push: {
              "resultsPosted.cancel": { postedBy: req.user._id, cancelReason }
            }
          },
          {
            new: true
          }
        );
        req.user.matchInProgress = 0;
        await req.user.save();
      } else {
        console.log("cancel is not empty");
        result = await Match.findByIdAndUpdate(
          matchId,
          {
            $set: { status: MATCH_STATUS.cancelled },
            $push: {
              "resultsPosted.cancel": { postedBy: req.user._id, cancelReason }
            }
          },
          {
            new: true
          }
        );
        req.user.chips += match.amount;
        await req.user.save();
        await User.findByIdAndUpdate(otherUserId, {
          $inc: { chips: match.amount },
          $set: { matchInProgress: 0 }
        }).exec();
      }
      break;
    case RESULT_OPTIONS.lost:
      // change status and reward money to winner
      result = await Match.findByIdAndUpdate(
        matchId,
        {
          $set: { status: MATCH_STATUS.completed, winner: otherUserId },
          $push: {
            "resultsPosted.lost": { postedBy: req.user._id }
          }
        },
        {
          new: true
        }
      );
      req.user.matchInProgress = 0;
      await req.user.save();
      await User.findByIdAndUpdate(otherUserId, {
        $inc: { chips: match.amount },
        $set: { matchInProgress: 0 }
      }).exec();
      break;
    case RESULT_OPTIONS.won:
      // store it for manual approval later on
      result = await Match.findByIdAndUpdate(
        matchId,
        {
          $set: { status: MATCH_STATUS.onHold },
          $push: {
            "resultsPosted.won": { postedBy: req.user._id, imgUrl }
          }
        },
        {
          new: true
        }
      );
      break;
    default:
      return;
  }

  // match.resultsPosted[resultType].push({ postedBy: "gaurav" });
  // await match.save();
  res.send(result);
};
