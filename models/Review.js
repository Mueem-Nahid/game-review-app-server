const mongoose = require("mongoose");
const {mongo, Schema} = require("mongoose");

const {ObjectId} = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
   _id: {
      type: ObjectId, auto: true,
   }, commentedBy: {
      type: ObjectId, ref: "User",
   }, comment: {
      type: String,
   }, rating: {
      type: Number,
   }, location: {
      lat: {
         type: Number,
      }, lon: {
         type: Number,
      },
   }, commentedAt: {
      type: Date, default: new Date(),
   },
}, {_id: false})