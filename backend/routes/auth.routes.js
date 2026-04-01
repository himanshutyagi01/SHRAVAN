/**
 * routes/auth.routes.js — Authentication Routes
 *
 * POST   /api/auth/signup          → Register new user
 * POST   /api/auth/login           → Login and get JWT
 * GET    /api/auth/me              → Get current user profile (protected)
 * PUT    /api/auth/profile         → Update profile (protected)
 * PUT    /api/auth/change-password → Change password (protected)
 */

const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");
const { validateSignup, validateLogin } = require("../middleware/validate.middleware");

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);

// ─── Protected Routes (require valid JWT) ─────────────────────────────────────
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
