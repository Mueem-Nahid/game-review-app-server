const mongoose = require("mongoose");
const {mongo} = require("mongoose");

const {ObjectId} = mongoose.Schema;

const gameSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   summary: {
      type: String,
      required: true
   },
   picture: {
      type: String,
      required: true
   },
   publishedDate: {
      type: Date,
      required: true
   },
   averageRating: {
      type: Number,
      default: 0
   },
   totalReviews: {
      type: Number,
      default: 0
   },
   reviewComments: [{
      user: {
         type: String,
         required: true
      },
      comment: {
         type: String,
         required: true
      }
   }],
   postedAt: {
      type: Date,
      default: Date.now
   },
   updatedAt: {
      type: Date,
      default: Date.now
   }
})

module.exports = mongoose.model('Game', gameSchema);

