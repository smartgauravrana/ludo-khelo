const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const { validPassword } = require("../utils");

const User = mongoose.model("users");

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use(
  new LocalStrategy({ usernameField: "phone" }, function (
    phone,
    password,
    done
  ) {
    User.findOne({ phone: phone }, function (err, user) {
      if (err) {
        console.log("inside err");
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      const isValid = validPassword(password, user.password, user.salt);
      if (!isValid) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);
