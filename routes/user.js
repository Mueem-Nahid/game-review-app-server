const express = require('express');
const {authUser} = require("../middlewares/auth");
const {
   register, login, getUserById,
} = require('../controllers/user');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/user/:id', getUserById);

module.exports = router;