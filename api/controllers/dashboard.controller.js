const mongoose = require("mongoose");
const Match = mongoose.model("matches");
const User = mongoose.model("users");

// const { MATCH_STATUS } = require("../../constants");
// const { ErrorResponse } = require("../../utils");
const { asyncHandler } = require("../../middlewares");

module.exports.getMatchesDashboard = asyncHandler(async (req, res, next) => {
  const query = [];
  if (req.dateFilter) {
    query.push(req.dateFilter);
  }
  const data = await Match.aggregate([
    {
      $group: {
        _id: "$status",
        matchesNumber: { $sum: 1 },
        maxChallengeAmount: { $max: "$amount" },
        profit: {
          $sum: { $subtract: [{ $multiply: [2, "$amount"] }, "$winningAmount"] }
        }
      }
    }
  ]);
  res.send({ success: true, data });
});

module.exports.getUsersDashboard = asyncHandler(async (req, res, next) => {
  const query = [];
  if (req.dateFilter) {
    query.push(req.dateFilter);
  }
  query.push({
    $group: {
      _id: "_id",
      total: { $sum: 1 },
      zombieUsers: { $sum: { $cond: [{ $eq: ["$chips", 0] }, 1, 0] } }
    }
  });
  const data = await User.aggregate(query);

  return res.send({ success: true, data });
});
