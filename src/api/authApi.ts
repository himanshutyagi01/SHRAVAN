/**
 * api/authApi.ts — Authentication API calls
 */

import api from "./axios";

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

// Register a new user
export const signupApi = (data: SignupData) =>
  api.post("/auth/signup", data);

// Login with email + password
export const loginApi = (data: LoginData) =>
  api.post("/auth/login", data);

// Get current user profile
export const getMeApi = () =>
  api.get("/auth/me");

// Update profile
export const updateProfileApi = (data: { name: string; phone?: string; age?: number }) =>
  api.put("/auth/profile", data);

// Change password
export const changePasswordApi = (data: { currentPassword: string; newPassword: string }) =>
  api.put("/auth/change-password", data);
