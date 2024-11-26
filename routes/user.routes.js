const express = require("express");
const router = express.Router();
const  userAuth  = require('../middleware/userAuth');

const {
    signup,
    login,
    getUserProfile
} = require('../controllers/user.controller');

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile/:id", userAuth, getUserProfile);

module.exports = router;