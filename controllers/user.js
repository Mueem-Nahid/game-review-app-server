const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const {validateEmail, validateLength, validateUsername} = require("../helpers/validation");
const {sendResponse} = require("../helpers/utils");
const {generateToken} = require("../helpers/tokens");
const mongoose = require("mongoose");
const Game = require("../models/Game");

// user register
exports.register = async (req, res) => {
   try {
      const {first_name, last_name, email, password} = req.body;

      if (!validateEmail(email)) {
         return sendResponse(res, 400, 'Invalid email address');
      }

      const check = await User.findOne({email});
      if (check) {
         return sendResponse(res, 400, 'This email address already exists, try with a different email address');
      }

      if (!validateLength(first_name, 3, 15)) {
         return sendResponse(res, 400, 'First name must be between 3 to 15 characters');
      }

      if (!validateLength(last_name, 3, 15)) {
         return sendResponse(res, 400, 'Last name must be between 3 to 15 characters');
      }

      if (!validateLength(password, 6, 20)) {
         return sendResponse(res, 400, 'Password must be between 6 to 15 characters');
      }

      const cryptedPassword = await bcrypt.hash(password, 12);
      let tempUsername = first_name + last_name;
      let newUsername = await validateUsername(tempUsername);

      const user = await new User({
         first_name, last_name, email, username: newUsername, password: cryptedPassword
      }).save();

      return sendResponse(res, 200, 'Registration successful. Login to your account.',
         {
            id: user._id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
         });

   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}

// user login
exports.login = async (req, res) => {
   try {
      const {email, password} = req.body;
      const user = await User.findOne({email});
      if (!user) {
         return sendResponse(res, 400, 'User not found');
      }
      const check = await bcrypt.compare(password, user.password);
      if (!check) {
         return sendResponse(res, 400, 'Invalid credentials. Please try again.');
      }
      const token = generateToken({id: user._id.toString()}, '7d')
      return sendResponse(res, 200, 'Login successful.',
         {
            id: user._id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.user_type,
            token: token,
         });
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
}

exports.getUserById = async (req, res) => {
   try {
      const {id} = req.params;
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (isValidId) {
         const user = await User.findById(id);
         if (user && user.user_type === 'admin') {
            return sendResponse(res, 200, "User found.", {user});
         }
         return sendResponse(res, 404, "User not found.");
      }
      return sendResponse(res, 404, "User not found.");
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};