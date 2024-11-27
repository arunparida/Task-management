const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth.middleware");

const {
  getUserProfile,
  updateUserProfile,
  updateTaskStatus,
  refreshAccessToken,
} = require("../controllers/user.controller");

router.get("/profile/:id", userAuth, getUserProfile);
router.put("/profile/edit/:id", userAuth, updateUserProfile);
router.put("/change-status", userAuth, updateTaskStatus);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
