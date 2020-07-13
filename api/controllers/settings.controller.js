const mongoose = require("mongoose");
const Setting = mongoose.model("settings");

const { ErrorResponse } = require("../../utils");
const { asyncHandler } = require("../../middlewares");

module.exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await Setting.findOne({});
  res.send({ success: true, data: settings || {} });
});
module.exports.addSettings = asyncHandler(async (req, res, next) => {
  const settings = await Setting.findOne({});
  if (settings) {
    next(
      new ErrorResponse(
        "Settings are already present!, only update allowed ",
        400
      )
    );
  } else {
    const newSettings = await new Setting(req.body).save();
    res.send({ success: true, data: newSettings });
  }
});
module.exports.updateSettings = asyncHandler(async (req, res, next) => {
  const settings = await Setting.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true
  });
  res.send({ success: true, data: settings });
});
