const mongoose = require('mongoose');
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
      const games = await Game.find()
         .populate("reviewComments.commentedBy", "username first_name last_name", "User").sort({postedAt: -1});

      return sendResponse(res, 200, "All games.", {games});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};

exports.getAGame = async (req, res) => {
   try {
      const {id} = req.params;
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (isValidId) {
         const game = await Game.findById(id).populate("reviewComments.commentedBy", "username first_name last_name", "User");
         if (!game) {
            return sendResponse(res, 404, "Game not found.");
         }
         return sendResponse(res, 200, "Game found.", {game});
      }
      return sendResponse(res, 404, "Game not found.");
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};

exports.updateGame = async (req, res) => {
   try {
      const {id} = req.params;
      const updateData = req.body; // Assuming the updated data is sent in the request body
      const updatedGame = await Game.findOneAndUpdate({_id: id}, updateData, {
         new: true, // Return the updated document
      });
      if (!updatedGame) {
         return sendResponse(res, 404, 'Game not found.');
      }
      return sendResponse(res, 200, 'Game updated successfully.', {game: updatedGame});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};