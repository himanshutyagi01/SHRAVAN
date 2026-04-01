/**
 * pages/MedicineList.tsx — Medicine Management Page
 * Lists all medicines with options to edit, delete, and add new ones.
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllMedicinesApi, deleteMedicineApi } from "../api/medicineApi";
import { Medicine } from "../types";
import Header from "../components/Header";
import { Plus, Edit, Trash2, Pill } from "lucide-react";
import toast from "react-hot-toast";

const MedicineList: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      const response = await getAllMedicinesApi();
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

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await deleteMedicineApi(id);
      toast.success(`${name} deleted successfully`);
      fetchMedicines();
    } catch (error) {
      toast.error("Failed to delete medicine");
    }
  };

  const getDayNames = (days: number[]) => {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => dayNames[day - 1]).join(", ");
  };

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Medicines</h1>
            <p className="text-xl text-gray-600 mt-2">Manage your medication schedule</p>
          </div>
          <Link
            to="/medicines/add"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-lg font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Medicine
          </Link>
        </div>

        {/* Medicines List */}
        {medicines.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Pill className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No medicines added yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first medicine</p>
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
            {medicines.map(medicine => (
              <div key={medicine._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{medicine.name}</h3>
                  <div className="flex space-x-2">
                    <Link
                      to={`/medicines/edit/${medicine._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit medicine"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(medicine._id, medicine.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete medicine"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-lg text-gray-600">
                    <span className="font-medium">Dosage:</span> {medicine.dosage}
                  </p>
                  <p className="text-lg text-gray-600">
                    <span className="font-medium">Time:</span> {medicine.time}
                  </p>
                  <p className="text-lg text-gray-600">
                    <span className="font-medium">Days:</span> {getDayNames(medicine.days)}
                  </p>
                  {medicine.notes && (
                    <p className="text-lg text-gray-600">
                      <span className="font-medium">Notes:</span> {medicine.notes}
                    </p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      medicine.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {medicine.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MedicineList;