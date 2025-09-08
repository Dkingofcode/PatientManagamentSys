import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useAppointments } from "../contexts/AppointmentContext";
import { useNotifications } from "../contexts/NotificationContext";
import axios from "axios";
import ApproveResultForm from "../components/Modals/HandleApprove";
import {
  Clock,
  Users,
  TestTube,
  FileCheck,
  Search,
  Filter,
  User,
  Calendar,
  RefreshCw,
  CheckCircle,
  X,
  Eye,
  Send,
  AlertCircle,
  FileText,
  FileSignature as Signature,
  XCircle,
  Bell,
} from "lucide-react";
import ResultModal from "../components/Modals/ResultModal";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  tests: {
    id: string;
    name: string;
    price: number;
    prices: { [key: string]: number };
    duration: number;
    department: string;
  }[];
  status:
    | "scheduled"
    | "in-progress"
    | "lab-completed"
    | "completed"
    | "cancelled"
    | "rejected";
  doctorApproved: boolean;
  labAssigned: boolean;
  assignedLabTech?: string;
  approvedAt?: string;
  doctorSignature?: string;
  doctorComments?: string;
  finalizedAt?: string;
  remarks?: string;
  results?: string[];
  rescheduleHistory?: {
    originalDate: string;
    originalTime: string;
    newDate: string;
    newTime: string;
    timestamp: string;
    reason?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  sampleId?: string;
  sampleStatus?: "received" | "pending" | "rejected";
  sampleCondition?: string;
  technicianNotes?: string;
  qcStatus?: "passed" | "failed" | "pending";
  startTime?: string;
  completionTime?: string;
  priority?: "low" | "normal" | "high";
  department?: string;
  report?: { file: File; notes: string; uploadedAt: string; fileUrl?: string };
}

interface Notification {
  id: string;
  testRequestId: string;
  resultId: string;
  patientName: string;
  testName: string;
  submittedBy: string;
  fileName: string;
  fileUrl: string;
  receivedAt: string;
  read: boolean;
}

interface Result {
  id: string;
  testRequestId: string;
  resultId: string;
  patientName: string;
  testName: string;
  submittedBy: string;
  fileName: string;
  fileUrl: string;
  receivedAt: string;
  read: boolean;
}

