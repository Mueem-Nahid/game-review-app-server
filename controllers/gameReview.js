const {lookup} = require("geoip-lite");

const Game = require('../models/Game');
const {sendResponse} = require("../helpers/utils");

exports.addCommentAndRating = async (req, res) => {
   try {
      const {gameId} = req.params;
      const {comment, rating} = req.body; // Assuming comment and rating are provided in the request body

      // Retrieve the user's IP address from the request
      const userIp = req.ip;

      // console.log(req)

      // Determine the user's location based on the IP address
      const geo = lookup(userIp);
      const lat = geo && geo.ll ? geo.ll[0] : null;
      const lon = geo && geo.ll ? geo.ll[1] : null;

      // Create a new comment object with the retrieved location
      const newComment = {
         commentedBy: req.user._id,
         comment: comment, rating: rating, commentedAt: new Date(), location: {lat: lat, lon: lon},
      };

      // Find the game by ID and push the new comment into the reviewComments array
      const updatedGame = await Game.findOneAndUpdate({_id: gameId}, {$push: {reviewComments: newComment}}, {new: true});

      if (!updatedGame) {
         return sendResponse(res, 404, 'Game not found.');
      }

      return sendResponse(res, 200, 'Comment and rating added successfully.', {game: updatedGame});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};


exports.deleteComment = async (req, res) => {
   try {
      const {gameId, commentId} = req.params;

      // Find the game by ID and remove the specified comment
      const updatedGame = await Game.findOneAndUpdate({_id: gameId}, {$pull: {reviewComments: {_id: commentId}}}, {new: true});

      if (!updatedGame) {
         return sendResponse(res, 404, 'Game not found.');
      }

      return sendResponse(res, 200, 'Comment deleted successfully.', {game: updatedGame});
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};