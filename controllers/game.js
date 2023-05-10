const Game = require('../models/Game');
const {sendResponse} = require("../helpers/utils");

exports.addGame = async (req, res) => {
   try {
      const game = await new Game(req.body).save();
      return sendResponse(res, 201, "Game created.", {game});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};

exports.allGames = async (req, res) => {
   try {
      const games = await Game.find().sort({createdAt: -1});
      return sendResponse(res, 200, "All games.", {games});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};