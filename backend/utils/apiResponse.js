/**
 * utils/apiResponse.js — Standardized API Response Helpers
 * Ensures consistent JSON response shapes across all controllers.
 */

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable message
 * @param {object} [data] - Optional payload data
 */
const successResponse = (res, statusCode = 200, message = "Success", data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Array} [errors] - Optional validation error array
 */
const errorResponse = (res, statusCode = 500, message = "An error occurred", errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { successResponse, errorResponse };
