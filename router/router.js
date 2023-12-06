const express = require("express");
const passport = require("passport");
const router = express.Router();
const { register, login } = require("../controller/userController");
const { payment } = require("../controller/paymentController");

router.route("/").get((req, res, next) => {
  res.status(200).json({ msg: "Welcome To Tublian Challenge Server!" });
});

//@login
router.route("/login").post(login);
//@create account
router.route("/account/create").post(register);

//@payment route
router.route("/pay").post(passport.authenticate("jwt"), payment);

module.exports = router;
