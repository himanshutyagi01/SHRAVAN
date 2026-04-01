/**
 * controllers/auth.controller.js — Authentication Controller
 * Handles user registration, login, and profile operations.
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── Helper: Generate JWT Token ───────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ─── Helper: Send token response ──────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      createdAt: user.createdAt,
    },
  });
};

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
/**
 * Register a new user account.
 */
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Create the new user (password will be hashed by pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || "",
      age: age || null,
    });

    console.log(`✅ New user registered: ${user.email}`);

    // Send JWT token back to client
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error("Signup Error:", err.message);

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    res.status(500).json({ success: false, message: "Registration failed. Please try again." });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
/**
 * Authenticate an existing user and return a JWT.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password (it's excluded by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify the provided password against the stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    console.log(`✅ User logged in: ${user.email}`);

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
/**
 * Get the currently authenticated user's profile.
 * Protected route — requires valid JWT.
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("GetMe Error:", err.message);
    res.status(500).json({ success: false, message: "Could not fetch profile." });
  }
};

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
/**
 * Update the authenticated user's profile information.
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, age },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        age: updatedUser.age,
      },
    });
  } catch (err) {
    console.error("UpdateProfile Error:", err.message);
    res.status(500).json({ success: false, message: "Could not update profile." });
  }
};

// ─── PUT /api/auth/change-password ───────────────────────────────────────────
/**
 * Change the authenticated user's password.
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    // Fetch user with password
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error("ChangePassword Error:", err.message);
    res.status(500).json({ success: false, message: "Could not change password." });
  }
};

module.exports = { signup, login, getMe, updateProfile, changePassword };
