const {lookup} = require("geoip-lite");

const Game = require('../models/Game');
const {sendResponse} = require("../helpers/utils");
const {Types} = require("mongoose");

exports.addCommentAndRating = async (req, res) => {
   try {
      const {gameId} = req.params;
      const {comment, rating} = req.body;

      // Retrieve the user's IP address from the request
      const userIp = req.ip;
      console.log("userIp-> ", userIp)

      // Determine the user's location based on the IP address
      const geo = lookup(userIp);
      console.log("geo-> ", geo)

      const lat = geo && geo.ll ? geo.ll[0] : null;
      const lon = geo && geo.ll ? geo.ll[1] : null;

      let id = new Types.ObjectId();
      // Create a new comment object with the retrieved location
      const newComment = {
         id: id,
         commentedBy: req.user._id,
         comment: comment, rating: rating, commentedAt: new Date(), location: {lat: lat, lon: lon},
      };

      // Find the game by ID and push the new comment into the reviewComments array
      const updatedGame = await Game.findOneAndUpdate({_id: gameId}, {$push: {reviewComments: newComment}}, {new: true});

      if (!updatedGame) {
         return sendResponse(res, 404, 'Game not found.');
      }

      return sendResponse(res, 200, 'Comment and rating added successfully.', newComment);
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};


exports.deleteComment = async (req, res) => {
   try {
      const {gameId, commentId} = req.params;

      // Check if the commentId is a valid ObjectId
      if (!Types.ObjectId.isValid(commentId)) {
         return sendResponse(res, 400, 'Invalid commentId.');
      }

      // Find the game by ID and check if the comment exists
      const game = await Game.findById(gameId);
      if (!game) {
         return sendResponse(res, 404, 'Game not found.');
      }

      const commentIndex = game.reviewComments.findIndex(comment => comment.id.toString() === commentId);
      if (commentIndex === -1) {
         return sendResponse(res, 404, 'Comment not found.');
      }

      // Remove the comment from the reviewComments array
      game.reviewComments.splice(commentIndex, 1);

      // Save the updated game
      await game.save();

      return sendResponse(res, 200, 'Comment deleted successfully.', {game});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};