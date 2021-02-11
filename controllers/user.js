const User = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile);
};

exports.getAllUsers = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let sortOrder = req.query.OrderBy && req.query.OrderBy === "desc" ? -1 : 1;
  var usersearch = new RegExp(req.query.name, "i");
  var addresssearch = new RegExp(req.query.address, "i");
  var rolesearch = new RegExp(req.query.role, "i");
  User.find({ name: usersearch, address: addresssearch, role: rolesearch })
    .select("-photo")
    .select("-salt")
    .select("-encry_password")
    .sort([[sortBy, sortOrder]])
    .limit(limit)
    .exec((err, users) => {
      if (err || !users) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "No User Found",
        });
      }

      res.json({
        status: "Success",
        statusCode: 200,
        message: users,
      });
    });
};

exports.updateUser = (req, res) => {
  // User.findByIdAndUpdate(
  //   { _id: req.profile._id },
  //   { $set: req.body },
  //   { new: true, useFindAndModify: false },
  //   (err, user) => {
  //     if (err) {
  //       return res.status(400).json({
  //         status: "Error",
  //         statusCode: 400,
  //         message: "You are not authorized to update this user",
  //       });
  //     }
  //     user.salt = undefined;
  //     user.encry_password = undefined;
  //     res.json({
  //       status: "Success",
  //       statusCode: 200,
  //       message: "Successfully Updated",
  //       user,
  //     });
  //   }
  // );
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code
    let user =req.user;
    user = _.extend(user, fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "File size too big!"
        });
      }
      user.photo = fs.readFileSync(file.photo.path);
      user.photo.contentType = file.photo.type;
    }

    User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: user },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "You are not authorized to update this user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully Updated",
        user,
      });
    }
  );
    
    // user.save((err, user) => {
    //   if (err) {
    //     res.status(400).json({
    //       error: "Updation of user failed"
    //     });
    //   }
    //   res.json(user);
    // });
  });
};
exports.deleteUser = (req, res) => {
  const user = req.profile._id;
  User.findById(user).remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "Failed to delete the User",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully deleted",
      deletedUser,
    });
  });
};
