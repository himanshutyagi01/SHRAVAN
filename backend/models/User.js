/**
 * models/User.js — Mongoose User Model
 * Stores user account information with hashed passwords.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    // Unique email used for login
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    // Hashed password (never stored as plain text)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Exclude from queries by default
    },

    // Optional phone number for future SMS reminders
    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // Age of the user (for elderly-specific features)
    age: {
      type: Number,
      min: 0,
      max: 120,
      default: null,
    },

    // Profile creation timestamp
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Pre-save Hook: Hash password before saving ───────────────────────────────
userSchema.pre("save", async function (next) {
  // Only hash if password was modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Generate salt with cost factor 12 (good security/performance balance)
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Instance Method: Compare plain password with stored hash ─────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance Method: Return safe user object (no password) ──────────────────
userSchema.methods.toSafeObject = function () {
  const { password, __v, ...safeUser } = this.toObject();
  return safeUser;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
