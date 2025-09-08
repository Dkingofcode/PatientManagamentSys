import React, { useState } from 'react';
import { useAppointments } from '../contexts/AppointmentContext';
import { Search, User, CheckCircle, CreditCard, Banknote, ArrowLeftRight, Calculator, Receipt } from 'lucide-react';
import TestSelectionStep from './registration/TestSelectionStep';
import DoctorSelectionStep from './registration/DoctorSelectionStep';
const CategoryModal = ({ show, onConfirm, onClose, initialCategory = 'walk-in' }) => {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    if (!show)
        return null;
    return (<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-4 w-[95%] max-w-lg max-h-[90vh] overflow-y-auto shadow-lg">
    <h3 className="text-xl font-semibold mb-2 text-center">Patient Category</h3>
    <p className="text-sm text-gray-600 mb-4 text-center">
      What category does the patient fall into?
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
            { label: "Walk-in", desc: "Patient without appointment" },
            { label: "Referred", desc: "Referred by another patient", discount: "10% Discount Applied" },
            { label: "Hospital", desc: "Hospital patient", discount: "20% Discount Applied" },
            { label: "HMO", desc: "Health Maintenance Organization", discount: "30% Discount Applied" },
            { label: "Staff", desc: "Hospital staff member", discount: "50% Discount Applied" },
        ].map((cat) => (<button key={cat.label} onClick={() => setSelectedCategory(cat.label)} className={`border rounded-lg p-3 text-center hover:shadow-md transition ${selectedCategory === cat.label
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200"}`}>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center mb-2">
              <span className="text-sm">👤</span>
            </div>
            <p className="font-semibold text-sm">{cat.label}</p>
            <p className="text-xs text-gray-500">{cat.desc}</p>
            {cat.discount && (<p className="text-green-600 text-xs font-medium mt-1">
                {cat.discount}
              </p>)}
          </div>
        </button>))}
    </div>

    <div className="flex justify-end space-x-2 mt-4">
      <button onClick={onClose} className="px-3 py-1 border rounded text-sm">
        Cancel
      </button>
      <button onClick={() => onConfirm(selectedCategory)} className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
        Confirm
      </button>
    </div>
  </div>
    </div>);
};
function ExistingPatientBooking({ onClose, preSelectedPatient }) {
    const { patients, addAppointment, doctors, getDiscountPercent } = useAppointments();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState(preSelectedPatient || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookingData, setBookingData] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [appointmentId, setAppointmentId] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [creditAmount, setCreditAmount] = useState(0);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [pendingPatient, setPendingPatient] = useState(null);
    const [lastUsedCategory, setLastUsedCategory] = useState(null);
    // If a patient is pre-selected, skip to step 2
    React.useEffect(() => {
        if (preSelectedPatient) {
            setCurrentStep(2);
        }
    }, [preSelectedPatient]);
    const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm));
    const updateBookingData = (data) => {
        setBookingData((prev) => ({ ...prev, ...data }));
    };
    const handlePatientSelect = (patient) => {
        if (lastUsedCategory && lastUsedCategory === patient.category) {
            setSelectedPatient(patient);
            setCurrentStep(2);
        }
        else {
            setPendingPatient(patient);
            setShowCategoryModal(true);
        }
    };
    const handleCategoryConfirm = (category) => {
        if (pendingPatient) {
            const updatedPatient = { ...pendingPatient, category };
            setSelectedPatient(updatedPatient);
            setLastUsedCategory(category);
            setCurrentStep(2);
        }
        setShowCategoryModal(false);
    };
    const handleCategoryModalClose = () => {
        setShowCategoryModal(false);
        setPendingPatient(null);
    };
    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };
    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };
    const paymentOptions = [
        {
            id: 'cash',
            label: 'Cash',
            icon: Banknote,
            color: 'bg-green-500',
            borderColor: 'border-green-500',
            bgColor: 'bg-green-50'
        },
        {
            id: 'pos',
            label: 'POS/Card',
            icon: CreditCard,
            color: 'bg-blue-500',
            borderColor: 'border-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'transfer',
            label: 'Bank Transfer',
            icon: ArrowLeftRight,
            color: 'bg-purple-500',
            borderColor: 'border-purple-500',
            bgColor: 'bg-purple-50'
        },
        {
            id: 'cash-transfer',
            label: 'Cash + Transfer',
            icon: ArrowLeftRight,
            color: 'bg-indigo-500',
            borderColor: 'border-indigo-500',
            bgColor: 'bg-indigo-50'
        },
        {
            id: 'pos-transfer',
            label: 'POS + Transfer',
            icon: CreditCard,
            color: 'bg-cyan-500',
            borderColor: 'border-cyan-500',
            bgColor: 'bg-cyan-50'
        },
        {
            id: 'pos-cash',
            label: 'POS + Cash',
            icon: Banknote,
            color: 'bg-teal-500',
            borderColor: 'border-teal-500',
            bgColor: 'bg-teal-50'
        },
        {
            id: 'credit',
            label: 'Credit',
            icon: Calculator,
            color: 'bg-orange-500',
            borderColor: 'border-orange-500',
            bgColor: 'bg-orange-50'
        },
    ];
    const handlePaymentMethodSelect = (methodId) => {
        setSelectedPaymentMethod(methodId);
        if (methodId === 'credit') {
            setCreditAmount(getTotalAmount());
            setPaymentAmounts({});
        }
        else {
            setCreditAmount(0);
            if (methodId.includes('-')) {
                const methods = methodId.split('-');
                const splitAmount = getTotalAmount() / methods.length;
                const newAmounts = {};
                methods.forEach(method => {
                    newAmounts[method] = splitAmount;
                });
                setPaymentAmounts(newAmounts);
            }
            else {
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
    const handleAmountChange = (methodId, amount) => {
        setPaymentAmounts(prev => ({ ...prev, [methodId]: amount }));
    };
    const getCurrentTestPrice = (test) => {
        // const category = selectedPatient?.category || 'walk-in';
        return test.price;
    };
    const getTotalAmount = () => {
        if (!bookingData.tests)
            return 0;
        const subtotal = bookingData.tests.reduce((sum, test) => sum + getCurrentTestPrice(test), 0);
        const discountPercent = getDiscountPercent(selectedPatient?.category || 'walk-in');
        const discountAmount = subtotal * (discountPercent / 100);
        return subtotal - discountAmount;
    };
    const getTotalPaid = () => {
        return Object.values(paymentAmounts).reduce((sum, amount) => sum + amount, 0);
    };
    const getRemainingBalance = () => {
        const totalAmount = getTotalAmount();
        if (selectedPaymentMethod === 'credit') {
            return Math.max(0, totalAmount - creditAmount);
        }
        return Math.max(0, totalAmount - getTotalPaid());
    };
    const completeBooking = () => {
        if (selectedPatient && bookingData.doctorId && bookingData.tests) {
            const newAppointmentId = `APT-${String(Date.now()).slice(-5)}`;
            const paymentInfo = {
                method: selectedPaymentMethod,
                amounts: paymentAmounts,
                totalPaid: selectedPaymentMethod === 'credit' ? creditAmount : getTotalPaid(),
                totalAmount: getTotalAmount(),
                creditAmount: selectedPaymentMethod === 'credit' ? creditAmount : 0,
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
                status: 'scheduled',
                doctorApproved: false,
                labAssigned: false,
                paymentInfo,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            console.log('Creating appointment for existing patient:', appointment);
            addAppointment(appointment);
            setAppointmentId(newAppointmentId);
            setIsCompleted(true);
        }
    };
    if (isCompleted) {
        const selectedDoctor = doctors.find(d => d.id === bookingData.doctorId);
        const totalPrice = getTotalAmount();
        return (<div className="p-4 md:p-6">
        <div className="text-center mb-4 md:mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <CheckCircle size={24} className="text-green-600"/>
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">Appointment Scheduled Successfully!</h3>
          <p className="text-sm md:text-base text-gray-600">The appointment has been added to the system</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 md:mb-4">Appointment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Patient</p>
              <p className="font-medium text-gray-900">{selectedPatient.name}</p>
              <p className="text-xs md:text-sm text-gray-500">{selectedPatient.email}</p>
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
          </div>
          
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
            <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">Tests</p>
            <div className="space-y-1">
              {bookingData.tests?.map((test, index) => (<div key={index} className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-900">{test.name}</span>
                  <span className="font-medium">₦{getCurrentTestPrice(test)}</span>
                </div>))}
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-green-600">₦{totalPrice}</span>
            </div>
            
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">Payment Details</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-700 capitalize">{selectedPaymentMethod.replace('-', ' + ')}</span>
                  <span className="font-medium">
                    ₦{selectedPaymentMethod === 'credit' ? creditAmount : getTotalPaid()}
                  </span>
                </div>
                {selectedPaymentMethod === 'credit' && getRemainingBalance() > 0 && (<div className="flex justify-between items-center text-xs md:text-sm text-orange-600">
                    <span>Remaining Balance</span>
                    <span className="font-medium">₦{getRemainingBalance()}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 md:px-6 md:py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-colors">
            Close
          </button>
        </div>
      </div>);
    }
    return (<div className="p-4 md:p-6">
      {/* Exit Button */}
      <div className="flex justify-end mb-3 md:mb-4">
        <button onClick={onClose} className="flex items-center space-x-2 px-3 py-1 md:px-4 md:py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
          <span>×</span>
          <span className="text-sm md:text-base">Exit</span>
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-4 md:mb-6">
        <div className="flex items-center space-x-2 md:space-x-4">
          {[1, 2, 3, 4].map((step) => (<React.Fragment key={step}>
              <div className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full ${currentStep >= step ? 'bg-purple-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step}
              </div>
              {step < 4 && (<div className={`w-8 h-0.5 md:w-12 ${currentStep > step ? 'bg-purple-800' : 'bg-gray-200'}`}/>)}
            </React.Fragment>))}
        </div>
      </div>

      {currentStep === 1 && (<div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Select Patient</h3>
          
          {/* Search */}
          <div className="relative mb-4 md:mb-6">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
            <input type="text" placeholder="Search by name, email, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
          </div>

          {/* Patient List */}
          <div className="max-h-[calc(100vh-300px)] md:max-h-96 overflow-y-auto space-y-2 md:space-y-3">
            {filteredPatients.length > 0 ? (filteredPatients.map((patient) => (<div key={patient.id} onClick={() => handlePatientSelect(patient)} className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-blue-600"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{patient.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600 truncate">{patient.email}</p>
                      <p className="text-xs text-gray-500">{patient.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {patient.category?.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>))) : (<div className="text-center py-6 md:py-8 text-gray-500">
                {searchTerm ? 'No patients found matching your search' : 'No registered patients found'}
              </div>)}
          </div>
        </div>)}

      {currentStep === 2 && selectedPatient && (<div>
          <div className="mb-3 md:mb-4 p-3 md:p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Selected Patient</h4>
            <p className="text-sm md:text-base text-blue-700">{selectedPatient.name} - {selectedPatient.email}</p>
          </div>
          
          <TestSelectionStep data={{ ...bookingData, category: selectedPatient.category }} updateData={updateBookingData} onNext={nextStep} onPrev={prevStep} currentStep={currentStep}/>
        </div>)}

      {currentStep === 3 && selectedPatient && (<div>
          <div className="mb-3 md:mb-4 p-3 md:p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Selected Patient</h4>
            <p className="text-sm md:text-base text-blue-700">{selectedPatient.name} - {selectedPatient.email}</p>
          </div>
          
          <DoctorSelectionStep data={bookingData} updateData={updateBookingData} onPrev={prevStep} onComplete={nextStep} currentStep={currentStep}/>
        </div>)}

      {currentStep === 4 && selectedPatient && (<div>
          <div className="mb-3 md:mb-4 p-3 md:p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Selected Patient</h4>
            <p className="text-sm md:text-base text-blue-700">{selectedPatient.name} - {selectedPatient.email}</p>
          </div>
          
          {/* Payment Step */}
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Payment Processing</h3>
            
            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <h4 className="font-medium text-gray-900 mb-2 md:mb-3">Payment Summary</h4>
              <div className="space-y-1 md:space-y-2">
                {bookingData.tests?.map((test, index) => (<div key={index} className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-gray-700 truncate">{test.name}</span>
                    <div className="flex items-center space-x-1 md:space-x-2">
                      {test.price && (<span className="line-through text-gray-400">${test.price}</span>)}
                      <span className="font-medium">${getCurrentTestPrice(test)}</span>
                    </div>
                  </div>))}
                <div className="border-t pt-1 md:pt-2 flex justify-between items-center font-bold">
                  <span>Total Amount</span>
                  <span>${getTotalAmount()}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-6">Select Payment Method</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
                {paymentOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedPaymentMethod === option.id;
                return (<button key={option.id} onClick={() => handlePaymentMethodSelect(option.id)} className={`p-3 md:p-4 rounded-lg border-2 transition-all ${isSelected
                        ? `${option.borderColor} ${option.bgColor}`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-1 md:mb-2 ${isSelected ? option.color : 'bg-gray-100'}`}>
                          <Icon size={16} className={isSelected ? 'text-white' : 'text-gray-600'}/>
                        </div>
                        <span className="text-xs md:text-sm font-medium text-center">{option.label}</span>
                      </div>
                    </button>);
            })}
              </div>

              {/* Payment Amount Inputs */}
              {selectedPaymentMethod && selectedPaymentMethod !== 'credit' && (<div className="space-y-2 md:space-y-4 mb-4 md:mb-6">
                  <h4 className="text-sm md:text-md font-semibold text-gray-900">Enter Payment Amounts</h4>
                  {getPaymentMethods().map((methodId) => {
                    const method = paymentOptions.find(opt => opt.id === methodId);
                    return (<div key={methodId} className="flex items-center space-x-2 md:space-x-4">
                        <div className="w-24 md:w-32">
                          <span className="text-xs md:text-sm font-medium text-gray-700">
                            {method?.label || methodId.charAt(0).toUpperCase() + methodId.slice(1)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <span className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                            <input type="number" min="0" max={getTotalAmount()} step="0.01" value={paymentAmounts[methodId] || ''} onChange={(e) => handleAmountChange(methodId, parseFloat(e.target.value) || 0)} className="w-full pl-6 md:pl-8 pr-2 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00"/>
                          </div>
                        </div>
                      </div>);
                })}
                </div>)}

              {/* Credit Amount Input */}
              {selectedPaymentMethod === 'credit' && (<div className="mt-3 md:mt-4 p-3 md:p-4 bg-orange-50 rounded-lg border border-orange-200 mb-4 md:mb-6">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <span className="text-xs md:text-sm font-medium text-orange-800">Credit Amount</span>
                    <div className="relative">
                      <span className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-orange-600">$</span>
                      <input type="number" min="0" max={getTotalAmount()} step="0.01" value={creditAmount} onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)} className="w-24 md:w-32 pl-6 md:pl-8 pr-2 md:pr-3 py-2 border border-orange-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="0.00"/>
                    </div>
                  </div>
                  <p className="text-xs text-orange-700">
                    Patient will pay ${(getTotalAmount() - creditAmount).toFixed(2)} later
                  </p>
                </div>)}
            </div>

            {/* Real-time Payment Status */}
            {selectedPaymentMethod && (<div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-8">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
                  <Receipt size={18} className="mr-2"/>
                  Payment Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 text-center">
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">Total Due</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">₦{getTotalAmount().toFixed(2)}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-purple-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">Amount Paid</p>
                    <p className="text-lg md:text-2xl font-bold text-purple-700">
                      ₦{selectedPaymentMethod === 'credit' ? creditAmount.toFixed(2) : getTotalPaid().toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-red-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">Remaining Balance</p>
                    <p className={`text-lg md:text-2xl font-bold ${getRemainingBalance() > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₦{getRemainingBalance().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>)}

            {/* Transaction Log Preview */}
            {selectedPaymentMethod && (<div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4 md:mb-8">
                <h4 className="text-xs md:text-sm font-medium text-blue-900 mb-2 md:mb-3">Transaction Log Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                  <div>
                    <span className="text-blue-700">Payment Method(s):</span>
                    <span className="ml-1 md:ml-2 font-medium text-blue-900">
                      {getPaymentMethods().map(method => method.toUpperCase()).join(' + ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Processed By:</span>
                    <span className="ml-1 md:ml-2 font-medium text-blue-900">{"System User"} (ID: {"SYS001"})</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Transaction:</span>
                    <span className="ml-1 md:ml-2 font-medium text-blue-900">₦{getTotalAmount().toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Timestamp:</span>
                    <span className="ml-1 md:ml-2 font-medium text-blue-900">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>)}

            <div className="flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 md:px-6 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button onClick={completeBooking} disabled={getRemainingBalance() > 0} className="px-4 py-2 md:px-6 md:py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Complete Booking
              </button>
            </div>
          </div>
        </div>)}

      <CategoryModal show={showCategoryModal} onConfirm={handleCategoryConfirm} onClose={handleCategoryModalClose} initialCategory={pendingPatient?.category || 'general'}/>
    </div>);
}
export default ExistingPatientBooking;
