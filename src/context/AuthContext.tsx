/**
 * context/AuthContext.tsx — Global Authentication Context
 * Provides auth state and actions to all components.
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { User } from "../types";
import { getMeApi } from "../api/authApi";

// ─── State & Action Types ─────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_USER"; payload: User };

// ─── Reducer ──────────────────────────────────────────────────────────────────
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// ─── Context Type ─────────────────────────────────────────────────────────────
interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// ─── Create Context ───────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem("shravan_token"),
    isAuthenticated: false,
    isLoading: true, // Start with loading = true to check stored auth
  });

  // On mount: restore session from localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("shravan_token");
      const cachedUser = localStorage.getItem("shravan_user");

      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      try {
        // If we have a cached user, show them immediately
        if (cachedUser) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: JSON.parse(cachedUser), token },
          });
        }

        // Then re-validate with the server
        const res = await getMeApi();
        const { user } = res.data;
        dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
        localStorage.setItem("shravan_user", JSON.stringify(user));
      } catch {
        // Token is invalid or expired — clear everything
        localStorage.removeItem("shravan_token");
        localStorage.removeItem("shravan_user");
        dispatch({ type: "LOGOUT" });
      }
    };

    restoreSession();
  }, []);

  // Login action: store token + user in localStorage
  const login = useCallback((user: User, token: string) => {
    localStorage.setItem("shravan_token", token);
    localStorage.setItem("shravan_user", JSON.stringify(user));
    dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
  }, []);

  // Logout action: clear everything
  const logout = useCallback(() => {
    localStorage.removeItem("shravan_token");
    localStorage.removeItem("shravan_user");
    dispatch({ type: "LOGOUT" });
  }, []);

  // Update user profile in state + localStorage
  const updateUser = useCallback((user: User) => {
    localStorage.setItem("shravan_user", JSON.stringify(user));
    dispatch({ type: "UPDATE_USER", payload: user });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
