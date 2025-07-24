import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppointments } from '../contexts/AppointmentContext';
//import { useAuth } from '../contexts/AuthContext';
//import { useNotifications } from '../contexts/NotificationContext';
import { Calendar, UserPlus, Search, Clock, Users, User, Eye, Plus, Mail, Phone } from 'lucide-react';
import ExistingPatientBooking from '../components/ExistingPatientBooking';

function FrontDeskDashboard() {
  const navigate = useNavigate();
  const { appointments, patients, getPatientsByFrontDesk, getAppointmentsByFrontDesk } = useAppointments();
  //const { user } = useAuth();
 // const { notifications } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const today = new Date().toISOString().split('T')[0];
  
  // Get data specific to logged-in front desk user
  const myPatients =  getPatientsByFrontDesk("87678") 
  const myAppointments =  getAppointmentsByFrontDesk("987656789")
  const todayAppointments = myAppointments.filter(apt => apt.date === today);
  const todayRegistrations = myPatients.filter(patient => 
    patient.registrationDate && 
    new Date(patient.registrationDate).toDateString() === new Date().toDateString()
  );
  
  const filteredPatients = myPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const pendingTests = myAppointments.filter(apt => apt.status === 'scheduled').length;

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedPatient(null);
  };

  return (
    <Layout title="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Front Desk Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome, uytryu iouytryu - oiuytretyu
            </p>
          </div>
          <button
            onClick={() => navigate('/front-desk/register-patient')}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={20} />
            <span>Register New Patient</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Patients</p>
                <p className="text-3xl font-bold text-gray-900">{myPatients.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Registrations</p>
                <p className="text-3xl font-bold text-gray-900">{todayRegistrations.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <UserPlus size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Today's Requests</p>
                <p className="text-3xl font-bold text-gray-900">{todayAppointments.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Pending Tests</p>
                <p className="text-3xl font-bold text-gray-900">{pendingTests}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Directory */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Patient Directory</h2>
              <p className="text-sm text-gray-500 mt-1">Patients registered by iouytryui</p>
            </div>
            <div className="p-6">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Patient List */}
              <div className="max-h-80 overflow-y-auto space-y-3">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{patient.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Mail size={14} />
                                <span>{patient.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone size={14} />
                                <span>{patient.phone}</span>
                              </div>
                            </div>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 mt-1">
                              {patient.category?.replace('-', ' ')}
                            </span>
                            {patient.registrationDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Registered: {new Date(patient.registrationDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handlePatientSelect(patient)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Book Appointment"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No patients found matching your search' : 'No registered patients found'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Today's Test Requests */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">My Today's Test Requests</h2>
              <p className="text-sm text-gray-500 mt-1">Appointments from my registered patients</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{patient?.name || 'Unknown Patient'}</h4>
                          <p className="text-sm text-gray-600">
                            {appointment.tests.length} test{appointment.tests.length !== 1 ? 's' : ''} requested
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status === 'scheduled' ? 'Pending' : appointment.status}
                            </span>
                            <span className="text-xs text-gray-500">{appointment.time}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">#{appointment.id.slice(-4)}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <p>No test requests for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UserPlus size={24} className="text-blue-600" />
              </div>
              <h3 className="font-medium text-blue-900 mb-2">Register New Patient</h3>
              <p className="text-sm text-blue-600 mb-4">Add a new patient and request tests</p>
              <button
                onClick={() => navigate('/front-desk/register-patient')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register Patient
              </button>
            </div>

            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-green-600" />
              </div>
              <h3 className="font-medium text-green-900 mb-2">Find Patient</h3>
              <p className="text-sm text-green-600 mb-4">Search existing patient records</p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Find Patient
              </button>
            </div>

            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <h3 className="font-medium text-purple-900 mb-2">Schedule Appointment</h3>
              <p className="text-sm text-purple-600 mb-4">Book follow-up appointments</p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ExistingPatientBooking 
              onClose={handleCloseModal}
              preSelectedPatient={selectedPatient}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default FrontDeskDashboard;