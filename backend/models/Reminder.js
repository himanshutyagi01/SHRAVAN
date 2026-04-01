/**
 * models/Reminder.js — Mongoose Reminder Log Model
 * Logs every reminder event triggered by the cron scheduler.
 */

const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    // The user who should receive the reminder
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // The medicine this reminder is for
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    // Human-readable medicine name (denormalized for fast reads)
    medicineName: {
      type: String,
      required: true,
    },

    // Dosage info (denormalized)
    dosage: {
      type: String,
      required: true,
    },

    // Scheduled time for this reminder
    scheduledTime: {
      type: String, // "HH:MM"
      required: true,
    },

    // Date this reminder was scheduled for
    scheduledDate: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },

    // Whether the user acknowledged / marked as taken
    acknowledged: {
      type: Boolean,
      default: false,
    },

    // When the reminder was acknowledged
    acknowledgedAt: {
      type: Date,
      default: null,
    },

    // Status of this reminder
    status: {
      type: String,
      enum: ["sent", "acknowledged", "missed"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
