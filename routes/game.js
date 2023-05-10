const express = require('express');
const {authUser} = require("../middlewares/auth");
const {addGame, allGames} = require("../controllers/game");

const router = express.Router();

router.post('/add-game', addGame);

router.get('/all-games', allGames);

module.exports = router;