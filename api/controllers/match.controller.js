const mongoose = require("mongoose");
const Match = mongoose.model("matches");
const User = mongoose.model("users");
const { MATCH_STATUS, RESULT_OPTIONS } = require("../../constants");
const asyncHandler = require("../../middlewares/async");
const {
  isEmpty,
  genRewardAmount,
  isResultPosted,
  isParticipant,
  ErrorResponse
} = require("../../utils");
const { sendNotification } = require("../../services/notificationService");

// @desc      Add Match
// @route     POST /api/matches
// @access    Private
module.exports.addMatch = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  if (req.user.chips < amount) {
    return next(new ErrorResponse("You don't have enough chips", 400));
  }
  const match = await new Match({
    amount,
    isOfficial: req.user.isAdmin || false,
    createdBy: req.user
  }).save();
  req.user.chips -= amount;
  req.user.matchInProgress = 1;
  await req.user.save();
  match.createdBy = req.user;
  res.send({ success: true, data: match });
});

// @desc      Get Single Match
// @route     GET /api/matches/:matchId
// @access    Private
module.exports.getMatch = asyncHandler(async (req, res) => {
  const { matchId } = req.params;

  const match = await Match.findOne({ _id: matchId })
    .populate("createdBy")
    .populate("joinee");
  res.send({ success: true, data: match });
});

// @desc      Get All matches
// @route     GET /api/matches
// @access    Private
module.exports.getMatches = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

module.exports.update = asyncHandler(async (req, res, next) => {
  const { matchId } = req.params;
  const { isJoinee, roomId, leaveMatch } = req.body;
  let updateObj = {};

  const notification = {
    content: "",
    playerIds: []
  };

  if (isJoinee) {
    updateObj = {
      ...updateObj,
      joinee: req.user._id,
      status: MATCH_STATUS.playRequested
    };

    const match = await Match.findById(matchId);
    if (match && match.amount > req.user.chips) {
      return next(new ErrorResponse("You don't have enought chips!", 400));
    }

    // setting notification for match creator
    const matchCreator = await User.findById(match.createdBy);
    notification.content = "Your Challenge Accepted!";
    notification.playerIds = matchCreator.notificationDevices;
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
  if (roomId) {
    // setting notification for joinee person after room code set
    const matchJoinee = await User.findById(match.joinee);
    notification.content = "Request Accepted! Click to Play";
    notification.playerIds = matchJoinee.notificationDevices;
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
      return next(new ErrorResponse("Can't cancel now!", 400));
    }
  }
  if (!leaveMatch) {
    match = match.toObject();
    match.joinee = req.user;
  }
  await req.user.save();
  res.send({ sucess: true, data: match });
  // firing notification
  if (isJoinee || roomId) await sendNotification(notification);
});

// @desc      Delete Single match
// @route     DELETE /api/matches/:matchId
// @access    Private
module.exports.delete = asyncHandler(async (req, res, next) => {
  const { matchId } = req.params;
  const match = await Match.findOne({ _id: matchId, createdBy: req.user._id });
  if (!match) {
    return next(new ErrorResponse("Match not found", 404));
  }
  req.user.chips += match.amount;
  req.user.matchInProgress = 0;
  await match.delete();
  const user = await req.user.save();
  res.send({ success: true, data: user });
});

module.exports.postResult = asyncHandler(async (req, res, next) => {
  const { matchId, resultType, cancelReason, imgUrl, winner } = req.body;

  // finding match
  const match = await Match.findById({ _id: matchId });
  if (!match) {
    return next(new ErrorResponse("Match not found!", 404));
  }

  if (!req.user.isAdmin && !isParticipant(match, req.user._id)) {
    return next(new ErrorResponse("You're not allowed to do this!", 400));
  }
  if (match.status === MATCH_STATUS.completed) {
    return next(
      new ErrorResponse("Match already completed! Refresh Page!!", 400)
    );
  }
  if (isResultPosted(match.resultsPosted, req.user._id)) {
    return next(new ErrorResponse("Already result posted by you!"));
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
      // cancelled by admin
      console.log("cancelled by admin called")
      if(req.user.isAdmin){
        result = await Match.findByIdAndUpdate(
          matchId,
          {
            $set: { status: MATCH_STATUS.cancelled },
            $push: {
              "resultsPosted.cancel": { postedBy: req.user._id, cancelReason: "Cancelled by admin" }
            }
          },
          {
            new: true
          }
        );

        // find Users
        const users = await User.find({$or: [{_id: match.createdBy }, {_id: match.joinee}]});

        // updating joinee and creator chips
        for(let user of users){
          let userUpdate = user;
          userUpdate.chips += match.amount;
          if(!isResultPosted(match.resultsPosted, user._id)){
            userUpdate.matchInProgress = 0;
          }
          await user.save();
        }
      } else{
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
        await User.findByIdAndUpdate(otherUserId, {
          $inc: { chips: match.amount },
          $set: { matchInProgress: 0 }
        });
      }
      // saving current user 
      req.user.matchInProgress = 0;
      await req.user.save();
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
        const loserId = winner.toString() !== match.createdBy.toString() ? match.createdBy : match.joinee;
        await User.findByIdAndUpdate(loserId, { matchInProgress: 0 }) // resetting loser matchinprogress
      } else {
        return res
          .status(400)
          .send({ msg: "You don't have permissions for action" });
      }
      break;

    default:
      return next(new ErrorResponse("Bad Request!", 400));
  }
  res.send({ success: true, data: result });
});
