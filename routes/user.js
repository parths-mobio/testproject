const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  getAllUsers,
  deleteUser
 
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated,getUser);
router.get("/user", getAllUsers);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.delete(
  "/user/:userId",
  deleteUser
);


module.exports = router;
