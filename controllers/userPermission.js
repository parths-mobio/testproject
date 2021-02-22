const Permission = require("../models/userPermission");

exports.createPermission = (req, res) => {
  const permission = new Permission(req.body);
  permission.save((err, perm) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "NOT able to save Permission in DB",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully Created",
      Data: perm,
    });
  });
};

exports.getAllPermissions = (req, res) => {
Permission.find()
    .select("-__v")
    .exec((err, perm) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statuscode: 400,
          message: "NO Permission found",
        });
      }
      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully View",
        Data: perm,
      });
    });
};

exports.updatePermission = (req, res) => {
  const perm = req.query.id;
  let permission = req.permission;
  permission = req.body;

  Permission.findByIdAndUpdate(
    { _id: perm },
    { $set: permission },
    { new: true, useFindAndModify: false },
    (err, perm) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "You are not authorized to update this permission",
        });
      }

      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully Updated",
        data: perm,
      });
    }
  );
};

exports.removePermission = (req, res) => {
  const permission = req.query.id;
  Permission.findById(permission).remove((err, deletedPermission) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "Failed to delete the Permission",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully deleted",
      deletedPermission,
    });
  });
};

