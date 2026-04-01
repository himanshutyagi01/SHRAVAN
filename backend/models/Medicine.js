/**
 * models/Medicine.js — Mongoose Medicine Model
 * Represents a medicine/medication reminder for a user.
 */

const mongoose = require("mongoose");

// Sub-schema for tracking individual dose history
const doseHistorySchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: "YYYY-MM-DD"
      required: true,
    },
    takenAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["taken", "missed", "pending"],
      default: "pending",
    },
  },
  { _id: false }
);

const medicineSchema = new mongoose.Schema(
  {
    // Reference to the owner user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster user-specific queries
    },

    // Name of the medicine (e.g., "Metformin", "Aspirin")
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
      maxlength: [100, "Medicine name cannot exceed 100 characters"],
    },

    // Dosage amount (e.g., "500mg", "1 tablet")
    dosage: {
      type: String,
      required: [true, "Dosage is required"],
      trim: true,
      maxlength: [50, "Dosage cannot exceed 50 characters"],
    },

    // Time to take the medicine (24-hour format "HH:MM")
    time: {
      type: String,
      required: [true, "Reminder time is required"],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"],
    },

    // Days of the week to take this medicine (1=Mon ... 7=Sun)
    days: {
      type: [Number],
      default: [1, 2, 3, 4, 5, 6, 7], // Every day by default
      validate: {
        validator: (arr) => arr.every((d) => d >= 1 && d <= 7),
        message: "Days must be between 1 (Mon) and 7 (Sun)",
      },
    },

    // Additional notes or instructions (e.g., "Take after meals")
    notes: {
      type: String,
      trim: true,
      maxlength: [200, "Notes cannot exceed 200 characters"],
      default: "",
    },

    // Whether this medicine reminder is currently active
    isActive: {
      type: Boolean,
      default: true,
    },

    // Color tag for visual distinction in UI
    color: {
      type: String,
      default: "#4F46E5", // Indigo by default
    },

    // History of dose statuses
    history: {
      type: [doseHistorySchema],
      default: [],
    },

    // Track the last time a reminder was sent
    lastReminderSent: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ─── Virtual: Today's status ───────────────────────────────────────────────────
medicineSchema.virtual("todayStatus").get(function () {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const todayRecord = this.history.find((h) => h.date === today);
  return todayRecord ? todayRecord.status : "pending";
});

// Ensure virtuals are included in JSON output
medicineSchema.set("toJSON", { virtuals: true });
medicineSchema.set("toObject", { virtuals: true });

const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;
