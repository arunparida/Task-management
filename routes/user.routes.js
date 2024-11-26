const express = require("express");
const router = express.Router();
const  userAuth  = require('../middleware/userAuth');

const {
    getUserProfile
} = require('../controllers/user.controller');
router.get("/profile/:id", userAuth, getUserProfile);

module.exports = router;