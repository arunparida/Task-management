const express = require("express");
const router = express.Router();
const  userAuth  = require('../middleware/userAuth');

const {
    signup,
    login,
} = require('../controllers/auth.controller');

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;