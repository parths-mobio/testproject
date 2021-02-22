const express = require("express");
const router = express.Router();
const {
  createPermission,
  getAllPermissions,
  updatePermission,
  removePermission
} = require("../controllers/userPermission");

const { isSignedIn } = require("../controllers/auth");

router.get("/permission/allpermissions", isSignedIn, getAllPermissions);

router.post("/permission/create", isSignedIn, createPermission);

router.put("/permission/update", isSignedIn, updatePermission);

router.delete("/permission/delete", isSignedIn, removePermission);

module.exports = router;