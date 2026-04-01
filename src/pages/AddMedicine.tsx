/**
 * pages/AddMedicine.tsx — Add New Medicine Page
 * Form to add a new medicine with voice support.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMedicineApi } from "../api/medicineApi";
import { MedicineFormData } from "../types";
import Header from "../components/Header";
import VoiceButton from "../components/VoiceButton";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

const AddMedicine: React.FC = () => {
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

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.dosage || !formData.time || formData.days.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await createMedicineApi(formData);
      toast.success(`${formData.name} added successfully!`);
      navigate("/medicines");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add medicine");
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

  const handleVoiceCommand = (transcript: string) => {
    // Simple voice command parsing for medicine addition
    const lowerTranscript = transcript.toLowerCase();

    // Extract medicine name
    if (lowerTranscript.includes("add") && lowerTranscript.includes("medicine")) {
      const nameMatch = lowerTranscript.match(/add\s+(\w+)\s+medicine/);
      if (nameMatch) {
        setFormData(prev => ({ ...prev, name: nameMatch[1] }));
        toast.success(`Medicine name set to: ${nameMatch[1]}`);
      }
    }

    // Extract dosage
    const dosageMatch = lowerTranscript.match(/(\d+\s*(mg|g|ml|tablet|capsule))/i);
    if (dosageMatch) {
      setFormData(prev => ({ ...prev, dosage: dosageMatch[1] }));
      toast.success(`Dosage set to: ${dosageMatch[1]}`);
    }

    // Extract time
    const timeMatch = lowerTranscript.match(/(\d{1,2}:\d{2})/);
    if (timeMatch) {
      setFormData(prev => ({ ...prev, time: timeMatch[1] }));
      toast.success(`Time set to: ${timeMatch[1]}`);
    }
  };

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
            <h1 className="text-3xl font-bold text-gray-900">Add New Medicine</h1>
            <p className="text-xl text-gray-600 mt-1">Schedule a medication</p>
          </div>
        </div>

        {/* Voice Command */}
        <div className="mb-6">
          <VoiceButton
            onCommand={handleVoiceCommand}
            placeholder="Voice Add Medicine"
          />
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
                  Add Medicine
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddMedicine;