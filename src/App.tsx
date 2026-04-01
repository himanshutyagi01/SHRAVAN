/**
 * App.tsx — Main Application Component
 * Sets up routing, authentication, and global providers.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MedicineList from "./pages/MedicineList";
import AddMedicine from "./pages/AddMedicine";
import EditMedicine from "./pages/EditMedicine";
import History from "./pages/History";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicines"
              element={
                <ProtectedRoute>
                  <MedicineList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicines/add"
              element={
                <ProtectedRoute>
                  <AddMedicine />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicines/edit/:id"
              element={
                <ProtectedRoute>
                  <EditMedicine />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: '16px',
              padding: '16px',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
