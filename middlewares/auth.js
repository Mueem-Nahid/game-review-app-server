const jwt = require("jsonwebtoken");
const {sendResponse} = require("../helpers/utils");
const User = require('../models/User');

exports.authUser = async (req, res, next) => {
   try {
      let tmp = req.header("Authorization");
      const token = tmp ? tmp.slice(7, tmp.length) : ""; // extracting token without 'Bearer'
      if (!token)
         return sendResponse(res, 400, 'Invalid authentication.');
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
         if (err)
            return sendResponse(res, 400, 'Invalid authentication.');
         const user = await User.findById(decodedToken.id)
         if (!user) {
            return sendResponse(res, 400, "User not found.");
         }
         req.user = user;
         next();
      })
   } catch (error) {
      return sendResponse(res, 500, error.message);
   }
};