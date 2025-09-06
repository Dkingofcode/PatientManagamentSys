import React, { useState, useEffect } from "react";
import type { RegistrationData } from "../../pages/PatientRegistration";
import { useAppointments } from "../../contexts/AppointmentContext";
import { Droplets, FlaskConical, Heart, Brain, Eye, X } from "lucide-react";
import type { TestType } from "../../contexts/AppointmentContext";

interface TestSelectionStepProps {
  data: Partial<RegistrationData>;
  updateData: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
}

function TestSelectionStep({
  data,
  updateData,
  onNext,
  onPrev,
}: TestSelectionStepProps) {
  const { availableTests } = useAppointments();
  const [selectedTests, setSelectedTests] = useState<TestType[]>(
    data.tests || []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Detect when availableTests is ready
  useEffect(() => {
    if (availableTests && availableTests.length > 0) {
      setLoading(false);
    }
  }, [availableTests]);

  const getTestIcon = (testName: string) => {
    switch (testName.toLowerCase()) {
      case "complete blood count (cbc)":
        return Droplets;
      case "urinalysis":
        return FlaskConical;
      case "ecg":
        return Heart;
      case "ultrasound scan":
        return Brain;
      case "chest x-ray":
        return Eye;
      default:
        return FlaskConical;
    }
  };

  const toggleTest = (test: TestType) => {
    const isSelected = selectedTests.some((t) => t.id === test.id);
    if (isSelected) {
      setSelectedTests((prev) => prev.filter((t) => t.id !== test.id));
    } else {
      setSelectedTests((prev) => [...prev, test]);
    }
  };

  const handleNext = () => {
    updateData({ tests: selectedTests });
    onNext();
  };

  // Ensure prices are numbers when calculating total
  const totalPrice = selectedTests.reduce(
    (sum, test) => sum + Number(test.price || 0),
    0
  );

  const filteredTests = availableTests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test Selection
        </h2>
        <p className="text-gray-600">
          What test(s) is the patient coming for today?
        </p>
        {data.category && (
          <p className="text-sm text-purple-500 mt-1">
            Category: {data.category.replace("-", " ").toUpperCase()}
            {["hmo", "corporate", "hospital"].includes(data.category) &&
              " (Discount Applied)"}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search test..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Spinner while loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto pr-2 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map((test) => {
              const Icon = getTestIcon(test.name);
              const isSelected = selectedTests.some((t) => t.id === test.id);
              const currentPrice = Number(test.price || 0);
              const hasDiscount = currentPrice !== Number(test.price || 0); // placeholder for discount logic

              return (
                <button
                  key={test.id}
                  onClick={() => toggleTest(test)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          isSelected ? "bg-purple-500" : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          size={20}
                          className={
                            isSelected ? "text-white" : "text-gray-600"
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {test.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {test.department}
                        </p>
                        {test.description && (
                          <p className="text-xs text-gray-400 mt-1">
                            {test.description}
                          </p>
                        )}
                        <div className="text-sm text-gray-600">
                          {hasDiscount ? (
                            <div className="flex items-center space-x-2">
                              <span className="line-through text-gray-400">
                                ₦{Number(test.price).toLocaleString()}
                              </span>
                              <span className="text-green-600 font-medium">
                                ₦{currentPrice.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span>₦{currentPrice.toLocaleString()}</span>
                          )}
                        </div>
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
        </div>
      )}

      {/* Selected Tests */}
      {selectedTests.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Selected Tests</h3>
          <div className="space-y-2 mb-4">
            {selectedTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{test.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    ₦{Number(test.price || 0).toLocaleString()}
                  </span>
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
            <div className="text-sm text-gray-600">Price</div>
            <div className="text-lg font-bold text-gray-900">
              Total: ₦{totalPrice.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
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
          className="px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

export default TestSelectionStep;
