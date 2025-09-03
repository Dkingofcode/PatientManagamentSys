import React, { useState } from 'react';
import Layout from '../components/Layout';
//mport { useAuth } from '../contexts/AuthContext';

import { useAppointments } from '../contexts/AppointmentContext';
// import { useNotifications } from '../contexts/NotificationContext';
import { Clock, Users, TestTube, FileCheck, Search, Filter, User, Calendar, RefreshCw, CheckCircle, X, Eye, Send, AlertCircle, FileText, FileSignature as Signature } from 'lucide-react';

function DoctorDashboard() {
 // const { user } = useAuth();
  const { appointments, patients, updateAppointment, rescheduleAppointment } = useAppointments();
 // const { addNotification } = useNotifications();
  
  console.log('Doctor Dashboard - User:',);
  console.log('Doctor Dashboard - All Appointments:', appointments);
  console.log('Doctor Dashboard - All Patients:', patients);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  console.log('Today\'s date:', today);

  // Filter appointments for the logged-in doctor
  const doctorAppointments = appointments.filter(appointment => appointment.doctorId === "8765");
  console.log('Doctor Appointments:', doctorAppointments);
  
  // Today's appointments
  const todayAppointments = doctorAppointments.filter(appointment => appointment.date === today);
  console.log('Today\'s Appointments:', todayAppointments);
  
  // Filter appointments based on search and status
  const filteredAppointments = doctorAppointments.filter(appointment => {
    const patient = patients.find(p => p.id === appointment.patientId);
    const matchesSearch = !searchTerm || 
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const pendingRequests = doctorAppointments.filter(apt => apt.status === 'scheduled' && !apt.doctorApproved).length;
  const assignedTests = doctorAppointments.filter(apt => apt.status === 'in-progress').length;
  const awaitingResults = doctorAppointments.filter(apt => apt.status === 'lab-completed').length;
  const forApproval = doctorAppointments.filter(apt => apt.status === 'scheduled' && !apt.doctorApproved).length;

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleApprove = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowApprovalModal(true);
  };

  const handleViewResults = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowResultsModal(true);
  };

  const submitReschedule = (newDate: string, newTime: string, reason: string) => {
    if (selectedAppointment) {
   //   const patient = patients.find(p => p.id === selectedAppointment.patientId);
      
      rescheduleAppointment(selectedAppointment.id, newDate, newTime, reason);
      
      // addNotification({
      //   title: 'Appointment Rescheduled',
      //   message: `Appointment for ${patient?.name} has been rescheduled from ${selectedAppointment.date} ${selectedAppointment.time} to ${newDate} at ${newTime}`,
      //   type: 'info',
      // });
      
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
    }
  };

  const approveAndForwardToLab = (labTechnicianId?: string) => {
    if (selectedAppointment) {
      //const patient = patients.find(p => p.id === selectedAppointment.patientId);
      
      updateAppointment(selectedAppointment.id, {
        doctorApproved: true,
        labAssigned: true,
        status: 'in-progress',
        assignedLabTech: labTechnicianId,
        approvedAt: new Date().toISOString()
      });
      
      // addNotification({
      //   title: 'Tests Approved & Forwarded to Lab',
      //   message: `Tests for ${patient?.name} (${selectedAppointment.tests.map((t: any) => t.name).join(', ')}) have been approved and forwarded to lab technicians`,
      //   type: 'success',
      // });
      
      setShowApprovalModal(false);
      setSelectedAppointment(null);
    }
  };

  const approveResults = (signature: string, comments: string) => {
    if (selectedAppointment) {
     // const patient = patients.find(p => p.id === selectedAppointment.patientId);
      
      updateAppointment(selectedAppointment.id, {
        status: 'completed',
        doctorSignature: signature,
        doctorComments: comments,
        finalizedAt: new Date().toISOString()
      });
      
      // addNotification({
      //   title: 'Results Approved & Sent to Patient',
      //   message: `Test results for ${patient?.name} have been approved and securely sent to patient portal with 2FA protection`,
      //   type: 'success',
      // });
      
      setShowResultsModal(false);
      setSelectedAppointment(null);
    }
  };

  return (
    <Layout title="">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage patient test requests and review results</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900">{pendingRequests}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned Tests</p>
                <p className="text-3xl font-bold text-gray-900">{assignedTests}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Awaiting Results</p>
                <p className="text-3xl font-bold text-gray-900">{awaitingResults}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <TestTube size={24} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">For Approval</p>
                <p className="text-3xl font-bold text-gray-900">{forApproval}</p>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <FileCheck size={24} className="text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="lab-completed">Lab Completed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Today's Appointments Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar size={20} className="mr-2" />
              Today's Appointments ({todayAppointments.length}) - {today}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing appointments for Dr. Trerty ID: 8765 
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                console.log('Rendering appointment:', appointment.id, 'Patient:', patient);
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
          <div className="p-6 border-b border-gray-200">
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
                const patient = patients.find(p => p.id === appointment.patientId);
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
            patient={patients.find(p => p.id === selectedAppointment.patientId)}
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
            patient={patients.find(p => p.id === selectedAppointment.patientId)}
            onClose={() => {
              setShowApprovalModal(false);
              setSelectedAppointment(null);
            }}
            onApprove={approveAndForwardToLab}
          />
        )}

        {showResultsModal && selectedAppointment && (
          <ResultsReviewModal
            appointment={selectedAppointment}
            patient={patients.find(p => p.id === selectedAppointment.patientId)}
            onClose={() => {
              setShowResultsModal(false);
              setSelectedAppointment(null);
            }}
            onApprove={approveResults}
          />
        )}
      </div>
    </Layout>
  );
}

