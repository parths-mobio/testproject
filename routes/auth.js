var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const { signout, signup, signin } = require("../controllers/auth");
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");

router.post(
  "/user/createuser",
  [
    check("name", {
      Status: "Error",
      Statuscode: 400,
      message: "name should be at least 3 char",
    }).isLength({ min: 3 }),
    check("email", {
      Status: "Error",
      Statuscode: 400,
      message: "email is required",
    }).isEmail(),
    check("mobile", {
      Status: "Error",
      Statuscode: 400,
      message: "Mobile Number should be at least 10 Numbers",
    }).isLength({
      min: 10,
    }),
    check("password", {
      Status: "Error",
      Statuscode: 400,
      message: "password should be at least 5 char",
    }).isLength({
      min: 5,
    }),
  ],
  isSignedIn,
  signup
);

router.post(
  "/auth/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
