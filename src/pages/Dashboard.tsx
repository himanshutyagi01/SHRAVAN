/**
 * pages/Dashboard.tsx — Main Dashboard Page
 * Shows today's medicines, allows marking as taken, and provides navigation.
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllMedicinesApi } from "../api/medicineApi";
import { Medicine } from "../types";
import Header from "../components/Header";
import MedicineCard from "../components/MedicineCard";
import VoiceButton from "../components/VoiceButton";
import { Plus, History, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const response = await getAllMedicinesApi(true); // Only active medicines
      setMedicines(response.data);
    } catch (error) {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleVoiceCommand = (transcript: string) => {
    // Simple voice command processing
    const lowerTranscript = transcript.toLowerCase();

    if (lowerTranscript.includes("add medicine") || lowerTranscript.includes("new medicine")) {
      toast.success("Opening add medicine page");
      // Could navigate to add medicine page
    } else if (lowerTranscript.includes("history") || lowerTranscript.includes("past")) {
      toast.success("Opening history page");
      // Could navigate to history
    } else {
      toast(`Voice command: ${transcript}`);
    }
  };

  const todayMedicines = medicines.filter(medicine => {
    const today = new Date().getDay() + 1; // 1 = Monday, 7 = Sunday
    return medicine.days.includes(today);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning!</h1>
          <p className="text-xl text-gray-600">Here's your medicine schedule for today</p>
        </div>

        {/* Voice Command */}
        <div className="mb-6">
          <VoiceButton
            onCommand={handleVoiceCommand}
            placeholder="Voice Commands"
          />
        </div>

        {/* Today's Medicines */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-7 w-7 mr-3 text-indigo-600" />
            Today's Medicines ({todayMedicines.length})
          </h2>

          {todayMedicines.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No medicines scheduled for today</h3>
              <p className="text-gray-600 mb-6">Add your first medicine to get started</p>
              <Link
                to="/medicines/add"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-lg font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Medicine
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {todayMedicines.map(medicine => (
                <MedicineCard
                  key={medicine._id}
                  medicine={medicine}
                  onUpdate={fetchMedicines}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/medicines/add"
            className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Add Medicine</h3>
              <p className="text-gray-600">Schedule a new medication</p>
            </div>
          </Link>

          <Link
            to="/medicines"
            className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Manage Medicines</h3>
              <p className="text-gray-600">View and edit all medicines</p>
            </div>
          </Link>

          <Link
            to="/history"
            className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <History className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">History</h3>
              <p className="text-gray-600">View past medication records</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;