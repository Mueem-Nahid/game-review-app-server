const mongoose = require("mongoose");
const {mongo, Schema} = require("mongoose");

const {ObjectId} = mongoose.Schema;
const reviewSchema = require("./Review");

const gameSchema = new mongoose.Schema({
   title: {
      type: String, required: true
   }, summary: {
      type: String, required: true
   }, picture: {
      type: Array, required: true
   }, releaseDate: {
      type: Date, required: true
   }, averageRating: {
      type: Number, default: 0
   }, totalReviews: {
      type: Number, default: 0
   }, reviewComments: [reviewSchema], postedAt: {
      type: Date, default: Date.now
   }, updatedAt: {
      type: Date, default: Date.now
   }
});

// Middleware to update averageRating when a new review is added or updated
gameSchema.post(["save", "findOneAndUpdate", "findOneAndDelete"], async function (doc) {
   const gameId = doc._id;
   const aggregateResult = await mongoose.model("Game").aggregate([
      {
         $match: {_id: gameId}
      },
      {
         $unwind: "$reviewComments"
      },
      {
         $group: {
            _id: gameId,
            averageRating: {$avg: "$reviewComments.rating"},
            totalReviews: {$sum: 1}
         }
      }
   ]);

   const {averageRating, totalReviews} = aggregateResult[0] || {averageRating: 0, totalReviews: 0};
   await mongoose.model("Game").updateOne({_id: gameId}, {averageRating, totalReviews});
});

module.exports = mongoose.model('Game', gameSchema);

