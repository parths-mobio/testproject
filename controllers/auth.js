const User = require("../models/user");
const { validationResult, check } = require("express-validator");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "problem with image",
      });
    }

    const { name, email, address, mobile, password, role } = fields;

    let user = new User(fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "File size too big!",
        });
      }
      user.photo.data = fs.readFileSync(file.photo.path);
      user.photo.contentType = file.photo.type;
    }

    //const user = new User(req.body);

    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          Status: "Error",
          statusCode: 400,
          err: "Not able to save User",
        });
      }
      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully Created",
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
          AccessId: user.userAccess,
        },
      });
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "USER email does not exists",
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        status: "Error",
        statusCode: 401,
        message: "Email and password do not match",
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "24h",
    });
    //put token in cookie
    res.cookie("token", token);

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({
      status: "Success",
      statusCode: 200,
      token,
      message: "SignIn Successfully",
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};

//protected routes
// exports.isSignedIn = expressJwt({
//   secret: process.env.SECRET,
//   userProperty: "auth",
// });

exports.isSignedIn = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      Status: "Error",
      statusCode: 403,
      message: "No Token Provided",
    });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        Status: "Error",
        statusCode: 401,
        message: "Invalid Token",
      });
    }
    //req.userId = decoded.id;
    next();
  });
};

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      Status: "Error",
      statusCode: 403,
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == "user") {
    return res.status(403).json({
      Status: "Error",
      statusCode: 403,
      error: "You are not ADMIN, Access denied",
    });
  }
  next();
};
