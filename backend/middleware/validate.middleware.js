/**
 * middleware/validate.middleware.js — Request Validation Middleware
 * Provides lightweight validation helpers for route handlers.
 */

/**
 * Validate user signup request body.
 */
const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

/**
 * Validate login request body.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

/**
 * Validate medicine create/update request body.
 */
const validateMedicine = (req, res, next) => {
  const { name, dosage, time } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push("Medicine name is required.");
  }

  if (!dosage || dosage.trim().length === 0) {
    errors.push("Dosage is required.");
  }

  if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    errors.push("Time must be in HH:MM (24-hour) format.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = { validateSignup, validateLogin, validateMedicine };
