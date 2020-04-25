const mongoose = require("mongoose");
const { genPassword } = require("../../utils");

const User = mongoose.model("users");

module.exports.login = (req, res) => {
  res.send(req.user);
};

module.exports.register = async (req, res) => {
  const { name, username, phone, password } = req.body;
  const { hash, salt } = genPassword(password);
  try {
    const user = await new User({
      name,
      username,
      phone,
      password: hash,
      salt
    }).save();
    res.send(user);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Error while register" });
  }
};

module.exports.getCurrentUser = (req, res) => {
  res.send(req.user);
};

module.exports.logout = (req, res) => {
  req.logOut();
  res.redirect("/login");
};

module.exports.verfiyOtp = async (req, res) => {
  req.user.verified = true;
  const user = await req.user.save();
  res.send(user);
};
