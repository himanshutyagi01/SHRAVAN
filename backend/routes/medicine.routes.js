/**
 * routes/medicine.routes.js — Medicine Routes
 * All routes are protected (require valid JWT).
 *
 * GET    /api/medicines            → Get all medicines
 * POST   /api/medicines            → Create medicine
 * GET    /api/medicines/history    → Get dose history
 * GET    /api/medicines/:id        → Get single medicine
 * PUT    /api/medicines/:id        → Update medicine
 * DELETE /api/medicines/:id        → Delete medicine
 * PATCH  /api/medicines/:id/taken  → Mark today's dose as taken
 */

const express = require("express");
const router = express.Router();

const {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  markAsTaken,
  getHistory,
} = require("../controllers/medicine.controller");

const { protect } = require("../middleware/auth.middleware");
const { validateMedicine } = require("../middleware/validate.middleware");

// Apply auth protection to ALL medicine routes
router.use(protect);

// ─── Routes ───────────────────────────────────────────────────────────────────
router.get("/history", getHistory);                    // Must be before /:id
router.get("/", getAllMedicines);
router.post("/", validateMedicine, createMedicine);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);
router.patch("/:id/taken", markAsTaken);

module.exports = router;
