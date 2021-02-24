const Role = require("../models/userRole");

exports.createRole = async (req, res) => {
  const role = new Role(req.body);
  role.save((err, role) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "NOT able to save Role in DB",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully Created",
      Data: role,
    });
  });
};

exports.getAllRoles = async(req, res) => {
await Role.find()
    .select("-__v")
    .exec((err, role) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statuscode: 400,
          message: "NO role found",
        });
      }
      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully View",
        Data: role,
      });
    });
};

exports.updateRoles = (req, res) => {
  const rl = req.query.id;
  let role = req.role;
  role = req.body;

  Role.findByIdAndUpdate(
    { _id: rl },
    { $set: role },
    { new: true, useFindAndModify: false },
    (err, role) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "You are not authorized to update this role",
        });
      }

      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully Updated",
        data: role,
      });
    }
  );
};

exports.removeRole = async (req, res) => {
  const rl = req.query.id;
  await Role.findById(rl).remove((err, deletedRole) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "Failed to delete the Role",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully deleted",
      deletedRole,
    });
  });
};

