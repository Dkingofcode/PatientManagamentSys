import React, { useState } from 'react';
import { useAppointments } from '../contexts/AppointmentContext';
import { Search, User, CheckCircle, CreditCard, Banknote, ArrowLeftRight, Calculator, Receipt, Printer } from 'lucide-react';
import ServiceSelectionStep from './registration/ServiceSelectionStep';
import TestSelectionStep from './registration/TestSelectionStep';
import DoctorSelectionStep from './registration/DoctorSelectionStep';

interface ExistingPatientBookingProps {
  onClose: () => void;
  preSelectedPatient?: any;
}

interface PatientWithTimestamp {
  id: string;
  name: string;
  email: string;
  phone: string;
  timestamp: string;
}

interface CategoryWithTimestamp {
  id: string;
  name: string;
  discount: number;
  timestamp: string;
}

function ExistingPatientBooking({ onClose, preSelectedPatient }: ExistingPatientBookingProps) {
  const { patients, addAppointment, doctors, getDiscountPercent } = useAppointments();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithTimestamp | null>(
    preSelectedPatient ? { 
      ...preSelectedPatient, 
      timestamp: new Date().toISOString() 
    } : null
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithTimestamp | null>(null);
  const [bookingData, setBookingData] = useState<any>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: number }>({});
  const [creditAmount, setCreditAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // If pre-selected patient, skip to step 2
  React.useEffect(() => {
    if (preSelectedPatient) {
      setCurrentStep(2);
    }
  }, [preSelectedPatient]);

  const updateBookingData = (data: any) => {
    setBookingData((prev: any) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.phone || '').includes(searchTerm)
  );

  const categoryOptions = [
    { id: 'walk-in', name: 'Walk-in', description: 'Patient without appointment', discount: 0 },
    { id: 'referred', name: 'Referred', description: 'Referred by another patient', discount: 10 },
    { id: 'hospital', name: 'Hospital', description: 'Hospital patient', discount: 20 },
    { id: 'hmo', name: 'HMO', description: 'Health Maintenance Organization', discount: 30 },
    { id: 'corporate', name: 'Corporate', description: 'Corporate employee', discount: 50 },
  ];

  const paymentOptions = [
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-500', borderColor: 'border-green-500', bgColor: 'bg-green-50' },
    { id: 'pos', label: 'POS/Card', icon: CreditCard, color: 'bg-blue-500', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
    { id: 'transfer', label: 'Bank Transfer', icon: ArrowLeftRight, color: 'bg-purple-500', borderColor: 'border-purple-500', bgColor: 'bg-purple-50' },
    { id: 'cash-transfer', label: 'Cash + Transfer', icon: ArrowLeftRight, color: 'bg-indigo-500', borderColor: 'border-indigo-500', bgColor: 'bg-indigo-50' },
    { id: 'pos-transfer', label: 'POS + Transfer', icon: CreditCard, color: 'bg-cyan-500', borderColor: 'border-cyan-500', bgColor: 'bg-cyan-50' },
    { id: 'pos-cash', label: 'POS + Cash', icon: Banknote, color: 'bg-teal-500', borderColor: 'border-teal-500', bgColor: 'bg-teal-50' },
    { id: 'credit', label: 'Credit', icon: Calculator, color: 'bg-orange-500', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
  ];

  const togglePatient = (patient: any) => {
    const timestamp = new Date().toISOString();
    setSelectedPatient({ ...patient, timestamp });
  };

  const toggleCategory = (category: any) => {
    const timestamp = new Date().toISOString();
    setSelectedCategory({ ...category, timestamp });
  };

  const handlePatientNext = () => {
    if (selectedPatient) {
      updateBookingData({ patient: selectedPatient });
      nextStep();
    }
  };

  const handleCategoryNext = () => {
    if (selectedCategory) {
      updateBookingData({ category: selectedCategory });
      nextStep();
    }
  };

  const getCurrentTestPrice = (test: any) => {
    return test.price || 0;
  };

  const getTotalAmount = () => {
    if (!bookingData.tests || !Array.isArray(bookingData.tests)) return 0;
    const subtotal = bookingData.tests.reduce((sum: number, test: any) => sum + (getCurrentTestPrice(test) || 0), 0);
    const discountPercent = selectedCategory?.discount || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    return Math.max(0, subtotal - discountAmount);
  };

  const getTotalPaid = () => {
    return Object.values(paymentAmounts).reduce((sum, amount) => sum + (amount || 0), 0);
  };

  const getRemainingBalance = () => {
    const totalAmount = getTotalAmount();
    if (selectedPaymentMethod === 'credit') {
      return Math.max(0, totalAmount - (creditAmount || 0));
    }
    return Math.max(0, totalAmount - getTotalPaid());
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    if (methodId === 'credit') {
      setCreditAmount(getTotalAmount());
      setPaymentAmounts({});
    } else {
      setCreditAmount(0);
      if (methodId.includes('-')) {
        const methods = methodId.split('-');
        const splitAmount = getTotalAmount() / methods.length;
        const newAmounts: { [key: string]: number } = {};
        methods.forEach(method => {
          newAmounts[method] = splitAmount;
        });
        setPaymentAmounts(newAmounts);
      } else {
        setPaymentAmounts({ [methodId]: getTotalAmount() });
      }
    }
  };

  const getPaymentMethods = () => {
    if (selectedPaymentMethod.includes('-')) {
      return selectedPaymentMethod.split('-');
    }
    return [selectedPaymentMethod];
  };

  const handleAmountChange = (methodId: string, amount: number) => {
    setPaymentAmounts(prev => ({ ...prev, [methodId]: amount }));
  };

  const completeBooking = () => {
    if (selectedPatient && selectedCategory && bookingData.doctorId && bookingData.tests) {
      const newAppointmentId = `APT-${String(Date.now()).slice(-5)}`;
      
      const paymentInfo = {
        method: selectedPaymentMethod,
        amounts: paymentAmounts,
        totalPaid: selectedPaymentMethod === 'credit' ? (creditAmount || 0) : getTotalPaid(),
        totalAmount: getTotalAmount(),
        creditAmount: selectedPaymentMethod === 'credit' ? (creditAmount || 0) : 0,
        processedAt: new Date().toISOString()
      };

      const appointment = {
        id: newAppointmentId,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        doctorId: bookingData.doctorId,
        date: bookingData.appointmentDate,
        time: bookingData.appointmentTime,
        tests: bookingData.tests,
        services: bookingData.services,
        status: 'scheduled' as const,
        doctorApproved: false,
        labAssigned: false,
        paymentInfo,
        category: selectedCategory.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Creating appointment for existing patient:', appointment);
      addAppointment(appointment);

      setAppointmentId(newAppointmentId);
      setIsCompleted(true);
    }
  };

  // Completion Screen
  if (isCompleted) {
    const selectedDoctor = doctors.find(d => d.id === bookingData.doctorId);
    const totalPrice = getTotalAmount();

    const handlePrint = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      window.print();
    };

    return (
      <div className="p-4 md:p-6">
        <div className="text-center mb-4 md:mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">Appointment Scheduled Successfully!</h3>
          <p className="text-sm md:text-base text-gray-600">The appointment has been added to the system</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 md:mb-4">Appointment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Patient</p>
              <p className="font-medium text-gray-900">{selectedPatient?.name}</p>
              <p className="text-xs md:text-sm text-gray-500">{selectedPatient?.email}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Appointment ID</p>
              <p className="font-mono font-semibold text-blue-600">{appointmentId}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Doctor</p>
              <p className="font-medium text-gray-900">{selectedDoctor?.name}</p>
              <p className="text-xs md:text-sm text-gray-500">{selectedDoctor?.specialty}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Date & Time</p>
              <p className="font-medium text-gray-900">
                {new Date(bookingData.appointmentDate).toLocaleDateString()} at {bookingData.appointmentTime}
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Category</p>
              <p className="font-medium text-gray-900">{selectedCategory?.name}</p>
            </div>
          </div>
          
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
            <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">Tests/Services</p>
            <div className="space-y-1">
              {bookingData.tests?.map((test: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-900">{test.name}</span>
                  <span className="font-medium">₦{getCurrentTestPrice(test)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-green-600">₦{totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">Payment Details</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-700 capitalize">{selectedPaymentMethod.replace('-', ' + ')}</span>
                  <span className="font-medium">
                    ₦{selectedPaymentMethod === 'credit' ? (creditAmount || 0).toFixed(2) : getTotalPaid().toFixed(2)}
                  </span>
                </div>
                {selectedPaymentMethod === 'credit' && getRemainingBalance() > 0 && (
                  <div className="flex justify-between items-center text-xs md:text-sm text-orange-600">
                    <span>Remaining Balance</span>
                    <span className="font-medium">₦{getRemainingBalance().toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 md:px-6 md:py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center"
          >
            <Printer size={18} className="mr-2" />
            <span>Print</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 md:px-6 md:py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Exit Button */}
      <div className="flex justify-end mb-3 md:mb-4">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 px-3 py-1 md:px-4 md:py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span>×</span>
          <span className="text-sm md:text-base">Exit</span>
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-4 md:mb-6">
        <div className="flex items-center space-x-2 md:space-x-4">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full ${
                currentStep >= step ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 6 && (
                <div className={`w-8 h-0.5 md:w-12 ${currentStep > step ? 'bg-purple-800' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Patient Selection */}
      {currentStep === 1 && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Patient</h2>
            <p className="text-gray-600">Choose an existing patient for this appointment</p>
          </div>

          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => {
                const isSelected = selectedPatient?.id === patient.id;
                
                return (
                  <div
                    key={patient.id}
                    onClick={() => togglePatient(patient)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center flex-1">
                        <User size={20} className="text-gray-600 mr-3 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">{patient.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{patient.email}</p>
                          <p className="text-sm text-gray-500">{patient.phone}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No patients found. Please check your search term.
              </div>
            )}
          </div>

          {selectedPatient && (
            <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Selected Patient</h3>
              <div className="text-sm text-green-800">
                <span className="font-medium">{selectedPatient.name}</span>
                <span className="text-green-600 ml-2">
                  ({selectedPatient.email})
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <div></div>
            <button
              onClick={handlePatientNext}
              disabled={!selectedPatient}
              className="px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Category Selection */}
      {currentStep === 2 && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Patient Category</h2>
            <p className="text-gray-600">Choose the appropriate category for this patient</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {categoryOptions.map((category) => {
              const isSelected = selectedCategory?.id === category.id;
              
              return (
                <div
                  key={category.id}
                  onClick={() => toggleCategory(category)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      {category.discount > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          {category.discount}% Discount Applied
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedCategory && (
            <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Selected Category</h3>
              <div className="text-sm text-green-800">
                <span className="font-medium">{selectedCategory.name}</span>
                {selectedCategory.discount > 0 && (
                  <span className="text-green-600 ml-2">
                    ({selectedCategory.discount}% discount will be applied)
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleCategoryNext}
              disabled={!selectedCategory}
              className="px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Service Selection */}
      {currentStep === 3 && (
        <ServiceSelectionStep
          data={bookingData}
          updateData={updateBookingData}
          onNext={nextStep}
          onPrev={prevStep}
          currentStep={currentStep}
        />
      )}

      {/* Step 4: Test Selection (if needed) */}
      {currentStep === 4 && bookingData.needsTests && (
        <TestSelectionStep
          data={bookingData}
          updateData={updateBookingData}
          onNext={nextStep}
          onPrev={prevStep}
          currentStep={currentStep}
        />
      )}

      {/* Step 5: Doctor Selection (if needed) */}
      {currentStep === (bookingData.needsTests ? 5 : 4) && bookingData.needsDoctor && (
        <DoctorSelectionStep
          data={bookingData}
          updateData={updateBookingData}
          onComplete={nextStep}
          onPrev={prevStep}
          currentStep={currentStep}
        />
      )}

      {/* Payment Step */}
      {currentStep === (bookingData.needsTests && bookingData.needsDoctor ? 6 : bookingData.needsTests || bookingData.needsDoctor ? 5 : 4) && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing</h2>
            <p className="text-gray-600">Complete the payment for this appointment</p>
          </div>
          
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
            <div className="space-y-2">
              {bookingData.tests?.map((test: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{test.name}</span>
                  <span className="font-medium">₦{getCurrentTestPrice(test)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between items-center font-bold">
                <span>Total Amount</span>
                <span>₦{getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedPaymentMethod === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handlePaymentMethodSelect(option.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `${option.borderColor} ${option.bgColor}`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isSelected ? option.color : 'bg-gray-100'
                      }`}>
                        <Icon size={18} className={isSelected ? 'text-white' : 'text-gray-600'} />
                      </div>
                      <span className="text-sm font-medium text-center">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Amount Inputs */}
            {selectedPaymentMethod && selectedPaymentMethod !== 'credit' && (
              <div className="space-y-4 mb-6">
                <h4 className="text-md font-semibold text-gray-900">Enter Payment Amounts</h4>
                {getPaymentMethods().map((methodId) => {
                  const method = paymentOptions.find(opt => opt.id === methodId);
                  return (
                    <div key={methodId} className="flex items-center space-x-4">
                      <div className="w-32">
                        <span className="text-sm font-medium text-gray-700">
                          {method?.label || methodId.charAt(0).toUpperCase() + methodId.slice(1)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                          <input
                            type="number"
                            min="0"
                            max={getTotalAmount()}
                            step="0.01"
                            value={paymentAmounts[methodId] || ''}
                            onChange={(e) => handleAmountChange(methodId, parseFloat(e.target.value) || 0)}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Credit Amount Input */}
            {selectedPaymentMethod === 'credit' && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-orange-800">Credit Amount</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600">₦</span>
                    <input
                      type="number"
                      min="0"
                      max={getTotalAmount()}
                      step="0.01"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)}
                      className="w-32 pl-8 pr-3 py-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <p className="text-xs text-orange-700">
                  Patient will pay ₦{(getTotalAmount() - creditAmount).toFixed(2)} later
                </p>
              </div>
            )}
          </div>

          {/* Payment Status */}
          {selectedPaymentMethod && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Receipt size={18} className="mr-2" />
                Payment Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Due</p>
                  <p className="text-2xl font-bold text-gray-900">₦{getTotalAmount().toFixed(2)}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-2xl font-bold text-purple-700">
                    ₦{selectedPaymentMethod === 'credit' ? (creditAmount || 0).toFixed(2) : getTotalPaid().toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
                  <p className={`text-2xl font-bold ${getRemainingBalance() > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₦{getRemainingBalance().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <button
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={completeBooking}
              disabled={getRemainingBalance() > 0}
              className="px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Complete Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExistingPatientBooking;