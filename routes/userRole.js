const express = require("express");
const router = express.Router();
const {
  createRole,
  getAllRoles,
  updateRoles,
  removeRole,
} = require("../controllers/userRole");

const { isSignedIn } = require("../controllers/auth");

router.get("/role/allroles", isSignedIn, getAllRoles);

router.post("/role/create", isSignedIn, createRole);

router.put("/role/update", isSignedIn, updateRoles);

router.delete("/role/delete", isSignedIn, removeRole);

module.exports = router;
