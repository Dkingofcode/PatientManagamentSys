import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAppointments } from "../contexts/AppointmentContext";
import {
  CalendarDays,
  UserPlus,
  Search,
  Clock,
  Users,
  User,
  Eye,
  Mail,
  Phone,
  X,
} from "lucide-react";
import ExistingPatientBooking from "../components/ExistingPatientBooking";

function FrontDeskDashboard() {
  const navigate = useNavigate();
  const { patients, getAppointmentsByFrontDesk, doctors } = useAppointments();

  const [searchTerm, setSearchTerm] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  const myPatients = useMemo(() => {
    return patients || [];
  }, [patients]);

  const myAppointments = getAppointmentsByFrontDesk("987656789");

  const todayAppointments = myAppointments.filter((apt) => apt.date === today);

  const todayRegistrations = myPatients.filter(
    (patient) =>
      patient.registrationDate &&
      new Date(patient.registrationDate).toDateString() ===
        new Date().toDateString()
  );

  const filteredPatients = myPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone || "").includes(searchTerm)
  );

  const pendingTests = myAppointments.filter(
    (apt) => apt.status === "scheduled"
  ).length;

 // const handlePatientSelect = (patient: any) => {
  //  setSelectedPatient(patient);
  //  setShowBookingModal(true);
  //};

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedPatient(null);
  };

  const handleCloseDetailsModal = () => {
    setShowPatientDetails(false);
    setSelectedPatient(null);
  };

  const handleFindPatientClick = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
      {children}
    </div>
  );

  // Get appointments for the selected patient
  const getPatientAppointments = (patientId: string) => {
    return myAppointments.filter((apt) => apt.patientId === patientId);
  };

  // Get doctor name from doctorId
  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((doc) => doc.id === doctorId);
    return doctor ? doctor.name : "N/A";
  };

  return (
    <Layout title="">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Front Desk Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome</p>
          </div>
          <button
            onClick={() => navigate("/front-desk/register-patient")}
            className="flex items-center space-x-2 px-5 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900 transition-colors"
          >
            <UserPlus size={18} className="text-white" />
            <span>Register New Patient</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">My Patients</p>
              <p className="text-2xl font-semibold text-gray-900">
                {myPatients.length}
              </p>
            </div>
            <IconWrapper>
              <Users size={25} className="text-gray-600" />
            </IconWrapper>
          </div>
          <div className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Today's Registrations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {todayRegistrations.length}
              </p>
            </div>
            <IconWrapper>
              <UserPlus size={25} className="text-gray-600" />
            </IconWrapper>
          </div>
          <div className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Today's Requests</p>
              <p className="text-2xl font-semibold text-gray-900">
                {todayAppointments.length}
              </p>
            </div>
            <IconWrapper>
              <CalendarDays size={25} className="text-gray-600" />
            </IconWrapper>
          </div>
          <div className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Pending Tests</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pendingTests}
              </p>
            </div>
            <IconWrapper>
              <Clock size={25} className="text-gray-600" />
            </IconWrapper>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                My Patient Directory
              </h2>
              <p className="text-sm text-gray-500">
                Patients registered by iouytryu
              </p>
            </div>
            <div className="p-5">
              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="max-h-80 overflow-y-auto space-y-3">
                {filteredPatients.length ? (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <IconWrapper>
                          <User size={18} className="text-gray-600" />
                        </IconWrapper>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {patient.name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Mail size={14} />
                              <span>{patient.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone size={14} />
                              <span>{patient.phone}</span>
                            </div>
                          </div>
                          {patient.category && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                              {patient.category.replace("-", " ")}
                            </span>
                          )}
                          {patient.registrationDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Registered:{" "}
                              {new Date(
                                patient.registrationDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? "No patients found" : "No registered patients"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Today's Test Requests
              </h2>
              <p className="text-sm text-gray-500">
                Appointments from your patients
              </p>
            </div>
            <div className="p-5 space-y-4">
              {todayAppointments.length ? (
                todayAppointments.map((appointment) => {
                  const patient = patients.find(
                    (p) => p.id === appointment.patientId
                  );
                  return (
                    <div
                      key={appointment.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-md"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {patient?.name || "Unknown"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {appointment.tests.length} test
                          {appointment.tests.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex items-center space-x-2 text-xs mt-1">
                          <span
                            className={`px-2 py-1 rounded-full ${
                              appointment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {appointment.status === "scheduled"
                              ? "Pending"
                              : appointment.status}
                          </span>
                          <span className="text-gray-500">
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        #{appointment.id.slice(-4)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays
                    size={40}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <p>No test requests for today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 text-center border-2 border-dashed border-gray-200 rounded-md hover:border-gray-300">
              <IconWrapper>
                <UserPlus size={20} className="text-gray-600" />
              </IconWrapper>
              <h3 className="mt-3 font-medium text-gray-900">
                Register Patient
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Add a new patient and request tests
              </p>
              <button
                onClick={() => navigate("/front-desk/register-patient")}
                className="mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900"
              >
                Register
              </button>
            </div>

            <div className="p-5 text-center border-2 border-dashed border-gray-200 rounded-md hover:border-gray-300">
              <IconWrapper>
                <Search size={20} className="text-gray-600" />
              </IconWrapper>
              <h3 className="mt-3 font-medium text-gray-900">Find Patient</h3>
              <p className="text-sm text-gray-600 mt-1">Search records</p>
              <button
                onClick={handleFindPatientClick}
                className="mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900"
              >
                Find
              </button>
            </div>

            <div className="p-5 text-center border-2 border-dashed border-gray-200 rounded-md hover:border-gray-300">
              <IconWrapper>
                <CalendarDays size={20} className="text-gray-600" />
              </IconWrapper>
              <h3 className="mt-3 font-medium text-gray-900">
                Schedule Appointment
              </h3>
              <p className="text-sm text-gray-600 mt-1">Book follow-up tests</p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-50 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <ExistingPatientBooking
              onClose={handleCloseModal}
              preSelectedPatient={selectedPatient}
              selectedTests={[]}
              onTestSelect={() => {}}
            />
          </div>
        </div>
      )}

      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-50 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseDetailsModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Patient Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-gray-900 font-medium">{selectedPatient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900">{selectedPatient.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900">{selectedPatient.phone || "N/A"}</p>
              </div>
              {selectedPatient.category && (
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-gray-900">{selectedPatient.category.replace("-", " ")}</p>
                </div>
              )}
              {selectedPatient.registrationDate && (
                <div>
                  <p className="text-sm text-gray-600">Registration Date</p>
                  <p className="text-gray-900">
                    {new Date(selectedPatient.registrationDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {/* <div>
                <p className="text-sm text-gray-600">Tests Taken</p>
                {getPatientAppointments(selectedPatient.id).length > 0 ? (
                  <ul className="text-gray-900 list-disc pl-5">
                    {getPatientAppointments(selectedPatient.id).flatMap((apt) =>
                      apt.tests.map((test: any, index: number) => (
                        <li key={`${apt.id}-test-${index}`}>
                          {test.name} (Date: {new Date(apt.date).toLocaleDateString()})
                        </li>
                      ))
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-900">No tests taken</p>
                )}
              </div> */}
              <div>
                <p className="text-sm text-gray-600">Assigned Doctor</p>
                {getPatientAppointments(selectedPatient.id).length > 0 ? (
                  <p className="text-gray-900">
                    {getDoctorName(getPatientAppointments(selectedPatient.id)[0].doctorId)}
                  </p>
                ) : (
                  <p className="text-gray-900">No doctor assigned</p>
                )}
              </div>
              {/* <button
                onClick={() => {
                  handleCloseDetailsModal();
                  handlePatientSelect(selectedPatient);
                }}
                className="w-full mt-4 px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900"
              >
                Book Appointment
              </button> */}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default FrontDeskDashboard;