import  { useState } from 'react';
import type { RegistrationData } from '../../pages/PatientRegistration';
import { useAppointments } from '../../contexts/AppointmentContext';
import { Calendar, Clock } from 'lucide-react';

interface DoctorSelectionStepProps {
  data: Partial<RegistrationData>;
  updateData: (data: Partial<RegistrationData>) => void;
  onPrev: () => void;
  onComplete: () => void;
  currentStep: number;
}

function DoctorSelectionStep({ data, updateData, onPrev, onComplete }: DoctorSelectionStepProps) {
  const { doctors } = useAppointments();
  const [selectedDoctor, setSelectedDoctor] = useState(data.doctorId || '');
  const [selectedDate, setSelectedDate] = useState(data.appointmentDate || '');
  const [selectedTime, setSelectedTime] = useState(data.appointmentTime || '');

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    updateData({ doctorId });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    updateData({ appointmentDate: date });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateData({ appointmentTime: time });
  };

  const handleComplete = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      updateData({
        doctorId: selectedDoctor,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
      });
      onComplete();
    }
  };

  const isCompleteEnabled = selectedDoctor && selectedDate && selectedTime;

  // Get tomorrow as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor & Appointment</h2>
        <p className="text-gray-600">Select a doctor and schedule the appointment</p>
      </div>

      {/* Doctor Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Doctor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => doctor.availability && handleDoctorSelect(doctor.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDoctor === doctor.id
                  ? 'border-blue-500 bg-blue-50'
                  : doctor.availability
                  ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={doctor.profileImage}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                    doctor.availability ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  <div className="flex items-center mt-1">
                    {doctor.availability ? (
                      <span className="text-xs text-green-600 font-medium">🟢 Available</span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">
                        🔴 Next available: {doctor.nextAvailable}
                      </span>
                    )}
                  </div>
                </div>
                {selectedDoctor === doctor.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date and Time Selection */}
      {selectedDoctor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Date Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar size={20} className="mr-2" />
              Select Date
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
              min={minDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock size={20} className="mr-2" />
              Select Time
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    selectedTime === time
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {isCompleteEnabled && (
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">Appointment Summary</h3>
          <div className="space-y-1 text-sm text-green-800">
            <p><strong>Patient:</strong> {data.patientInfo?.name}</p>
            <p><strong>Doctor:</strong> {doctors.find(d => d.id === selectedDoctor)?.name}</p>
            <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Tests:</strong> {data.tests?.map(t => t.name).join(', ')}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleComplete}
          disabled={!isCompleteEnabled}
          className="px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next: Payment
        </button>
      </div>
    </div>
  );
}

export default DoctorSelectionStep;