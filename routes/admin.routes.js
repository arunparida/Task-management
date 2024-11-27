const express = require("express");
const router = express.Router();
const {
  updateTask,
  deleteTask,
  updateUser,
  assignTask,
} = require("../controllers/admin.controller");
const userAuth = require("../middlewares/auth.middleware");
const checkAdmin = require("../middlewares/checkAdmin.middleware");

// Task Management
router.put("/tasks/edit/:taskId", userAuth, checkAdmin, updateTask);
router.delete("/tasks/:taskId", userAuth, checkAdmin, deleteTask);

// User Management
router.put("/users/update/:userId", userAuth, checkAdmin, updateUser);
router.post("/assign-task", userAuth, assignTask);

module.exports = router;
