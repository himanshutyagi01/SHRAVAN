/**
 * controllers/reminder.controller.js — Reminder Controller
 * Handles reminder log retrieval and acknowledgement.
 */

const Reminder = require("../models/Reminder");
const Medicine = require("../models/Medicine");

// ─── GET /api/reminders ───────────────────────────────────────────────────────
/**
 * Get all reminders for today for the authenticated user.
 */
const getTodayReminders = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const reminders = await Reminder.find({
      userId: req.user._id,
      scheduledDate: today,
    }).sort({ scheduledTime: 1 });

    res.status(200).json({ success: true, count: reminders.length, reminders });
  } catch (err) {
    console.error("GetTodayReminders Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch reminders." });
  }
};

// ─── GET /api/reminders/all ───────────────────────────────────────────────────
/**
 * Get all reminder logs for the user (paginated, last 7 days default).
 */
const getAllReminders = async (req, res) => {
  try {
    const { page = 1, limit = 20, days = 7 } = req.query;

    // Calculate the date range
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));
    const fromStr = fromDate.toISOString().split("T")[0];

    const reminders = await Reminder.find({
      userId: req.user._id,
      scheduledDate: { $gte: fromStr },
    })
      .sort({ scheduledDate: -1, scheduledTime: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Reminder.countDocuments({
      userId: req.user._id,
      scheduledDate: { $gte: fromStr },
    });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      reminders,
    });
  } catch (err) {
    console.error("GetAllReminders Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch reminder history." });
  }
};

// ─── PATCH /api/reminders/:id/acknowledge ────────────────────────────────────
/**
 * Acknowledge (mark as seen/taken) a specific reminder.
 */
const acknowledgeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found." });
    }

    if (reminder.acknowledged) {
      return res.status(400).json({ success: false, message: "Reminder already acknowledged." });
    }

    reminder.acknowledged = true;
    reminder.acknowledgedAt = new Date();
    reminder.status = "acknowledged";
    await reminder.save();

    // Also update the medicine's history for today
    await Medicine.findOneAndUpdate(
      {
        _id: reminder.medicineId,
        userId: req.user._id,
        "history.date": reminder.scheduledDate,
      },
      {
        $set: {
          "history.$.status": "taken",
          "history.$.takenAt": new Date(),
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Reminder acknowledged. Well done! 🌟",
      reminder,
    });
  } catch (err) {
    console.error("AcknowledgeReminder Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to acknowledge reminder." });
  }
};

// ─── GET /api/reminders/stats ─────────────────────────────────────────────────
/**
 * Get summary statistics for the user's medication adherence.
 */
const getReminderStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));
    const fromStr = fromDate.toISOString().split("T")[0];

    const total = await Reminder.countDocuments({
      userId: req.user._id,
      scheduledDate: { $gte: fromStr },
    });

    const acknowledged = await Reminder.countDocuments({
      userId: req.user._id,
      scheduledDate: { $gte: fromStr },
      status: "acknowledged",
    });

    const missed = await Reminder.countDocuments({
      userId: req.user._id,
      scheduledDate: { $gte: fromStr },
      status: "missed",
    });

    const adherenceRate = total > 0 ? Math.round((acknowledged / total) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        total,
        acknowledged,
        missed,
        pending: total - acknowledged - missed,
        adherenceRate: `${adherenceRate}%`,
        period: `Last ${days} days`,
      },
    });
  } catch (err) {
    console.error("GetReminderStats Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
};

module.exports = {
  getTodayReminders,
  getAllReminders,
  acknowledgeReminder,
  getReminderStats,
};
