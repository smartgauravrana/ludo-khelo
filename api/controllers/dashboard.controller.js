const mongoose = require("mongoose");
const Match = mongoose.model("matches");

const { MATCH_STATUS } = require("../../constants");
// const { ErrorResponse } = require("../../utils");
const { asyncHandler } = require("../../middlewares");

module.exports.getDashboardData = asyncHandler(async (req, res, next) => {
  const data = await Match.aggregate([
    {
      $match: { status: MATCH_STATUS.completed }
    },
    {
      $addFields: {
        profit: { $subtract: [{ $multiply: [2, "$amount"] }, "$winningAmount"] }
      }
    },
    {
      $group: {
        _id: "$status",
        profit: { $sum: "$profit" }
      }
    }
  ]);
  res.send({ success: true, data });
});
