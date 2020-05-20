const express = require("express");
const router = express.Router();
const passport = require("passport");

const authCtrl = require("../controllers/auth.controller");
const matchCtrl = require("../controllers/match.controller");
const billingCtrl = require("../controllers/billing.controller");
const { isLogin } = require("../../middlewares");

router.post(
  "/login",
  function (req, res, next) {
    console.log("inside login handler");
    passport.authenticate("local", function (err, user, info) {
      console.log("inside passport authenticate");
      if (err) {
        return res.status(500).send({ msg: "Something went wrong!" });
      }
      if (!user) {
        return res.status(404).send({ msg: "User not exist!" });
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

router.post("/verifyOtp", isLogin, authCtrl.verfiyOtp);

// MATCHES ROUTES
router
  .get("/matches", isLogin, matchCtrl.getAll)
  .post("/matches", isLogin, matchCtrl.addMatch);

router
  .route("/matches/:matchId")
  .get(isLogin, matchCtrl.getOne)
  .put(isLogin, matchCtrl.update)
  .delete(isLogin, matchCtrl.delete);

// POST RESULT
router.route("/result").post(isLogin, matchCtrl.postResult);

// BUY CHIPS
router.post("/buy", isLogin, billingCtrl.buyChips);

// SELL ROUTES
router
  .route("/sell")
  .get(isLogin, billingCtrl.getAllSellRequests)
  .post(isLogin, billingCtrl.addSellRequest);

router.delete("/sell/:sellId", isLogin, billingCtrl.deleteSellRequest);

module.exports = router;
