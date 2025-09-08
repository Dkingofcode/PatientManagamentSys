import React, { useState } from "react";
import { useAppointments } from "../../contexts/AppointmentContext";
function PaymentMethodStep({ data, updateData, onNext, onPrev, }) {
    const { getDiscountPercent } = useAppointments();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(data.paymentMethods?.[0] || "");
    const [paymentAmounts, setPaymentAmounts] = useState(data.paymentAmounts || {});
    const [creditAmount, setCreditAmount] = useState(data.creditAmount || 0);
    // Calculate pricing based on category
    // const getCurrentTestPrice = (test: any) => {
    //  // const category = data.category;
    //   return getTestPrice(test.id,  'walk-in');
    // };
    const subtotal = data.tests?.reduce((sum, test) => sum + test.price, 0) || 0;
    const discountPercent = getDiscountPercent("walk-in");
    const discountAmount = subtotal * (discountPercent / 100);
    const totalAmount = subtotal - discountAmount;
    const paymentOptions = [
        {
            id: "cash",
            label: "Cash",
            icon: "💵",
            color: "border-green-500 bg-green-50",
            iconBg: "bg-green-500",
        },
        {
            id: "pos",
            label: "POS/Card",
            icon: "💳",
            color: "border-blue-500 bg-blue-50",
            iconBg: "bg-blue-500",
        },
        {
            id: "transfer",
            label: "Bank Transfer",
            icon: "💸",
            color: "border-purple-500 bg-purple-50",
            iconBg: "bg-purple-500",
        },
        {
            id: "cash-transfer",
            label: "Cash + Transfer",
            icon: "💰",
            color: "border-indigo-500 bg-indigo-50",
            iconBg: "bg-indigo-500",
        },
        {
            id: "pos-transfer",
            label: "POS + Transfer",
            icon: "💳",
            color: "border-cyan-500 bg-cyan-50",
            iconBg: "bg-cyan-500",
        },
        {
            id: "pos-cash",
            label: "POS + Cash",
            icon: "💵",
            color: "border-teal-500 bg-teal-50",
            iconBg: "bg-teal-500",
        },
        {
            id: "credit",
            label: "Credit",
            icon: "📋",
            color: "border-orange-500 bg-orange-50",
            iconBg: "bg-orange-500",
        },
    ];
    const handlePaymentMethodSelect = (methodId) => {
        setSelectedPaymentMethod(methodId);
        if (methodId === "credit") {
            setCreditAmount(totalAmount);
            setPaymentAmounts({});
        }
        else {
            setCreditAmount(0);
            if (methodId.includes("-")) {
                const methods = methodId.split("-");
                const splitAmount = totalAmount / methods.length;
                const newAmounts = {};
                methods.forEach((method) => {
                    newAmounts[method] = splitAmount;
                });
                setPaymentAmounts(newAmounts);
            }
            else {
                setPaymentAmounts({ [methodId]: totalAmount });
            }
        }
    };
    const handleAmountChange = (methodId, amount) => {
        setPaymentAmounts((prev) => ({ ...prev, [methodId]: amount }));
    };
    const getTotalPaid = () => {
        return Object.values(paymentAmounts).reduce((sum, amount) => sum + amount, 0);
    };
    const getRemainingAmount = () => {
        return Math.max(0, totalAmount - getTotalPaid() - creditAmount);
    };
    const getPaymentMethods = () => {
        if (selectedPaymentMethod === "credit")
            return ["credit"];
        if (selectedPaymentMethod.includes("-")) {
            return selectedPaymentMethod.split("-");
        }
        return [selectedPaymentMethod];
    };
    const handleNext = () => {
        const methods = getPaymentMethods();
        updateData({
            paymentMethods: methods,
            paymentAmounts,
            creditAmount,
        });
        onNext();
    };
    const isValidPayment = () => {
        if (selectedPaymentMethod === "credit") {
            return creditAmount > 0;
        }
        return getTotalPaid() >= totalAmount;
    };
    return (<div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Processing
        </h2>
      </div>

      {/* Payment Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Summary
        </h3>

        <div className="space-y-3 mb-4">
          {data.tests?.map((test, index) => (<div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{test.name}</span>
              <div className="flex items-center space-x-2">
                {test.price !== test.prices["walk-in"] && (<span className="line-through text-gray-400 text-sm">
                    ${test.prices["walk-in"]}
                  </span>)}
                <span className="font-medium">${test.price}</span>
              </div>
            </div>))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount</span>
            <span>${totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Payment Method
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {paymentOptions.map((option) => (<button key={option.id} onClick={() => handlePaymentMethodSelect(option.id)} className={`p-4 rounded-lg border-2 transition-all ${selectedPaymentMethod === option.id
                ? option.color
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${selectedPaymentMethod === option.id
                ? option.iconBg
                : "bg-gray-100"} text-white text-xl`}>
                  {option.icon}
                </div>
                <span className="text-sm font-medium text-center">
                  {option.label}
                </span>
              </div>
            </button>))}
        </div>

        {/* Payment Amount Inputs */}
        {selectedPaymentMethod && selectedPaymentMethod !== "credit" && (<div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">
              Enter Payment Amounts
            </h4>
            {getPaymentMethods().map((methodId) => {
                const method = paymentOptions.find((opt) => opt.id === methodId);
                return (<div key={methodId} className="flex items-center space-x-4">
                  <div className="w-20">
                    <span className="text-sm font-medium text-gray-700">
                      {method?.label || methodId}
                    </span>
                  </div>
                  <div className="flex-1">
                    <input type="number" min="0" max={totalAmount} step="0.01" value={paymentAmounts[methodId] || ""} onChange={(e) => handleAmountChange(methodId, parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00"/>
                  </div>
                </div>);
            })}
          </div>)}

        {/* Credit Amount Input */}
        {selectedPaymentMethod === "credit" && (<div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-800">
                Credit Amount
              </span>
              <input type="number" min="0" max={totalAmount} step="0.01" value={creditAmount} onChange={(e) => setCreditAmount(parseFloat(e.target.value) || 0)} className="w-32 px-3 py-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="0.00"/>
            </div>
            <p className="text-xs text-orange-700">
              Patient will pay ${(totalAmount - creditAmount).toFixed(2)} later
            </p>
          </div>)}
      </div>

      {/* Payment Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Due</p>
            <p className="text-2xl font-bold text-gray-900">${totalAmount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
            <p className="text-2xl font-bold text-green-600">
              ${getTotalPaid()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Remaining</p>
            <p className={`text-2xl font-bold ${getRemainingAmount() > 0 ? "text-red-600" : "text-green-600"}`}>
              ${getRemainingAmount()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button onClick={onPrev} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Previous
        </button>
        <button onClick={handleNext} disabled={!selectedPaymentMethod || !isValidPayment()} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Complete Booking
        </button>
      </div>
    </div>);
}
export default PaymentMethodStep;
