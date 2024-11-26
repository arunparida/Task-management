const express = require("express");
const router = express.Router();
const {
  updateTask,
  deleteTask,
  updateUser,
  deleteUser,
} = require("../controllers/admin.controller");
const userAuth = require("../middleware/userAuth");

// Middleware to check admin role
const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

// Task Management Routes (Admin Only)
router.put("/tasks/edit/:taskId", userAuth, checkAdmin, updateTask);
router.delete("/tasks/:taskId", userAuth, checkAdmin, deleteTask);

// User Management Routes (Admin Only)
router.put("/users/:userId", userAuth, checkAdmin, updateUser);
router.delete("/users/:userId", userAuth, checkAdmin, deleteUser);

module.exports = router;
