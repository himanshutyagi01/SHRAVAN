/**
 * api/axios.ts — Axios HTTP Client Configuration
 * Sets up the base URL and request/response interceptors for the Shravan API.
 */

import axios from "axios";

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Automatically attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shravan_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
// Handle global error responses (e.g., auto-logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server responds with 401 (Unauthorized), clear local auth state
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Only redirect if not already on auth pages
      if (!currentPath.includes("/login") && !currentPath.includes("/signup")) {
        localStorage.removeItem("shravan_token");
        localStorage.removeItem("shravan_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
