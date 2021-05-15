const mongoose = require("mongoose");
const { genPassword, ErrorResponse } = require("../../utils");
const { asyncHandler } = require("../../middlewares");

const User = mongoose.model("users");

module.exports.login = (req, res) => {
  res.send({ success: true, data: req.user });
};

module.exports.register = asyncHandler(async (req, res, next) => {
  const { name, username, phone, password, referrer } = req.body;
  const { hash, salt } = genPassword(password);
  const isUserExist = await User.findOne({ phone });
  if (!isUserExist) {
    const user = await new User({
      name,
      username,
      phone,
      referrer,
      password: hash,
      salt
    }).save();
    res.send({ success: true, data: user });
  } else {
    next(new ErrorResponse("User with this phone already exists!", 400));
  }
});

module.exports.getCurrentUser = (req, res) => {
  if (req.user) res.send({ success: true, data: req.user });
  else res.send({ success: false });
};

module.exports.logout = (req, res) => {
  req.logOut();
  res.redirect("/");
};

module.exports.verfiyOtp = async (req, res) => {
  req.user.verified = true;
  const user = await req.user.save();
  res.send(user);
};
