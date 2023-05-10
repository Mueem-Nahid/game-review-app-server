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
   releaseDate: {
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
      commentedBy: {
         type: ObjectId,
         ref: "user",
      },
      comment: {
         type: String,
      },
      rating: {
         type: Number,
      },
      location: {
         lat: {
            type: Number,
         },
         lon: {
            type: Number,
         },
      },
      commentedAt: {
         type: Date,
         default: new Date(),
      },
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

