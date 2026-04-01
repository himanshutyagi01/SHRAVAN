/**
 * api/medicineApi.ts — Medicine CRUD API calls
 */

import api from "./axios";
import { MedicineFormData } from "../types";

// Fetch all medicines (optionally filter by active status)
export const getAllMedicinesApi = (active?: boolean) =>
  api.get("/medicines", { params: active !== undefined ? { active } : {} });

// Get a single medicine by ID
export const getMedicineByIdApi = (id: string) =>
  api.get(`/medicines/${id}`);

// Create a new medicine
export const createMedicineApi = (data: MedicineFormData) =>
  api.post("/medicines", data);

// Update an existing medicine
export const updateMedicineApi = (id: string, data: Partial<MedicineFormData>) =>
  api.put(`/medicines/${id}`, data);

// Delete a medicine
export const deleteMedicineApi = (id: string) =>
  api.delete(`/medicines/${id}`);

// Mark today's dose as taken
export const markAsTakenApi = (id: string) =>
  api.patch(`/medicines/${id}/taken`);

// Get dose history
export const getHistoryApi = () =>
  api.get("/medicines/history");