function DoctorDashboard() {
  const { user } = useAuth();
  const { appointments, patients, updateAppointment, rescheduleAppointment, fetchResults } =
    useAppointments();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [results, setResults] = useState([]);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Fetch all existing test results
  useEffect(() => {
    const fetchAllResults = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get("http://localhost:8000/api/results", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("API response:", response.data);
        const fetchedResults = response.data.results || [];
        setResults(fetchedResults); // Set results state
        const fetchedNotifications = fetchedResults.map((result: any) => ({
          id: `notif-${result.resultId}-${result.receivedAt}`,
          testRequestId: result.testRequestId,
          resultId: result.resultId,
          patientName: result.patientName,
          testName: result.testName,
          submittedBy: result.submittedBy,
          fileName: result.fileName,
          fileUrl: result.fileUrl,
          receivedAt: result.receivedAt,
          read: result.read || false,
        }));
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.resultId));
          const newNotifications = fetchedNotifications.filter(
            (n: Notification) => !existingIds.has(n.resultId)
          );
          return [...newNotifications, ...prev];
        });

        console.log(notifications);
        

        // Fetch results for lab-completed appointments
        const labCompletedAppointments = appointments.filter(
          (apt) => apt.status === "lab-completed" && !apt.report
        );
        for (const appointment of labCompletedAppointments) {
          try {
            await fetchResults(appointment.id);
          } catch (err) {
            console.error(`Error fetching results for appointment ${appointment.id}:`, err);
          }
        }
      } catch (err) {
        console.error("Error fetching all results:", err);
        addNotification({
          title: "Error",
          message: "Failed to fetch test results.",
          type: "error",
        });
      }
    };
    fetchAllResults();
  }, [user?.id, appointments, fetchResults, addNotification]);

  // Initialize Socket.IO for real-time notifications
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found for Socket.IO authentication");
      return;
    }

    const socketInstance = io("http://localhost:8000", {
      auth: { token },
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socketInstance.emit("join", "doctor");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
      addNotification({
        title: "Connection Error",
        message: "Failed to connect to real-time notifications.",
        type: "error",
      });
    });

    socketInstance.on("result_submitted", (data: any) => {
      console.log("Received result_submitted event:", data);
      const notification: Notification = {
        id: `notif-${Date.now()}-${data.resultId}`,
        testRequestId: data.testRequestId,
        resultId: data.resultId,
        patientName: data.patientName,
        testName: data.testName,
        submittedBy: data.submittedBy,
        fileName: data.fileName || "Result File",
        fileUrl: `/api/files/${data.resultId}`,
        receivedAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => {
        if (prev.some((n) => n.resultId === notification.resultId)) {
          return prev;
        }
        return [notification, ...prev];
      });


      setResults((prev) => {
        if (prev.some((r) => r.resultId === data.resultId)) {
          return prev;
        }
        return [
          {
            id: `notif-${Date.now()}-${data.resultId}`,
            testRequestId: data.testRequestId,
            resultId: data.resultId,
            patientName: data.patientName,
            testName: data.testName,
            submittedBy: data.submittedBy,
            fileName: data.fileName || "Result File",
            fileUrl: `/api/files/${data.resultId}`,
            receivedAt: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ];
      });
      addNotification({
        title: "New Test Result",
        message: `Result for ${data.patientName}'s ${data.testName} submitted by ${data.submittedBy}`,
        type: "info",
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      console.log("Disconnected from Socket.IO server");
    };
  }, [addNotification]);

  if (!user) {
    navigate("/login");
    return null;
  }

  console.log(notifications);
  console.log(results);

  const doctorAppointments = appointments.filter(
    (appointment) => appointment.doctorId === user.id
  );

  const todayAppointments = doctorAppointments.filter(
    (appointment) => appointment.date === today
  );

  const filteredAppointments = doctorAppointments.filter((appointment) => {
    const patient = patients.find((p) => p.id === appointment.patientId);
    const matchesSearch =
      !searchTerm ||
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = doctorAppointments.filter(
    (apt) => apt.status === "scheduled" && !apt.doctorApproved
  ).length;
  const assignedTests = doctorAppointments.filter(
    (apt) => apt.status === "in-progress"
  ).length;
  const awaitingResults = doctorAppointments.filter(
    (apt) => apt.status === "lab-completed" && apt.report
  ).length;
  const forApproval = doctorAppointments.filter(
    (apt) => apt.status === "lab-completed" && apt.report
  ).length;

  const handleViewResults = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsLoadingResults(true);
    try {
      await fetchResults(appointment.id);
      setShowResultsModal(true);
    } catch (err) {
      console.error("Error fetching results:", err);
      addNotification({
        title: "Error",
        message: "Failed to fetch test results. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleApprove = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowApprovalModal(true);
  };

  const submitReschedule = (newDate: string, newTime: string, reason: string) => {
    if (selectedAppointment) {
      const patient = patients.find((p) => p.id === selectedAppointment.patientId);
      rescheduleAppointment(selectedAppointment.id, newDate, newTime, reason);
      addNotification({
        title: "Appointment Rescheduled",
        message: `Appointment for ${patient?.name} has been rescheduled to ${newDate} at ${newTime}`,
        type: "info",
      });
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
    }
  };

  const approveAndForwardToLab = (labTechnicianId?: string) => {
    if (selectedAppointment) {
      const patient = patients.find((p) => p.id === selectedAppointment.patientId);
      updateAppointment(selectedAppointment.id, {
        doctorApproved: true,
        labAssigned: true,
        status: "in-progress",
        assignedLabTech: labTechnicianId,
        approvedAt: new Date().toISOString(),
      });
      addNotification({
        title: "Tests Approved & Forwarded to Lab",
        message: `Tests for ${patient?.name} (${selectedAppointment.tests
          .map((t) => t.name)
          .join(", ")}) have been approved and forwarded to lab technicians`,
        type: "success",
      });
      setShowApprovalModal(false);
      setSelectedAppointment(null);
    }
  };

  const approveResults = (signature: string, comments: string) => {
    if (selectedAppointment) {
      const patient = patients.find((p) => p.id === selectedAppointment.patientId);
      updateAppointment(selectedAppointment.id, {
        status: "completed",
        doctorSignature: signature,
        doctorComments: comments,
        finalizedAt: new Date().toISOString(),
      });
      addNotification({
        title: "Results Approved & Sent to Patient",
        message: `Test results for ${patient?.name} have been approved and sent to patient portal`,
        type: "success",
      });
      setShowResultsModal(false);
      setSelectedAppointment(null);
    }
  };

  const rejectResults = (comments: string) => {
    if (selectedAppointment) {
      const patient = patients.find((p) => p.id === selectedAppointment.patientId);
      updateAppointment(selectedAppointment.id, {
        status: "rejected",
        doctorComments: comments,
        finalizedAt: new Date().toISOString(),
      });
      addNotification({
        title: "Results Rejected",
        message: `Test results for ${patient?.name} have been rejected with comments: ${comments}`,
        type: "error",
      });
      setShowResultsModal(false);
      setSelectedAppointment(null);
    }
  };

  const handleDownloadFile = async (notification: Notification) => {
    try {
      const response = await fetch(`http://localhost:8000${notification.fileUrl}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to download file");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = notification.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Mark notification as read
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );

      // Optionally mark as read in backend
      await axios.patch(
        `http://localhost:8000/api/results/${notification.resultId}/read`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Error downloading file:", err);
      addNotification({
        title: "Error",
        message: "Failed to download file. Please try again.",
        type: "error",
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout title="">
      <div className="space-y-6 px-2 sm:px-4 relative">
        {/* Message Box */}
        <div className="fixed top-4 right-4 z-50">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications ({notifications.length})
                  </h3>
                </div>
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {results.results.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          notification.read ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">
                          Result for {notification.testName}
                        </p>
                        <p className="text-xs text-gray-600">
                          Patient: {notification.patientName}
                        </p>
                        <p className="text-xs text-gray-600">
                          Submitted by: {notification.submittedBy}
                        </p>
                        <p className="text-xs text-gray-600">
                          File: {notification.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Received: {new Date(notification.receivedAt).toLocaleString("en-NG", {
                            timeZone: "Africa/Lagos",
                          })}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => handleDownloadFile(notification)}
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-xs"
                          >
                            <FileText size={14} />
                            <span>View/Download</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedResultId(notification.resultId);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-xs"
                          >
                            <Eye size={14} />
                            <span>Review</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                )}
              </div>
            )}
            {showModal && selectedResultId && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded w-1/2">
                  <h3 className="text-lg font-semibold mb-4">Approve Result</h3>
                  <ApproveResultForm
                    resultId={selectedResultId}
                    onDone={() => {
                      setShowModal(false);
                      setSelectedResultId(null);
                      // Refresh results after approval
                      window.location.reload();
                    }}
                  />
                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 px-3 py-1 bg-gray-500 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3065B5]">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage patient test requests and review results
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {pendingRequests}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned Tests</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {assignedTests}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Awaiting Results</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {awaitingResults}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <TestTube size={20} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">For Approval</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {forApproval}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <FileCheck size={20} className="text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-8 pr-6 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="lab-completed">Lab Completed</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Today's Appointments Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-3 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar size={18} className="mr-2" />
              Today's Appointments ({todayAppointments.length}) -{" "}
              {new Date().toLocaleDateString("en-NG", {
                timeZone: "Africa/Lagos",
              })}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing appointments for Dr. {user.name || "Unknown"} ID: {user.id}
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => {
                const patient = patients.find(
                  (p) => p.id === appointment.patientId
                );
                return (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    patient={patient}
                    onReschedule={() => handleReschedule(appointment)}
                    onApprove={() => handleApprove(appointment)}
                    onViewResults={() => handleViewResults(appointment)}
                    isToday={true}
                  />
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* All Patient Test Requests */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-3 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Patient Test Requests ({filteredAppointments.length})
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Total appointments for this doctor: {doctorAppointments.length}
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => {
                const patient = patients.find(
                  (p) => p.id === appointment.patientId
                );
                return (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    patient={patient}
                    onReschedule={() => handleReschedule(appointment)}
                    onApprove={() => handleApprove(appointment)}
                    onViewResults={() => handleViewResults(appointment)}
                    isToday={false}
                  />
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p>No patient requests found</p>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showRescheduleModal && selectedAppointment && (
          <RescheduleModal
            appointment={selectedAppointment}
            patient={patients.find(
              (p) => p.id === selectedAppointment.patientId
            )}
            onClose={() => {
              setShowRescheduleModal(false);
              setSelectedAppointment(null);
            }}
            onSubmit={submitReschedule}
          />
        )}

        {showApprovalModal && selectedAppointment && (
          <ApprovalModal
            appointment={selectedAppointment}
            patient={patients.find(
              (p) => p.id === selectedAppointment.patientId
            )}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedAppointment(null);
            }}
            onApprove={approveAndForwardToLab}
          />
        )}

        {showResultsModal && selectedAppointment && (
          <ResultModal
            appointment={selectedAppointment}
            patient={patients.find(
              (p) => p.id === selectedAppointment.patientId
            )}
            onClose={() => {
              setShowResultsModal(false);
              setSelectedAppointment(null);
            }}
            onApprove={approveResults}
            onReject={rejectResults}
            isLoading={isLoadingResults}
          />
        )}
      </div>
    </Layout>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  patient: any;
  onReschedule: () => void;
  onApprove: () => void;
  onViewResults: () => void;
  isToday: boolean;
}

function AppointmentCard({
  appointment,
  patient,
  onReschedule,
  onApprove,
  onViewResults,
  isToday,
}: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "lab-completed":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Pending Approval";
      case "in-progress":
        return "Lab Processing";
      case "lab-completed":
        return "Results Ready";
      case "completed":
        return "Completed";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <div
      className={`p-3 sm:p-6 hover:bg-gray-50 transition-colors ${
        isToday ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Left Side: Patient Info */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {patient?.name || "Unknown Patient"}
              </h3>
              <span className="text-xs sm:text-sm text-gray-500">
                {patient?.email}
              </span>
              {isToday && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  TODAY
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
              {/* Status Badge */}
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  appointment.status
                )}`}
              >
                {getStatusText(appointment.status)}
              </span>

              <span className="text-xs sm:text-sm text-gray-600">
                Category: {patient?.category?.replace("-", " ") || "Not specified"}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">
                Date: {appointment.date}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">
                Time: {appointment.time}
              </span>
            </div>

            {/* Requested Tests */}
            <div className="mb-2 sm:mb-3">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Requested Tests:
              </p>
              <div className="flex flex-wrap gap-2">
                {appointment.tests.map((test, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                  >
                    {test.name} - ${test.price}
                  </span>
                ))}
              </div>
            </div>

            {/* Reschedule History */}
            {appointment.rescheduleHistory?.length > 0 && (
              <div className="text-xs text-orange-600 mb-2">
                <span className="font-medium">Rescheduled:</span>{" "}
                {
                  appointment.rescheduleHistory[
                    appointment.rescheduleHistory.length - 1
                  ].reason
                }
              </div>
            )}

            {/* Approval Info */}
            {appointment.doctorApproved && (
              <div className="text-xs text-green-600 mb-2">
                <span className="font-medium">✅ Approved for Lab Processing</span>
                {appointment.approvedAt && (
                  <span className="ml-2">
                    on{" "}
                    {new Date(appointment.approvedAt).toLocaleString("en-NG", {
                      timeZone: "Africa/Lagos",
                    })}
                  </span>
                )}
              </div>
            )}

            {/* Rejection Info */}
            {appointment.status === "rejected" && appointment.doctorComments && (
              <div className="text-xs text-red-600 mb-2">
                <span className="font-medium">Rejected:</span>{" "}
                {appointment.doctorComments}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onReschedule}
            className="px-2 sm:px-3 py-1 sm:py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1 text-xs sm:text-sm"
            title="Reschedule Appointment"
          >
            <RefreshCw size={16} />
            <span>Reschedule</span>
          </button>

          {appointment.status === "scheduled" && (
            <button
              onClick={onApprove}
              className="px-2 sm:px-3 py-1 sm:py-2 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              title="Approve & Forward to Lab"
            >
              <CheckCircle size={16} />
              <span>Approve</span>
            </button>
          )}

          {appointment.status === "lab-completed" && (
            <button
              onClick={onViewResults}
              className="px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              title="View Results"
            >
              <Eye size={16} />
              <span>View Results</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


interface RescheduleModalProps {
  appointment: Appointment;
  patient: any;
  onClose: () => void;
  onSubmit: (newDate: string, newTime: string, reason: string) => void;
}

function RescheduleModal({
  appointment,
  patient,
  onClose,
  onSubmit,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);
  const [reason, setReason] = useState("");

  const availableTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newDate, newTime, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Reschedule Appointment
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Patient: {patient?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Date & Time
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {appointment.date} at {appointment.time}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Time
            </label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            >
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Reschedule
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rescheduling..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ApprovalModalProps {
  appointment: Appointment;
  patient: any;
  onClose: () => void;
  onApprove: (labTechnicianId?: string) => void;
}

function ApprovalModal({
  appointment,
  patient,
  onClose,
  onApprove,
}: ApprovalModalProps) {
  const [selectedLabTech, setSelectedLabTech] = useState("");
  const [notes, setNotes] = useState("");

  const labTechnicians = [
    { id: "tech1", name: "James Brown", specialty: "General Lab" },
    { id: "tech2", name: "Lisa Johnson", specialty: "Blood Analysis" },
    { id: "tech3", name: "Mark Wilson", specialty: "Radiology" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(selectedLabTech || undefined);
  };

  const totalPrice = appointment.tests.reduce(
    (sum: number, test: any) => sum + test.price,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Approve & Forward to Lab
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Patient: {patient?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Test Details</h4>
            <div className="space-y-2">
              {appointment.tests.map((test, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-blue-800">{test.name}</span>
                  <span className="font-medium text-blue-900">
                    ${test.price}
                  </span>
                </div>
              ))}
              <div className="border-t border-blue-200 pt-2 flex justify-between items-center font-semibold">
                <span className="text-blue-900">Total</span>
                <span className="text-blue-900">${totalPrice}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Lab Technician (Optional)
            </label>
            <select
              value={selectedLabTech}
              onChange={(e) => setSelectedLabTech(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Auto-assign to available technician</option>
              {labTechnicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes for Lab (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions for the lab..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={3}
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">
                By approving, you confirm the test requests are accurate and ready for lab processing.
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm"
            >
              <Send size={16} />
              <span>Approve & Forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorDashboard;