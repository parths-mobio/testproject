const Setting = require("../models/setting");

exports.createSetting = (req, res) => {
  const set = new Setting(req.body);
  set.save((err, setting) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "NOT able to save settingData in DB",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully Created",
      Data: setting,
    });
  });
};

exports.getAllSetting = (req, res) => {
  var keysearch = new RegExp(req.query.key, "i");
  let limit = req.query.limit ? parseInt(req.query.limit) : 3;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let sortOrder = req.query.OrderBy && req.query.OrderBy === "desc" ? -1 : 1;

  //var keysearch = req.query.key;

  Setting.find({ key: keysearch })
    .select("-_id")
    .select("-__v")
    .limit(limit)
    .sort([[sortBy, sortOrder]])
    .exec((err, setting) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statuscode: 400,
          message: "NO categories found",
        });
      }
      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully View",
        Data: setting,
      });
    });
};

exports.updateSetting = (req, res) => {
  const set = req.query.id;
  let setting = req.setting;
  setting = req.body;

  Setting.findByIdAndUpdate(
    { _id: set },
    { $set: setting },
    { new: true, useFindAndModify: false },
    (err, set) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "You are not authorized to update this setting",
        });
      }

      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully Updated",
        data: set,
      });
    }
  );
};

exports.removeSetting = (req, res) => {
  const set = req.query.id;
  Setting.findById(set).remove((err, deletedSet) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "Failed to delete the Setting",
      });
    }
    res.json({
      status: "Success",
      statusCode: 200,
      message: "Successfully deleted",
      deletedSet,
    });
  });
};

exports.getSettingById = (req, res, next, id) => {
  Setting.findById(id).exec((err, set) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        statusCode: 400,
        message: "Setting not found in DB",
      });
    }
    req.setting = set;
    next();
  });
};

exports.getSetting = (req, res) => {
  return res.json({
    status: "Success",
    statusCode: 200,
    message: "Successfully Find",
    data: req.setting,
  });
};
