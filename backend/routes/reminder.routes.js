/**
 * routes/reminder.routes.js — Reminder Routes
 * All routes are protected (require valid JWT).
 *
 * GET    /api/reminders              → Today's reminders
 * GET    /api/reminders/all          → All reminder logs (paginated)
 * GET    /api/reminders/stats        → Adherence statistics
 * PATCH  /api/reminders/:id/acknowledge → Acknowledge a reminder
 */

const express = require("express");
const router = express.Router();

const {
  getTodayReminders,
  getAllReminders,
  acknowledgeReminder,
  getReminderStats,
} = require("../controllers/reminder.controller");

const { protect } = require("../middleware/auth.middleware");

// Apply auth protection to ALL reminder routes
router.use(protect);

// ─── Routes ───────────────────────────────────────────────────────────────────
router.get("/", getTodayReminders);
router.get("/all", getAllReminders);
router.get("/stats", getReminderStats);
router.patch("/:id/acknowledge", acknowledgeReminder);

module.exports = router;
