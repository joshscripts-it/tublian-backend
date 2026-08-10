const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  register,
  login,
  googleSignin,
} = require("../controller/userController");
const {
  payment,
  pay_with_paystack,
} = require("../controller/paymentController");

//@login
router.route("/login").post(login);
router.route("/failure/redirect").get((req, res, next) => {
  res.send("Something went wrong. Try again later");
});

//@create account
router.route("/account/create").post(register);
//@google sign-in
router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/auth/google/redirect")
  .get(
    passport.authenticate("google", { failureRedirect: "/failure/redirect" }),
    googleSignin,
  );

//@payment route
router.route("/pay").post(passport.authenticate("jwt"), payment);
router.route("/pay_with_paystack").post(pay_with_paystack);

module.exports = router;
