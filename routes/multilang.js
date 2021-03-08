const express = require("express");
const router = express.Router();
const {
  translateString
} = require("../controllers/multilang");

const { isSignedIn,isSuperAdmin } = require("../controllers/auth");


router.post("/multiLang/test", translateString);

module.exports = router;