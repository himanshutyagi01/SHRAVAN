/**
 * pages/EditMedicine.tsx — Edit Medicine Page
 * Form to edit an existing medicine.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMedicineByIdApi, updateMedicineApi } from "../api/medicineApi";
import { Medicine, MedicineFormData } from "../types";
import Header from "../components/Header";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

const EditMedicine: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<MedicineFormData>({
    name: "",
    dosage: "",
    time: "",
    days: [],
    notes: "",
    color: "#4F46E5",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return;

      try {
        const response = await getMedicineByIdApi(id);
        const medicine: Medicine = response.data;
        setFormData({
          name: medicine.name,
          dosage: medicine.dosage,
          time: medicine.time,
          days: medicine.days,
          notes: medicine.notes || "",
          color: medicine.color || "#4F46E5",
          isActive: medicine.isActive,
        });
      } catch (error) {
        toast.error("Failed to load medicine");
        navigate("/medicines");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchMedicine();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !formData.name || !formData.dosage || !formData.time || formData.days.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await updateMedicineApi(id, formData);
      toast.success(`${formData.name} updated successfully!`);
      navigate("/medicines");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update medicine");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDayChange = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (fetchLoading) {
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

      <main className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/medicines")}
            className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Medicine</h1>
            <p className="text-xl text-gray-600 mt-1">Update medication details</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              Medicine Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              placeholder="e.g., Aspirin"
            />
          </div>

          <div>
            <label htmlFor="dosage" className="block text-lg font-medium text-gray-700 mb-2">
              Dosage *
            </label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              required
              value={formData.dosage}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              placeholder="e.g., 100mg, 1 tablet"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-lg font-medium text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Days of the Week *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {dayNames.map((day, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl hover:border-indigo-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.days.includes(index + 1)}
                    onChange={() => handleDayChange(index + 1)}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-lg text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-lg font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              placeholder="Any additional instructions or notes"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate("/medicines")}
              className="flex-1 py-4 px-4 border-2 border-gray-300 rounded-xl text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Update Medicine
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditMedicine;