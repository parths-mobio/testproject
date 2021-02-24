const Access = require("../models/userAccess");

exports.createAccess = async (req, res) => {
  const useraccess = new Access(req.body);
  useraccess.save((err, acces) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "NOT able to save UserAccess in DB",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully Created",
      Data: acces,
    });
  });
};

exports.getAllAccess = async(req, res) => {
  await Access.find()
    .select("_id")
    .populate("role", "_id name")
    .populate("permissions", "_id name")
    
    .exec((err, access) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statuscode: 400,
          message: "NO UserAccess found",
        });
      }
      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully View",
        // Data: {
        //   id:access._id,
        //   role:access.role,
        //   permissions:access.permissions,
        // },
        Data:access
      });
    });
};

exports.updateAccess = (req, res) => {
  const access = req.query.id;
  let useraccess = req.useraccess;
  useraccess = req.body;

  Access.findByIdAndUpdate(
    { _id: access },
    { $set: useraccess },
    { new: true, useFindAndModify: false },
    (err, access) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "You are not authorized to update this userAccess",
          Error: err,
        });
      }

      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully Updated",
        data: access,
      });
    }
  );
};

exports.removeAccess = async (req, res) => {
  const access = req.query.id;
  await Access.findById(access).remove((err, deletedAccess) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "Failed to delete the Access",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully deleted",
      deletedAccess,
    });
  });
};
