/**
 * utils/generateToken.js — JWT Token Generator Utility
 * Centralized token generation helper.
 */

const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT token for a user.
 * @param {string} userId — MongoDB ObjectId of the user
 * @param {string} [expiresIn] — Optional expiry override (default: from .env)
 * @returns {string} Signed JWT token
 */
const generateToken = (userId, expiresIn) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || "7d" }
  );
};

module.exports = generateToken;
