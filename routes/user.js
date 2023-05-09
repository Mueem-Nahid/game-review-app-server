const express = require('express');
const {authUser} = require("../middlewares/auth");
const {
   register, login,
} = require('../controllers/user');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

module.exports = router;