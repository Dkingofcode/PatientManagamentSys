import React, { useState } from 'react';
import type { RegistrationData } from '../../pages/PatientRegistration';
import { useAppointments } from '../../contexts/AppointmentContext';
import { Droplets, FlaskConical, Heart, Brain, Eye, X } from 'lucide-react';
import type { TestType } from '../../contexts/AppointmentContext';

interface TestSelectionStepProps {
  data: Partial<RegistrationData>;
  updateData: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void; 
  currentStep: number;
}

function TestSelectionStep({ data, updateData, onNext, onPrev }: TestSelectionStepProps) {
  const { availableTests, getTestPrice } = useAppointments();
  const [selectedTests, setSelectedTests] = useState<TestType[]>(data.tests || []);


  const getTestIcon = (testName: string) => {
    switch (testName.toLowerCase()) {
      case 'complete blood count (cbc)':
        return Droplets;
      case 'urinalysis':
        return FlaskConical;
      case 'ecg':
        return Heart;
      case 'ultrasound scan':
        return Brain;
      case 'chest x-ray':
        return Eye;
      default:
        return FlaskConical;
    }
  };

  const getCurrentTestPrice = (test: TestType) => {
    const category = data.category;
    return getTestPrice(test.id,  'walk-in');
  };

  const toggleTest = (test: TestType) => {
    const isSelected = selectedTests.some(t => t.id === test.id);
    if (isSelected) {
      setSelectedTests(prev => prev.filter(t => t.id !== test.id));
    } else {
      setSelectedTests(prev => [...prev, test]);
    }
  };

  const handleNext = () => {
    updateData({ tests: selectedTests });
    onNext();
  };

  const totalPrice = selectedTests.reduce((sum, test) => sum + getCurrentTestPrice(test), 0);
  const totalDuration = selectedTests.reduce((sum, test) => sum + test.duration, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Selection</h2>
        <p className="text-gray-600">What test(s) is the patient coming for today?</p>
        {data.category && (
          <p className="text-sm text-blue-600 mt-1">
            Category: {data.category.replace('-', ' ').toUpperCase()}
            {(['hmo', 'corporate', 'hospital'].includes(data.category)) && ' (Discount Applied)'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {availableTests.map((test) => {
          const Icon = getTestIcon(test.name);
          const isSelected = selectedTests.some(t => t.id === test.id);
          const currentPrice = getCurrentTestPrice(test);
          const basePrice = test.prices['walk-in'];
          const hasDiscount = currentPrice !== basePrice;
          
          return (
            <button
              key={test.id}
              onClick={() => toggleTest(test)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    isSelected ? 'bg-blue-500' : 'bg-gray-100'
                  }`}>
                    <Icon size={20} className={isSelected ? 'text-white' : 'text-gray-600'} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{test.name}</h3>
                    <p className="text-xs text-gray-500">{test.department}</p>
                    {test.description && (
                      <p className="text-xs text-gray-400 mt-1">{test.description}</p>
                    )}
                    <div className="text-sm text-gray-600">
                      {hasDiscount ? (
                        <div className="flex items-center space-x-2">
                          <span className="line-through text-gray-400">${basePrice}</span>
                          <span className="text-green-600 font-medium">${currentPrice}</span>
                        </div>
                      ) : (
                        <span>${currentPrice}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{test.duration} minutes</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tests Summary */}
      {selectedTests.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Selected Tests</h3>
          <div className="space-y-2 mb-4">
            {selectedTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{test.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">${getCurrentTestPrice(test)}</span>
                  <button
                    onClick={() => toggleTest(test)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total Duration: {totalDuration} minutes
            </div>
            <div className="text-lg font-bold text-gray-900">
              Total: ${totalPrice}
            </div>
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
          onClick={handleNext}
          disabled={selectedTests.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

export default TestSelectionStep;