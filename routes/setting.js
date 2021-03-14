const express = require("express");
const router = express.Router();
const {
  createSetting,
  getAllSetting,
  updateSetting,
  removeSetting,
  getSettingById,
  getSetting,
} = require("../controllers/setting");

const { isSignedIn,isSuperAdmin } = require("../controllers/auth");

router.get("/setting/view", isSignedIn, getAllSetting);

router.post("/setting/create", isSignedIn,isSuperAdmin,createSetting);

router.put("/setting/update", isSignedIn,isSuperAdmin, updateSetting);

router.delete("/setting/delete", isSignedIn,isSuperAdmin, removeSetting);

router.param("settingId", getSettingById);

router.get("/setting/view/:settingId", isSignedIn,getSetting);

module.exports = router;
