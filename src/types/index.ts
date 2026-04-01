/**
 * types/index.ts — Shared TypeScript types for the Shravan app
 */

// ─── User Types ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Medicine Types ───────────────────────────────────────────────────────────
export interface DoseHistory {
  date: string;        // "YYYY-MM-DD"
  takenAt: string | null;
  status: "taken" | "missed" | "pending";
}

export interface Medicine {
  _id: string;
  userId: string;
  name: string;
  dosage: string;
  time: string;        // "HH:MM" 24-hour format
  days: number[];      // 1=Mon...7=Sun
  notes?: string;
  isActive: boolean;
  color: string;
  history: DoseHistory[];
  todayStatus: "taken" | "missed" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface MedicineFormData {
  name: string;
  dosage: string;
  time: string;
  days: number[];
  notes?: string;
  color?: string;
  isActive?: boolean;
}

// ─── Reminder Types ───────────────────────────────────────────────────────────
export interface Reminder {
  _id: string;
  userId: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  scheduledDate: string;
  acknowledged: boolean;
  acknowledgedAt: string | null;
  status: "sent" | "acknowledged" | "missed";
  createdAt: string;
}

export interface ReminderStats {
  total: number;
  acknowledged: number;
  missed: number;
  pending: number;
  adherenceRate: string;
  period: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

// ─── Voice Types ──────────────────────────────────────────────────────────────
export interface VoiceCommand {
  transcript: string;
  confidence: number;
}

// ─── Day options ──────────────────────────────────────────────────────────────
export const DAY_OPTIONS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 7, label: "Sun" },
];

// ─── Color palette for medicines ─────────────────────────────────────────────
export const MEDICINE_COLORS = [
  "#4F46E5", // Indigo
  "#0EA5E9", // Sky Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#14B8A6", // Teal
];
