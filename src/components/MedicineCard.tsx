/**
 * components/MedicineCard.tsx — Medicine Display Card
 * Shows medicine details and allows marking as taken.
 */

import React from "react";
import { Medicine } from "../types";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { markAsTakenApi } from "../api/medicineApi";
import toast from "react-hot-toast";

interface MedicineCardProps {
  medicine: Medicine;
  onUpdate: () => void;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onUpdate }) => {
  const handleMarkTaken = async () => {
    try {
      await markAsTakenApi(medicine._id);
      toast.success(`${medicine.name} marked as taken!`);
      onUpdate();
    } catch (error) {
      toast.error("Failed to mark as taken");
    }
  };

  const getStatusIcon = () => {
    switch (medicine.todayStatus) {
      case "taken":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "missed":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (medicine.todayStatus) {
      case "taken":
        return "border-green-200 bg-green-50";
      case "missed":
        return "border-red-200 bg-red-50";
      default:
        return "border-yellow-200 bg-yellow-50";
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${getStatusColor()} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {medicine.name}
          </h3>
          <p className="text-lg text-gray-600 mb-3">
            Dosage: {medicine.dosage}
          </p>
          <div className="flex items-center space-x-2 text-lg text-gray-700 mb-3">
            <Clock className="h-5 w-5" />
            <span>{medicine.time}</span>
          </div>
          {medicine.notes && (
            <p className="text-gray-600 mb-3">{medicine.notes}</p>
          )}
        </div>
        <div className="flex flex-col items-center space-y-2">
          {getStatusIcon()}
          {medicine.todayStatus === "pending" && (
            <button
              onClick={handleMarkTaken}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
            >
              Mark Taken
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;