const express = require('express');
const {authUser} = require("../middlewares/auth");
const {addGame, allGames, getAGame, updateGame} = require("../controllers/game");
const {addCommentAndRating} = require("../controllers/gameReview");

const router = express.Router();

router.post('/add-game', authUser, addGame);

router.get('/all-games', allGames);

router.get('/game/:id', getAGame);

router.patch('/edit-game/:id', authUser, updateGame);

router.post('/game/:gameId/comments', authUser, addCommentAndRating)

module.exports = router;