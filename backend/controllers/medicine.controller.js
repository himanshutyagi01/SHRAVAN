/**
 * controllers/medicine.controller.js — Medicine CRUD Controller
 * Manages all medicine reminder operations for the authenticated user.
 */

const Medicine = require("../models/Medicine");

// ─── GET /api/medicines ───────────────────────────────────────────────────────
/**
 * Fetch all medicines belonging to the authenticated user.
 * Optionally filters by isActive status.
 */
const getAllMedicines = async (req, res) => {
  try {
    const { active } = req.query;

    // Build query filter
    const filter = { userId: req.user._id };
    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    const medicines = await Medicine.find(filter).sort({ time: 1 }); // Sort by time ascending

    // Attach today's status to each medicine
    const today = new Date().toISOString().split("T")[0];
    const enriched = medicines.map((med) => {
      const obj = med.toJSON();
      const todayRecord = med.history.find((h) => h.date === today);
      obj.todayStatus = todayRecord ? todayRecord.status : "pending";
      return obj;
    });

    res.status(200).json({ success: true, count: enriched.length, medicines: enriched });
  } catch (err) {
    console.error("GetAllMedicines Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch medicines." });
  }
};

// ─── GET /api/medicines/:id ───────────────────────────────────────────────────
/**
 * Fetch a single medicine by its ID (must belong to the user).
 */
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found." });
    }

    res.status(200).json({ success: true, medicine });
  } catch (err) {
    console.error("GetMedicineById Error:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ success: false, message: "Invalid medicine ID." });
    }
    res.status(500).json({ success: false, message: "Failed to fetch medicine." });
  }
};

// ─── POST /api/medicines ──────────────────────────────────────────────────────
/**
 * Create a new medicine reminder for the authenticated user.
 */
const createMedicine = async (req, res) => {
  try {
    const { name, dosage, time, days, notes, color } = req.body;

    const medicine = await Medicine.create({
      userId: req.user._id,
      name: name.trim(),
      dosage: dosage.trim(),
      time,
      days: days || [1, 2, 3, 4, 5, 6, 7],
      notes: notes || "",
      color: color || "#4F46E5",
      isActive: true,
    });

    console.log(`✅ Medicine added: ${medicine.name} for user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: `Medicine "${medicine.name}" added successfully.`,
      medicine,
    });
  } catch (err) {
    console.error("CreateMedicine Error:", err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: "Failed to add medicine." });
  }
};

// ─── PUT /api/medicines/:id ───────────────────────────────────────────────────
/**
 * Update an existing medicine reminder.
 */
const updateMedicine = async (req, res) => {
  try {
    const { name, dosage, time, days, notes, color, isActive } = req.body;

    // Ensure the medicine belongs to the requesting user
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        ...(name && { name: name.trim() }),
        ...(dosage && { dosage: dosage.trim() }),
        ...(time && { time }),
        ...(days && { days }),
        ...(notes !== undefined && { notes }),
        ...(color && { color }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found." });
    }

    console.log(`✅ Medicine updated: ${medicine.name}`);

    res.status(200).json({
      success: true,
      message: `Medicine "${medicine.name}" updated successfully.`,
      medicine,
    });
  } catch (err) {
    console.error("UpdateMedicine Error:", err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, message: "Failed to update medicine." });
  }
};

// ─── DELETE /api/medicines/:id ────────────────────────────────────────────────
/**
 * Delete a medicine reminder permanently.
 */
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found." });
    }

    console.log(`🗑️ Medicine deleted: ${medicine.name}`);

    res.status(200).json({
      success: true,
      message: `Medicine "${medicine.name}" deleted successfully.`,
    });
  } catch (err) {
    console.error("DeleteMedicine Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete medicine." });
  }
};

// ─── PATCH /api/medicines/:id/taken ──────────────────────────────────────────
/**
 * Mark today's dose of a medicine as taken.
 * Updates the history array for today's date.
 */
const markAsTaken = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const medicine = await Medicine.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found." });
    }

    // Find or create today's history entry
    const historyIndex = medicine.history.findIndex((h) => h.date === today);

    if (historyIndex >= 0) {
      // Update existing entry
      medicine.history[historyIndex].status = "taken";
      medicine.history[historyIndex].takenAt = new Date();
    } else {
      // Add new entry for today
      medicine.history.push({
        date: today,
        takenAt: new Date(),
        status: "taken",
      });
    }

    await medicine.save();

    console.log(`✅ ${medicine.name} marked as taken for ${today}`);

    res.status(200).json({
      success: true,
      message: `"${medicine.name}" marked as taken. Great job! 🌟`,
      medicine,
    });
  } catch (err) {
    console.error("MarkAsTaken Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to mark medicine as taken." });
  }
};

// ─── GET /api/medicines/history ──────────────────────────────────────────────
/**
 * Get the dose history for all medicines (last 30 days).
 */
const getHistory = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id }).select(
      "name dosage color history time"
    );

    // Build a flat history list sorted by date (newest first)
    const historyList = [];
    medicines.forEach((med) => {
      med.history.forEach((h) => {
        historyList.push({
          medicineId: med._id,
          medicineName: med.name,
          dosage: med.dosage,
          color: med.color,
          time: med.time,
          date: h.date,
          status: h.status,
          takenAt: h.takenAt,
        });
      });
    });

    // Sort by date descending
    historyList.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ success: true, history: historyList });
  } catch (err) {
    console.error("GetHistory Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch history." });
  }
};

module.exports = {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  markAsTaken,
  getHistory,
};
