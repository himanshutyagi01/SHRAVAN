/**
 * pages/History.tsx — Medicine History Page
 * Shows past medication records and adherence.
 */

import React, { useState, useEffect } from "react";
import { getHistoryApi } from "../api/medicineApi";
import { DoseHistory } from "../types";
import Header from "../components/Header";
import { History as HistoryIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<DoseHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistoryApi();
        setHistory(response.data);
      } catch (error) {
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "missed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return "text-green-800 bg-green-100";
      case "missed":
        return "text-red-800 bg-red-100";
      default:
        return "text-yellow-800 bg-yellow-100";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not taken";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <HistoryIcon className="h-8 w-8 mr-3 text-indigo-600" />
            Medication History
          </h1>
          <p className="text-xl text-gray-600 mt-2">Track your medication adherence</p>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <HistoryIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No history available</h3>
            <p className="text-gray-600">Your medication history will appear here once you start taking medicines</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(record.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {formatDate(record.date)}
                      </h3>
                      <p className="text-gray-600">
                        Taken at: {formatTime(record.takenAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {history.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {history.filter(h => h.status === "taken").length}
              </div>
              <p className="text-gray-600">Doses Taken</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {history.filter(h => h.status === "missed").length}
              </div>
              <p className="text-gray-600">Doses Missed</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {Math.round((history.filter(h => h.status === "taken").length / history.length) * 100)}%
              </div>
              <p className="text-gray-600">Adherence Rate</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;