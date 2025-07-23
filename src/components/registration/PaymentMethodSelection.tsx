import React, { useState } from 'react';
//import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import type{ RegistrationData } from '../../pages/PatientRegistration';
import { CreditCard, Banknote, ArrowLeftRight, Calculator, Receipt, DollarSign, ArrowLeft } from 'lucide-react';

interface PaymentMethodSelectionProps {
  data: Partial<RegistrationData>;
  updateData: (data: Partial<RegistrationData>) => void;
  onComplete: () => void;
  onBack: () => void;
}

function PaymentMethodSelection({ data, updateData, onComplete, onBack }: PaymentMethodSelectionProps) {
 // const { user } = useAuth();
  const { getTestPrice, getDiscountPercent } = useAppointments();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: number }>({});
  const [creditAmount, setCreditAmount] = useState(0);

  // Calculate pricing based on category
  const getCurrentTestPrice = (test: any) => {
    const category = data.category;
    return getTestPrice(test.id,
    "walk-in");
  };

  const subtotal = data.tests?.reduce((sum, test) => sum + getCurrentTestPrice(test), 0) || 0;
  const discountPercent = getDiscountPercent(  'walk-in');
  const discountAmount = subtotal * (discountPercent / 100);
  const totalAmount = subtotal - discountAmount;

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
      icon: DollarSign,
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

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    
    if (methodId === 'credit') {
      setCreditAmount(totalAmount);
      setPaymentAmounts({});
    } else {
      setCreditAmount(0);
      if (methodId.includes('-')) {
        // Combination method - split equally
        const methods = methodId.split('-');
        const splitAmount = totalAmount / methods.length;
        const newAmounts: { [key: string]: number } = {};
        methods.forEach(method => {
          newAmounts[method] = splitAmount;
        });
        setPaymentAmounts(newAmounts);
      } else {
        // Single method - full amount
        setPaymentAmounts({ [methodId]: totalAmount });
      }
    }
  };

  const handleAmountChange = (methodId: string, amount: number) => {
    setPaymentAmounts(prev => ({ ...prev, [methodId]: amount }));
  };

  const getPaymentMethods = () => {
    if (selectedPaymentMethod === 'credit') return ['credit'];
    if (selectedPaymentMethod.includes('-')) {
      return selectedPaymentMethod.split('-');
    }
    return [selectedPaymentMethod];
  };

  const getTotalPaid = () => {
    return Object.values(paymentAmounts).reduce((sum, amount) => sum + amount, 0);
  };

  const getRemainingBalance = () => {
    if (selectedPaymentMethod === 'credit') {
      return Math.max(0, totalAmount - creditAmount);
    }
    return Math.max(0, totalAmount - getTotalPaid());
  };

  const isPaymentComplete = () => {
    if (selectedPaymentMethod === 'credit') {
      return creditAmount > 0;
    }
    return getTotalPaid() >= totalAmount;
  };

  const handleComplete = () => {
    const methods = getPaymentMethods();
    const paymentData = {
      selectedPaymentMethod,
      paymentMethods: methods,
      paymentAmounts,
      creditAmount,
      totalAmount,
      totalPaid: getTotalPaid(),
      remainingBalance: getRemainingBalance(),
      processedBy: "uytyrytuio",
      processedById: "3838",
      processedAt: new Date().toISOString(),
    };

    updateData({ paymentData });
    onComplete();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Payment Processing</h2>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
        <p className="text-gray-600">Select your preferred payment method and enter the payment details</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        
        <div className="space-y-3">
          {data.tests?.map((test, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{test.name}</span>
              <div className="flex items-center space-x-2">
                {getCurrentTestPrice(test) !== test.prices['walk-in'] && (
                  <span className="line-through text-gray-400 text-sm">
                    ${test.prices['walk-in']}
                  </span>
                )}
                <span className="font-medium">${getCurrentTestPrice(test)}</span>
              </div>
            </div>
          ))}
          
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-green-600 border-t pt-2">
              <span>Discount ({discountPercent}% - {data.category?.toUpperCase()})</span>
              <span className="font-medium">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center text-xl font-bold border-t pt-3">
            <span>Total Amount</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Payment Method</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPaymentMethod === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handlePaymentMethodSelect(option.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `${option.borderColor} ${option.bgColor}`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    isSelected ? option.color : 'bg-gray-100'
                  }`}>
                    <Icon size={20} className={isSelected ? 'text-white' : 'text-gray-600'} />
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
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        max={totalAmount}
                        step="0.01"
                        value={paymentAmounts[methodId] || ''}
                        onChange={(e) => handleAmountChange(methodId, parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-orange-800">Credit Amount</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600">$</span>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  step="0.01"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)}
                  className="w-32 pl-8 pr-3 py-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            <p className="text-xs text-orange-700">
              Patient will pay ${(totalAmount - creditAmount).toFixed(2)} later
            </p>
          </div>
        )}
      </div>

      {/* Real-time Payment Status */}
      {selectedPaymentMethod && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Receipt size={20} className="mr-2" />
            Payment Status
          </h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Due</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ${selectedPaymentMethod === 'credit' ? creditAmount.toFixed(2) : getTotalPaid().toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
              <p className={`text-2xl font-bold ${getRemainingBalance() > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${getRemainingBalance().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Log Preview */}
      {selectedPaymentMethod && (
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Transaction Log Preview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Payment Method(s):</span>
              <span className="ml-2 font-medium text-blue-900">
                {getPaymentMethods().map(method => method.toUpperCase()).join(' + ')}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Processed By:</span>
              <span className="ml-2 font-medium text-blue-900">{"8yikijhg"} (ID: {"3838"})</span>
            </div>
            <div>
              <span className="text-blue-700">Total Transaction:</span>
              <span className="ml-2 font-medium text-blue-900">${totalAmount.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-blue-700">Timestamp:</span>
              <span className="ml-2 font-medium text-blue-900">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Complete Payment Button */}
      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          disabled={!selectedPaymentMethod || !isPaymentComplete()}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Complete Payment & Register Patient
        </button>
      </div>
    </div>
  );
}

export default PaymentMethodSelection;