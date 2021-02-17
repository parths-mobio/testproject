const express = require("express");
const router = express.Router();
const {
  createSetting,
  getAllSetting,
  updateSetting,
  removeSetting,
} = require("../controllers/setting");

const { isSignedIn } = require("../controllers/auth");

router.get("/setting/view", isSignedIn, getAllSetting);

router.post("/setting/create", isSignedIn, createSetting);

router.put("/setting/update", isSignedIn, updateSetting);

router.delete("/setting/delete", isSignedIn, removeSetting);

module.exports = router;
