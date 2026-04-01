/**
 * middleware/auth.middleware.js — JWT Authentication Middleware
 * Protects routes by verifying the JWT token sent in request headers.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect — Middleware to authenticate incoming requests.
 * Expects: Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header for Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Reject if no token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please log in.",
      });
    }

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to ensure they still exist
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists. Please log in again.",
      });
    }

    // Attach user to request object for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    // Handle specific JWT errors with friendly messages
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    console.error("Auth Middleware Error:", err.message);
    res.status(500).json({ success: false, message: "Authentication failed." });
  }
};

module.exports = { protect };
