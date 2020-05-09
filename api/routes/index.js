const express = require("express");
const router = express.Router();
const passport = require("passport");

const authCtrl = require("../controllers/auth.controller");
const matchCtrl = require("../controllers/match.controller");
const billingCtrl = require("../controllers/billing.controller");
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

// MATCHES ROUTES
router
  .get("/matches", isLogin, matchCtrl.getAll)
  .post("/matches", isLogin, matchCtrl.addMatch);

router
  .route("/matches/:matchId")
  .put(isLogin, matchCtrl.update)
  .delete(isLogin, matchCtrl.delete);

// BUY CHIPS
router.post("/buy", isLogin, billingCtrl.buyChips);

// SELL ROUTES
router
  .route("/sell")
  .get(isLogin, billingCtrl.getAllSellRequests)
  .post(isLogin, billingCtrl.addSellRequest);

router.delete("/sell/:sellId", isLogin, billingCtrl.deleteSellRequest);

module.exports = router;
