const express = require("express");
const router = express.Router();
const {
  createAccess,
  getAllAccess,
  updateAccess,
  removeAccess,
} = require("../controllers/userAccess");

const { isSignedIn, isSuperAdmin } = require("../controllers/auth");

router.get("/access/viewall", isSignedIn, getAllAccess);

router.post("/access/create", isSignedIn, createAccess);

router.put("/access/update", isSignedIn, updateAccess);

router.delete("/access/delete", isSignedIn, removeAccess);

module.exports = router;
