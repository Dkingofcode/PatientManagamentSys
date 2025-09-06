//import React from 'react';
import type { RegistrationData } from '../../pages/PatientRegistration';
import { useAppointments } from '../../contexts/AppointmentContext';
import { CheckCircle, User, Calendar, Clock, FileText, ArrowLeft, Download, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RegistrationSuccessProps {
  patientId: string;
  appointmentId: string;
  registrationData: Partial<RegistrationData>;
  onBackToDashboard: () => void;
}

// ✅ Helper to safely parse prices
const parsePrice = (value: any): number => {
  if (!value) return 0;
  return Number(String(value).replace(/[₦,]/g, "")) || 0;
};

function RegistrationSuccess({ 
  patientId, 
  appointmentId, 
  registrationData, 
}: RegistrationSuccessProps) {
  const { doctors } = useAppointments();
  const navigate = useNavigate();
  const selectedDoctor = doctors.find(d => d.id === registrationData.doctorId);

  // ✅ Safe total calculation
  const totalPrice = registrationData.tests?.reduce((sum, test) => {
    return sum + parsePrice(test.price);
  }, 0) || 0;

  const generateQRCode = () => {
    alert(`QR Code generated for Patient ID: ${patientId}`);
  };

  const downloadSummary = () => {
    alert('Registration summary downloaded!');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6">
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-full p-3 mr-4">
            <CheckCircle size={32} className="text-blue-500" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Registration Successful!</h1>
            <p className="text-green-100 mt-1">Patient has been registered and appointment scheduled</p>
          </div>
        </div>
      </div>

      {/* Patient ID Card */}
      <div className="p-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Patient ID Generated</h2>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-mono text-lg font-bold">
                  {patientId}
                </div>
                <button
                  onClick={generateQRCode}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <QrCode size={16} />
                  <span className="text-sm">Generate QR</span>
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Appointment ID</p>
              <p className="font-mono font-semibold text-gray-900">{appointmentId}</p>
            </div>
          </div>
        </div>

        {/* Registration Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <User size={20} className="mr-2" />
              Patient Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{registrationData.patientInfo?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{registrationData.patientInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{registrationData.patientInfo?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {registrationData.category?.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <Calendar size={20} className="mr-2" />
              Appointment Details
            </h3>
            <div className="space-y-3">
              {registrationData.doctorId ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium text-gray-900">{selectedDoctor?.name ?? 'Not assigned'}</p>
                    <p className="text-sm text-gray-500">{selectedDoctor?.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {registrationData.appointmentDate && 
                          new Date(registrationData.appointmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">{registrationData.appointmentTime}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">Direct lab tests - No doctor appointment required</p>
              )}
            </div>
          </div>
        </div>

        {/* Tests Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <FileText size={20} className="mr-2" />
            Scheduled Tests
          </h3>
          <div className="space-y-3">
            {registrationData.tests?.map((test, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{test.name}</p>
                  <p className="text-sm text-gray-500">{test.duration} minutes</p>
                </div>
                <div className="text-right">
                  {/* ✅ Safe price display */}
                  <p className="font-semibold text-gray-900">
                    ₦{parsePrice(test.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-gray-300">
              <p className="text-lg font-semibold text-gray-900">Total Amount</p>
              <p className="text-xl font-bold text-purple-700">
                ₦{totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Patient will receive email confirmation with appointment details
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Arrive 15 minutes before scheduled appointment time
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Bring valid ID and insurance information if applicable
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Test results will be available through patient portal
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/front-desk")}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          
          <button
            onClick={downloadSummary}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            <span>Download Summary</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
          >
            <FileText size={20} />
            <span>Print Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationSuccess;