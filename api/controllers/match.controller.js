const mongoose = require("mongoose");
const Match = mongoose.model("matches");
const User = mongoose.model("users");
const { MATCH_STATUS, RESULT_OPTIONS } = require("../../constants");
const { isEmpty, genRewardAmount } = require("../../utils");

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
  const {
    isOfficial,
    history,
    page,
    searchText,
    matchStatus,
    contests
  } = req.query;
  let query;
  let count;
  if (history) {
    query = Match.find()
      .or([{ createdBy: req.user._id }, { joinee: req.user._id }])
      .populate("createdBy")
      .populate("joinee");
    count = await Match.countDocuments({
      $or: [{ createdBy: req.user._id }, { joinee: req.user._id }]
    });
  } else {
    let findQuery = {};

    if (isOfficial) {
      findQuery.isOfficial = isOfficial || false;
    }
    if (searchText) {
      findQuery._id = searchText;
    }
    if (matchStatus) {
      findQuery.status = matchStatus;
    }

    if (contests) {
      findQuery = { status: { $ne: MATCH_STATUS.completed } };
    }
    console.log("query: ", findQuery);
    query = Match.find(findQuery).populate("createdBy").populate("joinee");
    count = await Match.countDocuments(findQuery);
  }
  console.log("count: ", count);
  query = query
    .sort({
      _id: -1
    })
    .skip(10 * (page - 1 || 0))
    .limit(10);
  const matches = await query.exec();
  res.send({ total: count, data: matches });
};

module.exports.update = async (req, res) => {
  const { matchId } = req.params;
  const { isJoinee, roomId, leaveMatch } = req.body;
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
  }
  if (leaveMatch) {
    if (
      match.status === MATCH_STATUS.playRequested &&
      match.joinee.toString() === req.user._id.toString()
    ) {
      match.status = MATCH_STATUS.created;
      match.joinee = null;
      req.user.chips += match.amount;
      req.user.matchInProgress = 0;
      await match.save();
    } else {
      return res.status(400).send({ msg: "Can't cancel now!" });
    }
  }
  if (!leaveMatch) {
    match = match.toObject();
    match.joinee = req.user;
  }
  req.user.save();
  res.send(match);
};

module.exports.delete = async (req, res) => {
  const { matchId } = req.params;
  const match = await Match.findOne({ _id: matchId, createdBy: req.user._id });
  req.user.chips += match.amount;
  req.user.matchInProgress = 0;
  match.delete();
  const user = await req.user.save();
  res.send(user);
};

module.exports.postResult = async (req, res) => {
  console.log("body: ", req.body);
  const { matchId, resultType, cancelReason, imgUrl, winner } = req.body;

  // finding match
  const match = await Match.findById({ _id: matchId });
  if (!match) {
    res.status(404).send({ msg: "Match not found!" });
  }

  if (match.status === MATCH_STATUS.completed) {
    res.status(400).send({ msg: "Match already completed! Refresh Page!!" });
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
        $inc: { chips: genRewardAmount(match.amount) },
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
      req.user.chips += match.amount;
      req.user.matchInProgress = 0;
      await req.user.save();
      break;
    case "completed":
      // chnage status and reqard money
      if (req.user.isAdmin) {
        result = await Match.findByIdAndUpdate(
          matchId,
          {
            $set: { status: MATCH_STATUS.completed, winner: winner }
          },
          {
            new: true
          }
        );
        User.findByIdAndUpdate(winner, {
          $inc: { chips: genRewardAmount(match.amount) }
        }).exec();
      } else {
        return res
          .status(400)
          .send({ msg: "You don't have permissions for action" });
      }
      break;

    default:
      return;
  }
  res.send(result);
};
