/**
 * server.js — Entry point for Shravan Backend
 * Initializes Express app, connects to MongoDB, and starts the server.
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const medicineRoutes = require("./routes/medicine.routes");
const reminderRoutes = require("./routes/reminder.routes");

// Import cron scheduler
const { startReminderScheduler } = require("./services/reminderService");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// CORS — allow requests from the React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shravan API is running 🌿",
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
app.use("/api/auth", authRoutes);         // Authentication routes
app.use("/api/medicines", medicineRoutes); // Medicine CRUD routes
app.use("/api/reminders", reminderRoutes); // Reminder management routes

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── MongoDB Connection + Server Start ────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/shravan")
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Start the cron-based reminder scheduler after DB connects
    startReminderScheduler();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Shravan server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app;
