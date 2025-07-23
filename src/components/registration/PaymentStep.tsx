import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import type { RegistrationData } from '../../pages/PatientRegistration';
import { CreditCard, Banknote, ArrowLeftRight, Calculator, Receipt, DollarSign } from 'lucide-react';
//import initialPaymentData from "../../pages/PatientRegistration"



interface PaymentStepProps {
  data: Partial<RegistrationData>;
  updateData: (data: Partial<RegistrationData>) => void;
  onPrev: () => void;
  onComplete: () => void;
}

// 1. Define the full payment data type
interface PaymentData {
  selectedPaymentMethod: string;
  paymentMethods: string[];
  paymentAmounts: { [key: string]: number };
  creditAmount: number;
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  processedBy?: string;
  processedById?: string;
  processedAt: string;
}

// 2. Create proper initial data
const initialPaymentData: PaymentData = {
  selectedPaymentMethod: '',
  paymentMethods: ['cash', 'card', 'insurance', 'hmo'],
  paymentAmounts: {},
  creditAmount: 0,
  totalAmount: 0,
  totalPaid: 0,
  remainingBalance: 0,
  processedAt: new Date().toISOString()
};

function PaymentStep({ data, updateData, onPrev, onComplete }: PaymentStepProps) {
  const { user } = useAuth();

  const paymentOptions = [
    { 
      id: 'cash', 
      label: 'Cash', 
      icon: <Banknote />,
      color: 'border-green-500 bg-green-50',
      iconBg: 'bg-green-500'
    },
    { 
      id: 'card', 
      label: 'Card', 
      icon: <CreditCard />,
      color: 'border-blue-500 bg-blue-50',
      iconBg: 'bg-blue-500'
    },
    { 
      id: 'split', 
      label: 'Split', 
      icon: <ArrowLeftRight />,
      color: 'border-purple-500 bg-purple-50',
      iconBg: 'bg-purple-500'
    },
    { 
      id: 'credit', 
      label: 'Credit', 
      icon: <Receipt />,
      color: 'border-orange-500 bg-orange-50',
      iconBg: 'bg-orange-500'
    }
  ];

  // Get payment data from previous step
//  const paymentData = data.paymentData || {};
const paymentData: PaymentData = data.paymentData || initialPaymentData;  
const { 
    selectedPaymentMethod = '',
    paymentMethods = [],
    paymentAmounts = {},
    creditAmount = 0,
    totalAmount = 0,
    totalPaid = 0,
    remainingBalance = 0
  } = paymentData;

  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const getCurrentTestPrice = (test: any) => {
    return test.prices[data.category || 'walk-in'] || test.prices['walk-in'];
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    updateData({
      ...paymentData, // Contains all required fields
      selectedPaymentMethod: methodId,
    });
  };

  const getPaymentMethods = () => {
    if (selectedPaymentMethod === 'split') {
      return ['cash', 'card'];
    }
    return selectedPaymentMethod ? [selectedPaymentMethod] : [];
  };

  const handleAmountChange = (methodId: string, amount: number) => {
    updateData({
      paymentData: {
        ...paymentData,
        paymentAmounts: {
          ...paymentData.paymentAmounts,
          [methodId]: amount
        },
        totalPaid: getTotalPaid(), // Update derived values
        remainingBalance: totalAmount - (getTotalPaid() + creditAmount),
      }
    });
  };

  const getTotalPaid = () => {
    return Object.values(paymentAmounts).reduce((sum: number, amount: any) => sum + (amount || 0), 0);
  };

  const setCreditAmount = (amount: number) => {
    updateData({
      paymentData: {
        ...paymentData,
        creditAmount: amount
      }
    });
  };

  const handleComplete = () => {
    const methods = getPaymentMethods();
    const paymentInfo = {
      methods,
      amounts: paymentAmounts,
      totalPaid: getTotalPaid(),
      discount: discountAmount,
      finalAmount: totalAmount,
      creditAmount,
      processedBy: user?.name,
      processedAt: new Date().toISOString(),
    };

    updateData({
      patientInfo: {
        ...data.patientInfo,
        paymentInfo,
      }
    });

    onComplete();
  };
  
  const isPaymentComplete = getTotalPaid() + creditAmount >= totalAmount;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Process Payment</h2>
        <p className="text-gray-600">Complete the payment transaction</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calculator size={20} className="mr-2" />
          Payment Summary
        </h3>
        
        <div className="space-y-3">
          {/* Test Breakdown */}
          <div className="space-y-2">
            {data.tests?.map((test, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{test.name}</span>
                <div className="flex items-center space-x-2">
                  {getCurrentTestPrice(test) !== test.prices['walk-in'] && (
                    <span className="line-through text-gray-400">
                      ${test.prices['walk-in']}
                    </span>
                  )}
                  <span className="font-medium">${getCurrentTestPrice(test)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-medium">${subtotal}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount ({discountPercent}% - {data.category?.toUpperCase()})</span>
                <span className="font-medium">-${discountAmount}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total Amount</span>
              <span>${totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handlePaymentMethodSelect(option.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPaymentMethod === option.id
                  ? option.color
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  selectedPaymentMethod === option.id ? option.iconBg : 'bg-gray-100'
                } text-white text-xl`}>
                  {option.icon}
                </div>
                <span className="text-sm font-medium text-center">{option.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Payment Amount Inputs */}
        {selectedPaymentMethod && selectedPaymentMethod !== 'credit' && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">Enter Payment Amounts</h4>
            {getPaymentMethods().map((methodId) => {
              const method = paymentOptions.find(opt => opt.id === methodId);
              return (
                <div key={methodId} className="flex items-center space-x-4">
                  <div className="w-20">
                    <span className="text-sm font-medium text-gray-700">{method?.label || methodId}</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max={totalAmount}
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
        {selectedPaymentMethod === 'credit' && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">Credit Amount</span>
              <input
                type="number"
                min="0"
                max={totalAmount}
                step="0.01"
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-orange-700">
              Patient will pay ${(totalAmount - creditAmount).toFixed(2)} later
            </p>
          </div>
        )}
      </div>

      {/* Payment Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Due</p>
            <p className="text-lg font-bold text-gray-900">${totalAmount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount Paid</p>
            <p className="text-lg font-bold text-green-600">${getTotalPaid()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Credit Amount</p>
            <p className="text-lg font-bold text-orange-600">${creditAmount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-lg font-bold ${remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${remainingAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Processing Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Payment Processing Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Processed by:</span>
            <span className="ml-2 font-medium text-blue-900">{user?.name} ({user?.employeeId})</span>
          </div>
          <div>
            <span className="text-blue-700">Date & Time:</span>
            <span className="ml-2 font-medium text-blue-900">{new Date().toLocaleString()}</span>
          </div>
          {paymentMethods.length > 0 && (
            <div>
              <span className="text-blue-700">Payment Method(s):</span>
              <span className="ml-2 font-medium text-blue-900">
                {getPaymentMethods().map(method => method.toUpperCase()).join(' + ')}
                {creditAmount > 0 && ' + CREDIT'}
              </span>
            </div>
          )}
          <div>
            <span className="text-blue-700">Total Transaction:</span>
            <span className="ml-2 font-medium text-blue-900">${totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleComplete}
          disabled={!isPaymentComplete}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
}

export default PaymentStep;
