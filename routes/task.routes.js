const express = require("express");
const userAuth = require("../middleware/userAuth");
const router = express.Router();

const { createTask, getAllTasks } = require("../controllers/task.controller");

router.post("/create", userAuth, createTask);
router.get("/all", getAllTasks);

module.exports = router;
