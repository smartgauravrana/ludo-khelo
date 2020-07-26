const mongoose = require("mongoose");
const User = mongoose.model("users");
const asyncHandler = require("../../middlewares/async");
const { ErrorResponse } = require("../../utils");

// @desc      GET All Users
// @route     GET /api/users
// @access    Private
module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      GET Single User
// @route     GET /api/users/:userId
// @access    Private
module.exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new ErrorResponse("User not found", 404));
  res.json({ success: true, data: user });
});

// @desc      UPDATE Single User
// @route     GET /api/users/:userId
// @access    Private
module.exports.updateSingleUser = asyncHandler(async (req, res, next) => {
  const { addChips } = req.body;
  let user = await User.findById(req.params.userId);
  if (!user) return next(new ErrorResponse("User not found", 404));

  if (addChips && addChips > 0) {
    user = await User.findByIdAndUpdate(
      user._id,
      {
        $inc: { chips: addChips }
      },
      { new: true }
    );
  } else {
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
  }
  res.json({ success: true, data: user });
});
