//import React from "react";
import {
  FileText,
  User,
  Upload,
  Eye,
  Clock,
  Activity,
} from "lucide-react";
import { useAppointments } from "../contexts/AppointmentContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SonographyDashboard() {
  const { appointments, patients } = useAppointments();
  const today = new Date().toISOString().split("T")[0];

  // Filter for sonography appointments
  const sonographyAppointments = appointments.filter((apt) =>
    apt.tests.some((test) => test.department === "Sonography")
  );

  // Today’s scans
  const todayScans = sonographyAppointments.filter((apt) => apt.date === today);
  const todaysScansCount = todayScans.length;
  const pendingReports = todayScans.filter((apt) => apt.status === "scheduled").length;
  const completedScans = todayScans.filter((apt) => apt.status === "completed").length;

  // Weekly trend (group by day for last 7 days)
  const last7days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const scanTrends = last7days.map((day) => {
    const count = sonographyAppointments.filter((apt) => apt.date === day).length;
    return { date: new Date(day).toLocaleDateString("en-GB"), scans: count };
  });

  // Recent Patients
  const recentPatients = sonographyAppointments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((apt) => {
      const patient = patients.find((p) => p.id === apt.patientId);
      return {
        patientName: patient?.name || "Unknown",
        scanType: apt.tests
          .filter((test) => test.department === "Sonography")
          .map((test) => test.name)
          .join(", ") || "Unknown",
        date: apt.date,
        status: apt.status,
      };
    });

  // Upcoming appointments
  const upcomingAppointments = sonographyAppointments
    .filter(
      (apt) => new Date(apt.date) >= new Date(today) && apt.status === "scheduled"
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
    .map((apt) => {
      const patient = patients.find((p) => p.id === apt.patientId);
      return {
        patientName: patient?.name || "Unknown",
        scanType: apt.tests
          .filter((test) => test.department === "Sonography")
          .map((test) => test.name)
          .join(", ") || "Unknown",
        date: apt.date,
        time: apt.time,
      };
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Sonography Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <FileText className="w-8 h-8 text-blue-600 mb-4" />
          <h2 className="text-lg font-semibold">Today’s Scans</h2>
          <p className="text-3xl font-bold mt-2">{todaysScansCount}</p>
          <span className="text-sm text-gray-500">Ultrasound scans today</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <Clock className="w-8 h-8 text-yellow-600 mb-4" />
          <h2 className="text-lg font-semibold">Pending Reports</h2>
          <p className="text-3xl font-bold mt-2">{pendingReports}</p>
          <span className="text-sm text-gray-500">Awaiting approval</span>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <Activity className="w-8 h-8 text-green-600 mb-4" />
          <h2 className="text-lg font-semibold">Completed Scans</h2>
          <p className="text-3xl font-bold mt-2">{completedScans}</p>
          <span className="text-sm text-gray-500">Finished ultrasound scans</span>
        </div>
      </div>

      {/* Scan Trends Chart */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Weekly Scan Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scanTrends}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="scans" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Patients */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Recent Sonography Patients</h2>
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
                    <td className="px-6 py-4">
                      {new Date(patient.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          patient.status === "completed"
                            ? "text-green-600"
                            : patient.status === "in-progress"
                            ? "text-blue-600"
                            : patient.status === "scheduled"
                            ? "text-yellow-600"
                            : "text-gray-600"
                        }`}
                      >
                        {patient.status.charAt(0).toUpperCase() +
                          patient.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No recent sonography patients
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
                      {apt.scanType} - {new Date(apt.date).toLocaleDateString()}{" "}
                      at {apt.time}
                    </p>
                  </div>
                  <span className="text-blue-600 font-medium">Scheduled</span>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500">
                No upcoming appointments
              </li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
              <Upload className="w-4 h-4" />
              Upload Scan Result
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">
              <Eye className="w-4 h-4" />
              View Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
