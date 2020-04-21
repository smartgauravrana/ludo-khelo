const express = require("express");
const router = express.Router();
const passport = require("passport");

const authCtrl = require("../controllers/auth.controller");
const { isLogin } = require("../../middlewares");

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  authCtrl.login
);

router.post("/register", authCtrl.register);

router.get("/current_user", authCtrl.getCurrentUser);

router.get("/logout", authCtrl.logout);

router.post("/verifyOtp", isLogin, authCtrl.verfiyOtp);

module.exports = router;
