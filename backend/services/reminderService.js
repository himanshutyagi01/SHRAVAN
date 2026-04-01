/**
 * services/reminderService.js — Cron-based Reminder Scheduler
 *
 * Runs every minute to check if any medicine reminders are due.
 * Creates Reminder log entries and marks medicines for notification.
 *
 * Cron syntax: "* * * * *" = every minute
 * (second) (minute) (hour) (day) (month) (weekday)
 */

const cron = require("node-cron");
const Medicine = require("../models/Medicine");
const Reminder = require("../models/Reminder");

/**
 * Converts a JS Date day (0=Sun...6=Sat) to our schema day (1=Mon...7=Sun)
 */
const jsDateDayToSchemDay = (jsDay) => {
  // JS: 0=Sun, 1=Mon...6=Sat → Schema: 1=Mon...7=Sun
  return jsDay === 0 ? 7 : jsDay;
};

/**
 * checkAndSendReminders — Core scheduler logic
 * Called every minute by node-cron.
 */
const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`; // e.g. "09:30"
    const today = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const currentDay = jsDateDayToSchemDay(now.getDay()); // 1-7

    // Find all active medicines scheduled for this exact time and today's day
    const medicines = await Medicine.find({
      isActive: true,
      time: currentTime,
      days: { $in: [currentDay] },
    }).populate("userId", "name email");

    if (medicines.length === 0) return;

    console.log(
      `⏰ [${currentTime}] Checking reminders... Found ${medicines.length} due medicine(s).`
    );

    for (const medicine of medicines) {
      // Prevent duplicate reminders: check if one was already created today at this time
      const existingReminder = await Reminder.findOne({
        medicineId: medicine._id,
        scheduledDate: today,
        scheduledTime: currentTime,
      });

      if (existingReminder) {
        console.log(`⚠️ Reminder already sent for ${medicine.name} at ${currentTime}`);
        continue;
      }

      // Create a new reminder log entry
      const reminder = await Reminder.create({
        userId: medicine.userId._id,
        medicineId: medicine._id,
        medicineName: medicine.name,
        dosage: medicine.dosage,
        scheduledTime: currentTime,
        scheduledDate: today,
        status: "sent",
      });

      // Ensure today's history entry exists on the medicine
      const historyIndex = medicine.history.findIndex((h) => h.date === today);
      if (historyIndex === -1) {
        medicine.history.push({ date: today, status: "pending", takenAt: null });
        medicine.lastReminderSent = now;
        await medicine.save();
      }

      console.log(
        `📣 Reminder sent: "${medicine.name}" for user ${medicine.userId.email} at ${currentTime}`
      );
    }
  } catch (err) {
    console.error("❌ Reminder scheduler error:", err.message);
  }
};

/**
 * markMissedReminders — Runs every hour to mark unacknowledged reminders as missed.
 * A reminder is "missed" if it was sent more than 60 minutes ago and not acknowledged.
 */
const markMissedReminders = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const result = await Reminder.updateMany(
      {
        status: "sent",
        acknowledged: false,
        createdAt: { $lt: oneHourAgo },
      },
      {
        $set: { status: "missed" },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`⚠️ Marked ${result.modifiedCount} reminder(s) as missed.`);
    }
  } catch (err) {
    console.error("❌ MarkMissed scheduler error:", err.message);
  }
};

/**
 * startReminderScheduler — Initialize all cron jobs.
 * Call this once after MongoDB connection is established.
 */
const startReminderScheduler = () => {
  console.log("⏰ Starting Shravan Reminder Scheduler...");

  // Check for due reminders every minute
  cron.schedule("* * * * *", checkAndSendReminders, {
    timezone: "Asia/Kolkata", // IST — change as needed
  });

  // Mark missed reminders every hour at minute 5 (e.g., 09:05, 10:05...)
  cron.schedule("5 * * * *", markMissedReminders, {
    timezone: "Asia/Kolkata",
  });

  console.log("✅ Reminder scheduler is running (checks every minute)");
};

module.exports = { startReminderScheduler, checkAndSendReminders };
