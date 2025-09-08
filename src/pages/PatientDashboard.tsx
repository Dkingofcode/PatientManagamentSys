import React, { useState } from "react";
import Layout from "../components/Layout";
import { Calendar, FileText, Clock, Download, Shield, Eye } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";
import axios from "axios";

function PatientDashboard() {
  // const { user } = useAuth();
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "upcoming" | "completed" | "pending" | "ready"
  >("all");
 const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const { user } = useAuth();
  const appointments = [
    {
      id: "1",
      date: "2025-01-15",
      time: "10:00 AM",
      doctor: "Dr. Michael Smith",
      tests: ["Blood Test", "Urine Test"],
      status: "scheduled",
    },
    {
      id: "2",
      date: "2025-01-10",
      time: "2:00 PM",
      doctor: "Dr. Emily Wilson",
      tests: ["X-Ray"],
      status: "completed",
    },
  ];

  const testResults = [
    {
      id: "1",
      date: "2025-01-10",
      test: "X-Ray",
      doctor: "Dr. Emily Wilson",
      status: "ready",
    },
    {
      id: "2",
      date: "2025-01-08",
      test: "Blood Test",
      doctor: "Dr. Michael Smith",
      status: "ready",
    },
  ];

  // const handleViewResults = (resultId: string) => {
  //   setShow2FA(true);
  //   console.log(resultId);
  // };

  // const verify2FA = () => {
  //   if (verificationCode === "123456") {
  //     setShow2FA(false);
  //     setVerificationCode("");
  //     alert("Results downloaded successfully!");
  //   } else {
  //     alert("Invalid verification code. Try: 123456");
  //   }
  // };

  const token = localStorage.getItem("token");

// Step 1: Request OTP
const handleViewResults = async (resultId: string) => {
  try {
    await axios.post(
      `http://localhost:8000/api/results/${resultId}/request-access`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setActiveResultId(resultId);
    setShow2FA(true);
  } catch (err) {
    console.error("Error requesting OTP:", err);
    alert("Could not request OTP. Please try again.");
  }
};

// Step 2: Verify OTP & Download Result
const verify2FA = async () => {
  if (!activeResultId) return;

  try {
    const response = await axios.post(
      `http://localhost:8000/api/results/${activeResultId}/access`,
      { accessCode: verificationCode },
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for PDF
      }
    );

    // Download PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `result_${activeResultId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Reset modal
    setShow2FA(false);
    setVerificationCode("");
    setActiveResultId(null);
  } catch (err) {
    console.error("Error verifying OTP:", err);
    alert("Invalid or expired code. Please request again.");
  }
};

  const stats = [
    {
      label: "Upcoming Appointments",
      value: appointments.filter((apt) => apt.status === "scheduled").length,
      icon: Calendar,
      color: "bg-gray-700",
    },
    {
      label: "Completed Tests",
      value: appointments.filter((apt) => apt.status === "completed").length,
      icon: FileText,
      color: "bg-gray-700",
    },
    {
      label: "Pending Results",
      value: testResults.filter((result) => result.status === "pending").length,
      icon: Clock,
      color: "bg-gray-700",
    },
    {
      label: "Available Results",
      value: testResults.filter((result) => result.status === "ready").length,
      icon: Download,
      color: "bg-gray-700",
    },
  ];

  return (
    <Layout title={`Welcome,${user?.firstName || "User"}!`}>
      <div className="space-y-6">
        {/* Reset Filter */}
        <div className="flex justify-end">
          <button
            className="mb-4 px-4 py-2 text-sm text-blue-600 hover:underline"
            onClick={() => setActiveFilter("all")}
          >
            Show All
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  if (stat.label.includes("Upcoming"))
                    setActiveFilter("upcoming");
                  else if (stat.label.includes("Completed"))
                    setActiveFilter("completed");
                  else if (stat.label.includes("Pending"))
                    setActiveFilter("pending");
                  else if (stat.label.includes("Available"))
                    setActiveFilter("ready");
                }}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                My Appointments
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {appointments
                .filter((appointment) => {
                  if (activeFilter === "all") return true;
                  if (activeFilter === "upcoming")
                    return appointment.status === "scheduled";
                  if (activeFilter === "completed")
                    return appointment.status === "completed";
                  return true;
                })
                .map((appointment) => (
                  <div key={appointment.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {appointment.doctor}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.tests.join(", ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield size={20} className="mr-2" />
                Secure Test Results
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {testResults
                .filter((result) => {
                  if (activeFilter === "pending")
                    return result.status === "pending";
                  if (activeFilter === "ready")
                    return result.status === "ready";
                  return true;
                })
                .map((result) => (
                  <div key={result.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {result.test}
                        </h3>
                        <p className="text-sm text-gray-600">{result.doctor}</p>
                        <p className="text-sm text-gray-500">{result.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Ready
                        </span>
                        <button
                          onClick={() => handleViewResults(result.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-colors"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 2FA Modal */}
        {show2FA && (
          <div className="fixed inset-0 bg-white bg-opacity-1 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 border-[2px] border-purple-600 shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield size={20} className="mr-2" />
                  Secure Access Verification
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  For your security, please enter the verification code sent to
                  your email to access your test results.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={6}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShow2FA(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={verify2FA}
                    className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900"
                  >
                    Verify & Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default PatientDashboard;
