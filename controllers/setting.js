const Setting = require("../models/setting");
const translate = require("translate");

exports.createSetting = async (req, res) => {
  const ln = req.headers["ln"] || "en";
  let fr_value;
  let en_value;
  let fr_key;
  let en_key;
  const value = await req.body.value;
  const key = await req.body.key;
  translate.engine = "libre";
  if (ln === "en") {
    fr_value = await translate(value, "fr");
    fr_key = await translate(key, "fr");
  } else {
    en_value = await translate(value, { from: "fr", to: "en" });
    en_key = await translate(key, { from: "fr", to: "en" });
  }

  const set = new Setting({
    key_fr: fr_key,
    key_en: en_key,
    value_fr: fr_value,
    value_en: en_value,
  });
  set.save((err, setting) => {
    if (ln === "en") {
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
    } else {
      if (err) {
        return res.status(400).json({
          status: "Erreur",
          statusCode: 400,
          message:
            "Ne pas pouvoir enregistrer le réglage des données dans la base de données",
        });
      }
      res.json({
        status: "succès",
        statusCode: 200,
        message: "Créé avec succès",
        Data: setting,
      });
    }
  });
};

exports.getAllSetting = async (req, res) => {
  const ln = req.headers["ln"] || "en";
  if (ln === "en") {
    var keysearch_en = new RegExp(req.query.key, "i");
  } else {
    var keysearch_fr = new RegExp(req.query.key, "i");
  }

  let limit = (await req.query.limit) ? parseInt(await req.query.limit) : 3;
  let sortBy = (await req.query.sortBy) ? await req.query.sortBy : "_id";
  let sortOrder =
    (await req.query.OrderBy) && (await req.query.OrderBy) === "desc" ? -1 : 1;

  await Setting.find({ key_en: keysearch_en, key_fr: keysearch_fr })
    .select("-_id")
    .select("-__v")
    .limit(limit)
    .sort([[sortBy, sortOrder]])
    .exec((err, setting) => {
      if (ln === "en") {
        if (err) {
          return res.status(400).json({
            status: "Error",
            statuscode: 400,
            message: "NO Data found",
          });
        }
        res.json({
          status: "Success",
          statusCode: 200,
          message: "Successfully View",
          Data: setting,
        });
      } else {
        if (err) {
          return res.status(400).json({
            status: "Erreur",
            statuscode: 400,
            message: "Aucune donnée trouvée",
          });
        }
        res.json({
          status: "succès",
          statusCode: 200,
          message: "Avec succès",
          Data: setting,
        });
      }
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

exports.removeSetting = async (req, res) => {
  const set = await req.query.id;
  await Setting.findById(set).remove((err, deletedSet) => {
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

exports.getSettingById = async (req, res, next, id) => {
  await Setting.findById(id).exec((err, set) => {
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

exports.getSetting = async (req, res) => {
  return res.json({
    status: "Success",
    statusCode: 200,
    message: "Successfully Find",
    data: req.setting,
  });
};
