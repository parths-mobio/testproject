const Permission = require("../models/userPermission");
const Access = require("../models/userAccess");

// exports.createPermission = (req, res) => {
//   const permission = new Permission(req.body);
//   permission.save((err, perm) => {
//     if (err) {
//       return res.status(400).json({
//         status: "Error",
//         statusCode: 400,
//         message: "NOT able to save Permission in DB",
//       });
//     }
//     res.json({
//       status: "Success",
//       statusCode: 200,
//       message: "Successfully Created",
//       Data: perm,
//     });
//   });
// };

exports.createPermission = async (req, res) => {
  const permission = new Permission(req.body);
  const access = req.query.id;
  return await Permission.create(permission).then((docComment) => {
    console.log("\n>> Created Comment:\n", docComment);

    return Access.findByIdAndUpdate(
      access,
      { $push: { permissions: docComment._id } },
      { new: true, useFindAndModify: false }
    )
      .then(function (dbPermission) {
        res.json({
          status: "Success",
          statusCode: 200,
          message: "Successfully Created",
          Data: docComment,
        });
      })
      .catch(function (err) {
        res.json({
          status: "Error",
          statusCode: 400,
          message: "NOT able to save Permission in DB",
          msg: err,
        });
      });
  });
};

exports.getAllPermissions = async (req, res) => {
  await Permission.find()
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

exports.updatePermission = async (req, res) => {
  const perm = await req.query.id;
  let permission = await req.permission;
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

exports.removePermission = async (req, res) => {
  const permission = req.query.id;
  await Permission.findById(permission).remove((err, deletedPermission) => {
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
