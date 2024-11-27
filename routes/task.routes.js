const express = require("express");
const userAuth = require("../middlewares/auth.middleware");
const router = express.Router();

const { createTask, getAllTasks, getTasksData } = require("../controllers/task.controller");

router.post("/create", userAuth, createTask);
router.get("/all", getAllTasks);
router.get("/data", userAuth, getTasksData);

module.exports = router;
