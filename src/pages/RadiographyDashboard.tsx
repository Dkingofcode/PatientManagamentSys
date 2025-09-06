import React, { useState } from "react";
import {
  FileText,
  User,
  Upload,
  Eye,
  Clock,
} from "lucide-react";
import { useAppointments } from "../contexts/AppointmentContext";
import type { Appointment, Patient } from "../contexts/AppointmentContext";

export default function RadiographyDashboard() {
  const { appointments, patients } = useAppointments();
  const today = new Date().toISOString().split("T")[0];

  // State for upload modal and input handling
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Filter for radiology appointments
  const radiologyAppointments = appointments.filter((apt) =>
    apt.tests.some((test) => test.department === "Radiology")
  );

  // Today's radiology scans
  const todayScans = radiologyAppointments.filter((apt) => apt.date === today);

  // Stats calculations
  const todaysScansCount = todayScans.length;
  const pendingReports = todayScans.filter((apt) => apt.status === "scheduled").length;

  // Recent Radiology Patients
  const recentPatients = radiologyAppointments
    .slice() // avoid mutating original
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((apt) => {
      const patient = patients.find((p) => p.id === apt.patientId);
      return {
        patientName: (patient as Patient | undefined)?.name || "Unknown",
        scanType:
          apt.tests
            .filter((test) => test.department === "Radiology")
            .map((test) => test.name)
            .join(", ") || "Unknown",
        date: apt.date,
        status: apt.status,
      };
    });

  // Upcoming Appointments
  const upcomingAppointments = radiologyAppointments
    .filter((apt) => new Date(apt.date) >= new Date(today) && apt.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
    .map((apt) => {
      const patient = patients.find((p) => p.id === apt.patientId);
      return {
        patientName: (patient as Patient | undefined)?.name || "Unknown",
        scanType:
          apt.tests
            .filter((test) => test.department === "Radiology")
            .map((test) => test.name)
            .join(", ") || "Unknown",
        date: apt.date,
        time: apt.time,
      };
    });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("text/"))) {
      setSelectedFile(file);
    } else {
      alert("Please select a PDF or text file.");
    }
  };

  // Handle text input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  // Handle appointment selection for upload
  const handleAppointmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const appointmentId = e.target.value;
    const appointment = radiologyAppointments.find((apt) => apt.id === appointmentId) || null;
    setSelectedAppointment(appointment);
  };

  // Handle upload submission
  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAppointment) {
      alert("Please select an appointment.");
      return;
    }
    if (!selectedFile && !textInput) {
      alert("Please provide a file or text input.");
      return;
    }

    // Prepare data for upload
    const uploadData = {
      appointmentId: selectedAppointment.id,
      patientId: selectedAppointment.patientId,
      file: selectedFile, // File object (PDF or text)
      text: textInput, // Text input (if any)
      uploadDate: new Date().toISOString(),
    };

    try {
      // Placeholder for backend API call or context update
      // Example: await uploadResult(uploadData);
      console.log("Uploading result:", uploadData);

      // Reset form and close modal
      setSelectedFile(null);
      setTextInput("");
      setSelectedAppointment(null);
      setIsUploadModalOpen(false);
      alert("Result uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload result. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Radiography Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <FileText className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-lg font-semibold">Today’s Scans</h2>
          <p className="text-3xl font-bold mt-2">{todaysScansCount}</p>
          <span className="text-sm text-gray-500">Radiology-specific scans today</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <Clock className="w-8 h-8 text-yellow-600 mb-4" />
          <h2 className="text-lg font-semibold">Pending Reports</h2>
          <p className="text-3xl font-bold mt-2">{pendingReports}</p>
          <span className="text-sm text-gray-500">Awaiting doctor approval</span>
        </div>
      </div>

      {/* Recent Radiography Patients */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Recent Radiography Patients</h2>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Scan Type</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-500" />
                      {patient.patientName}
                    </td>
                    <td className="px-6 py-4">{patient.scanType}</td>
                    <td className="px-6 py-4">{new Date(patient.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          patient.status === "completed" ? "text-green-600" :
                          patient.status === "in-progress" ? "text-blue-600" :
                          patient.status === "scheduled" ? "text-yellow-600" :
                          "text-gray-600"
                        }`}
                      >
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No recent radiography patients
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Appointments + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          <ul className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{apt.patientName}</p>
                    <p className="text-sm text-gray-500">
                      {apt.scanType} - {new Date(apt.date).toLocaleDateString()} at {apt.time}
                    </p>
                  </div>
                  <span className="text-blue-600 font-medium">Scheduled</span>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500">No upcoming appointments</li>
            )}
          </ul>
        </div>

        <div className="bg-red rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              <Upload className="w-4 h-4" />
              Upload Result
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">
              <Eye className="w-4 h-4" />
              View Requests
            </button>
          </div>
        </div>
      </div>

      {/* Upload Result Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Result</h2>
            <form onSubmit={handleUploadSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Appointment
                </label>
                <select
                  onChange={handleAppointmentSelect}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select an appointment</option>
                  {radiologyAppointments.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {patients.find((p) => p.id === apt.patientId)?.name || "Unknown"} - {apt.tests.map((t) => t.name).join(", ")} ({apt.date})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File (PDF or Text)
                </label>
                <input
                  type="file"
                  accept=".pdf,text/plain"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Enter Text Result
                </label>
                <textarea
                  value={textInput}
                  onChange={handleTextChange}
                  placeholder="Enter text result here..."
                  className="w-full p-2 border rounded-lg"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
