import React, { useState } from 'react';
import { useAppointments } from '../contexts/AppointmentContext';
// import { useNotifications } from '../contexts/NotificationContext';
import { Search, User, Calendar, Clock, FileText, CheckCircle, CreditCard, Banknote, ArrowLeftRight, Calculator } from 'lucide-react';
import TestSelectionStep from './registration/TestSelectionStep';
import DoctorSelectionStep from './registration/DoctorSelectionStep';

interface ExistingPatientBookingProps {
  onClose: () => void;
  preSelectedPatient?: any;
}

function ExistingPatientBooking({ onClose, preSelectedPatient }: ExistingPatientBookingProps) {
  const { patients, addAppointment, doctors, getTestPrice, getDiscountPercent } = useAppointments();
 // const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<any>(preSelectedPatient || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingData, setBookingData] = useState<any>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['cash']);
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: number }>({});
  const [creditAmount, setCreditAmount] = useState(0);

  // If a patient is pre-selected, skip to step 2
  React.useEffect(() => {
    if (preSelectedPatient) {
      setCurrentStep(2);
    }
  }, [preSelectedPatient]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const updateBookingData = (data: any) => {
    setBookingData((prev: any) => ({ ...prev, ...data }));
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setCurrentStep(2);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Payment method options
  const paymentOptions = [
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-500' },
    { id: 'pos', label: 'POS/Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'transfer', label: 'Bank Transfer', icon: ArrowLeftRight, color: 'bg-purple-500' },
    { id: 'cash-transfer', label: 'Cash + Transfer', icon: ArrowLeftRight, color: 'bg-indigo-500' },
    { id: 'pos-transfer', label: 'POS + Transfer', icon: CreditCard, color: 'bg-cyan-500' },
    { id: 'pos-cash', label: 'POS + Cash', icon: Banknote, color: 'bg-teal-500' },
    { id: 'credit', label: 'Credit', icon: Calculator, color: 'bg-orange-500' },
  ];

  const handlePaymentMethodToggle = (methodId: string) => {
    if (methodId === 'credit') {
      setCreditAmount(creditAmount > 0 ? 0 : getTotalAmount() - getTotalPaid());
    } else {
      if (methodId.includes('-')) {
        const methods = methodId.split('-');
        setPaymentMethods(methods);
        const splitAmount = getTotalAmount() / methods.length;
        const newAmounts: { [key: string]: number } = {};
        methods.forEach(method => {
          newAmounts[method] = splitAmount;
        });
        setPaymentAmounts(newAmounts);
      } else {
        setPaymentMethods([methodId]);
        setPaymentAmounts({ [methodId]: getTotalAmount() });
      }
    }
  };

  const handleAmountChange = (methodId: string, amount: number) => {
    setPaymentAmounts(prev => ({ ...prev, [methodId]: amount }));
  };

  const getCurrentTestPrice = (test: any) => {
    const category = selectedPatient?.category || 'walk-in';
    return getTestPrice(test.id, category);
  };

  const getTotalAmount = () => {
    if (!bookingData.tests) return 0;
    const subtotal = bookingData.tests.reduce((sum: number, test: any) => sum + getCurrentTestPrice(test), 0);
    const discountPercent = getDiscountPercent(selectedPatient?.category || 'walk-in');
    const discountAmount = subtotal * (discountPercent / 100);
    return subtotal - discountAmount;
  };

  const getTotalPaid = () => {
    return Object.values(paymentAmounts).reduce((sum, amount) => sum + amount, 0);
  };

  const completeBooking = () => {
    if (selectedPatient && bookingData.doctorId && bookingData.tests) {
      const newAppointmentId = `APT-${String(Date.now()).slice(-5)}`;
      
      const paymentInfo = {
        methods: paymentMethods,
        amounts: paymentAmounts,
        totalPaid: getTotalPaid(),
        totalAmount: getTotalAmount(),
        creditAmount,
        processedAt: new Date().toISOString()
      };

      const appointment = {
        id: newAppointmentId,
        patientId: selectedPatient.id,
        doctorId: bookingData.doctorId,
        date: bookingData.appointmentDate,
        time: bookingData.appointmentTime,
        tests: bookingData.tests,
        status: 'scheduled' as const,
        doctorApproved: false,
        labAssigned: false,
        paymentInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Creating appointment for existing patient:', appointment);
      addAppointment(appointment);

      // addNotification({
      //   title: 'Appointment Scheduled',
      //   message: `New appointment scheduled for ${selectedPatient.name} on ${bookingData.appointmentDate} at ${bookingData.appointmentTime}. Awaiting doctor approval for lab processing.`,
      //   type: 'success',
      // });

      setAppointmentId(newAppointmentId);
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    const selectedDoctor = doctors.find(d => d.id === bookingData.doctorId);
    const totalPrice = getTotalAmount();

    return (
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Scheduled Successfully!</h3>
          <p className="text-gray-600">The appointment has been added to the system</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Appointment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Patient</p>
              <p className="font-medium text-gray-900">{selectedPatient.name}</p>
              <p className="text-sm text-gray-500">{selectedPatient.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Appointment ID</p>
              <p className="font-mono font-semibold text-blue-600">{appointmentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Doctor</p>
              <p className="font-medium text-gray-900">{selectedDoctor?.name}</p>
              <p className="text-sm text-gray-500">{selectedDoctor?.specialty}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-medium text-gray-900">
                {new Date(bookingData.appointmentDate).toLocaleDateString()} at {bookingData.appointmentTime}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Tests</p>
            <div className="space-y-1">
              {bookingData.tests?.map((test: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-900">{test.name}</span>
                  <span className="font-medium">${getCurrentTestPrice(test)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-green-600">${totalPrice}</span>
            </div>
            
            {/* Payment Information */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Payment Details</p>
              <div className="space-y-1">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 capitalize">{method.replace('-', ' + ')}</span>
                    <span className="font-medium">${paymentAmounts[method] || 0}</span>
                  </div>
                ))}
                {creditAmount > 0 && (
                  <div className="flex justify-between items-center text-sm text-orange-600">
                    <span>Credit</span>
                    <span className="font-medium">${creditAmount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Exit Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span>×</span>
          <span>Exit</span>
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-12 h-0.5 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-12 h-0.5 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
          <div className={`w-12 h-0.5 ${currentStep > 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            4
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h3>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Patient List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <p className="text-sm text-gray-500">{patient.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {patient.category?.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
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
      )}

      {currentStep === 2 && selectedPatient && (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Selected Patient</h4>
            <p className="text-blue-700">{selectedPatient.name} - {selectedPatient.email}</p>
          </div>
          
          <TestSelectionStep
            data={{ ...bookingData, category: selectedPatient.category }}
            updateData={updateBookingData}
            onNext={nextStep}
            onPrev={prevStep}
            currentStep={currentStep}
          />
        </div>
      )}

      {currentStep === 3 && selectedPatient && (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Selected Patient</h4>
            <p className="text-blue-700">{selectedPatient.name} - {selectedPatient.email}</p>
          </div>
          
          <DoctorSelectionStep
            data={bookingData}
            updateData={updateBookingData}
            onPrev={prevStep}
            onComplete={nextStep}
            currentStep={currentStep}
          />
        </div>
      )}

      {currentStep === 4 && selectedPatient && (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Selected Patient</h4>
            <p className="text-blue-700">{selectedPatient.name} - {selectedPatient.email}</p>
          </div>
          
          {/* Payment Step */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Processing</h3>
            
            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
              <div className="space-y-2">
                {bookingData.tests?.map((test: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{test.name}</span>
                    <div className="flex items-center space-x-2">
                      {getCurrentTestPrice(test) !== test.prices['walk-in'] && (
                        <span className="line-through text-gray-400">${test.prices['walk-in']}</span>
                      )}
                      <span className="font-medium">${getCurrentTestPrice(test)}</span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-bold">
                  <span>Total Amount</span>
                  <span>${getTotalAmount()}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Select Payment Method</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = option.id === 'credit' 
                    ? creditAmount > 0 
                    : paymentMethods.some(method => option.id.includes(method)) || 
                      (option.id.includes('-') && option.id.split('-').every(m => paymentMethods.includes(m)));
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePaymentMethodToggle(option.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${option.color} mb-2`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <span className="text-xs font-medium text-center">{option.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Amount Inputs */}
              {paymentMethods.length > 0 && !paymentMethods.includes('credit') && (
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Enter Payment Amounts</h5>
                  {paymentMethods.map((methodId) => {
                    const method = paymentOptions.find(opt => opt.id === methodId);
                    return (
                      <div key={methodId} className="flex items-center space-x-4">
                        <div className="w-20">
                          <span className="text-sm font-medium text-gray-700">{method?.label}</span>
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            min="0"
                            max={getTotalAmount()}
                            step="0.01"
                            value={paymentAmounts[methodId] || ''}
                            onChange={(e) => handleAmountChange(methodId, parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Credit Amount Input */}
              {creditAmount > 0 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-800">Credit Amount</span>
                    <input
                      type="number"
                      min="0"
                      max={getTotalAmount()}
                      step="0.01"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-orange-300 rounded text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Status */}
            <div className="bg-white border rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Total Due</p>
                  <p className="text-lg font-bold text-gray-900">${getTotalAmount()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="text-lg font-bold text-green-600">${getTotalPaid()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className={`text-lg font-bold ${
                    getTotalAmount() - getTotalPaid() - creditAmount > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ${Math.max(0, getTotalAmount() - getTotalPaid() - creditAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={completeBooking}
                disabled={getTotalPaid() + creditAmount < getTotalAmount()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Complete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExistingPatientBooking;