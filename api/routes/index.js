const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

const Match = mongoose.model("matches");
const SellRequest = mongoose.model("sellRequests");
const User = mongoose.model("users");
const authCtrl = require("../controllers/auth.controller");
const matchCtrl = require("../controllers/match.controller");
const billingCtrl = require("../controllers/billing.controller");
const settingsCtrl = require("../controllers/settings.controller");
const dashboardCtrl = require("../controllers/dashboard.controller");
const userCtrl = require("../controllers/user.controller");
const {
  isLogin,
  advancedResults,
  verifyTransaction,
  asyncHandler,
  dateFilterAggregation
} = require("../../middlewares");

router.post(
  "/login",
  function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return res
          .status(500)
          .send({ success: false, error: "Something went wrong!" });
      }
      if (!user) {
        return res
          .status(404)
          .send({ success: false, error: "User not exist!" });
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return next();
      });
    })(req, res, next);
  },
  authCtrl.login
);

router.post("/register", authCtrl.register);

router.get("/current_user", authCtrl.getCurrentUser);

router.get("/logout", authCtrl.logout);

router.post("/verifyOtp", isLogin(), authCtrl.verfiyOtp);

// MATCHES ROUTES
router
  .get(
    "/matches",
    isLogin(),
    advancedResults(Match, ["createdBy", "joinee"]),
    matchCtrl.getMatches
  )
  .post("/matches", isLogin(), matchCtrl.addMatch);

router
  .route("/matches/:matchId")
  .get(isLogin(), matchCtrl.getMatch)
  .put(isLogin(), matchCtrl.update)
  .delete(isLogin(), matchCtrl.delete);

// POST RESULT
router.route("/result").post(isLogin(), matchCtrl.postResult);

// BUY CHIPS
router.post(
  "/buy",
  isLogin(),
  asyncHandler(verifyTransaction),
  billingCtrl.buyChips
);

// SELL ROUTES
router
  .route("/sell")
  .get(isLogin(), advancedResults(SellRequest), billingCtrl.getAllSellRequests)
  .post(isLogin(), billingCtrl.addSellRequest);

router
  .route("/sell/:sellId")
  .delete(isLogin(), billingCtrl.deleteSellRequest)
  .put(isLogin(true), billingCtrl.updateSellRequest);

// ADMIN SETTINGS ROUTES
router
  .route("/settings")
  .get(settingsCtrl.getSettings)
  .post(isLogin(true), settingsCtrl.addSettings)
  .put(isLogin(true), settingsCtrl.updateSettings);

// ADMIN DASHBOARD DATA
router
  .route("/dashboard/matches")
  .get(isLogin(true), dateFilterAggregation, dashboardCtrl.getMatchesDashboard);

router
  .route("/dashboard/users")
  .get(isLogin(true), dateFilterAggregation, dashboardCtrl.getUsersDashboard);

// users management
router
  .route("/users")
  .get(isLogin(true), advancedResults(User), userCtrl.getAllUsers);

router
  .route("/users/:userId")
  .get(isLogin(true), userCtrl.getSingleUser)
  .put(isLogin(true), userCtrl.updateSingleUser);

module.exports = router;