interface AppointmentCardProps {
  appointment: any;
  patient: any;
  onReschedule: () => void;
  onApprove: () => void;
  onViewResults: () => void;
  isToday: boolean;
}

function AppointmentCard({ appointment, patient, onReschedule, onApprove, onViewResults, isToday }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'lab-completed': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Pending Approval';
      case 'in-progress': return 'Lab Processing';
      case 'lab-completed': return 'Results Ready';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className={`p-6 hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900">{patient?.name || 'Unknown Patient'}</h3>
              <span className="text-sm text-gray-500">{patient?.email}</span>
              {isToday && <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">TODAY</span>}
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
              <span className="text-sm text-gray-600">Category: {patient?.category?.replace('-', ' ')}</span>
              <span className="text-sm text-gray-600">Date: {appointment.date}</span>
              <span className="text-sm text-gray-600">Time: {appointment.time}</span>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Requested Tests:</p>
              <div className="flex flex-wrap gap-2">
                {appointment.tests.map((test: any, index: number) => (
                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                    {test.name} - ${test.price}
                  </span>
                ))}
              </div>
            </div>

            {appointment.rescheduleHistory && appointment.rescheduleHistory.length > 0 && (
              <div className="text-xs text-orange-600 mb-2">
                <span className="font-medium">Rescheduled:</span> {appointment.rescheduleHistory[appointment.rescheduleHistory.length - 1].reason}
              </div>
            )}

            {appointment.doctorApproved && (
              <div className="text-xs text-green-600 mb-2">
                <span className="font-medium">✅ Approved for Lab Processing</span>
                {appointment.approvedAt && (
                  <span className="ml-2">on {new Date(appointment.approvedAt).toLocaleString()}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onReschedule}
            className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1"
            title="Reschedule Appointment"
          >
            <RefreshCw size={16} />
            <span className="text-sm">Reschedule</span>
          </button>
          
          {!appointment.doctorApproved ? (
            <button
              onClick={onApprove}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              title="Approve & Forward to Lab"
            >
              <CheckCircle size={16} />
              <span>Approve & Forward</span>
            </button>
          ) : appointment.status === 'lab-completed' ? (
            <button
              onClick={onViewResults}
              className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
              title="Review & Approve Results"
            >
              <Eye size={16} />
              <span>Review Results</span>
            </button>
          ) : (
            <div className="flex items-center text-green-600" title="Approved for Lab">
              <CheckCircle size={20} />
              <span className="text-xs ml-1">Approved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface RescheduleModalProps {
  appointment: any;
  patient: any;
  onClose: () => void;
  onSubmit: (newDate: string, newTime: string, reason: string) => void;
}

function RescheduleModal({ appointment, patient, onClose, onSubmit }: RescheduleModalProps) {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);
  const [reason, setReason] = useState('');

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newDate, newTime, reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Patient: {patient?.name}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {availableTimes.map(time => (
                <option key={time} value={time}>{time}</option>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
  appointment: any;
  patient: any;
  onClose: () => void;
  onApprove: (labTechnicianId?: string) => void;
}

function ApprovalModal({ appointment, patient, onClose, onApprove }: ApprovalModalProps) {
  const [selectedLabTech, setSelectedLabTech] = useState('');
  const [notes, setNotes] = useState('');

  const labTechnicians = [
    { id: '4', name: 'James Brown', specialty: 'General Lab' },
    { id: '9', name: 'Lisa Johnson', specialty: 'Blood Analysis' },
    { id: '10', name: 'Mark Wilson', specialty: 'Radiology' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(selectedLabTech || undefined);
  };

  const totalPrice = appointment.tests.reduce((sum: number, test: any) => sum + test.price, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Approve & Forward to Lab</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Patient: {patient?.name}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Test Details</h4>
            <div className="space-y-2">
              {appointment.tests.map((test: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-blue-800">{test.name}</span>
                  <span className="font-medium text-blue-900">${test.price}</span>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Auto-assign to available technician</option>
              {labTechnicians.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name} - {tech.specialty}</option>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
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

interface ResultsReviewModalProps {
  appointment: any;
  patient: any;
  onClose: () => void;
  onApprove: (signature: string, comments: string) => void;
}

function ResultsReviewModal({ appointment, patient, onClose, onApprove }: ResultsReviewModalProps) {
  const [signature, setSignature] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(signature, comments);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Review & Approve Lab Results</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Patient: {patient?.name}</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Lab Results Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText size={16} className="mr-2" />
              Lab Results
            </h4>
            <div className="space-y-3">
              {appointment.tests.map((test: any, index: number) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <h5 className="font-medium text-gray-900">{test.name}</h5>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Status:</strong> Completed</p>
                    <p><strong>Result:</strong> Normal ranges detected</p>
                    <p><strong>Lab Tech:</strong> James Brown</p>
                    <p><strong>Completed:</strong> {new Date().toLocaleString()}</p>
                  </div>
                  <div className="mt-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                      <FileText size={14} />
                      <span>View Detailed Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor's Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your professional comments about the results..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Signature
              </label>
              <div className="flex items-center space-x-3">
                <Signature size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type your full name as digital signature"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                By typing your name, you digitally sign and approve these results
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">
                  Results will be securely sent to patient portal with 2FA protection
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle size={16} />
                <span>Approve & Send to Patient</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ); 
}

export default DoctorDashboard;
