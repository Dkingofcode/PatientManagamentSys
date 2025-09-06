import React from "react";
import type { RegistrationData } from "../../pages/PatientRegistration";
import {
  Users,
  UserCheck,
  Stethoscope,
  Guitar as Hospital,
  Shield,
} from "lucide-react";

interface PatientCategoryStepProps {
  data: Partial<RegistrationData>;
  updateData: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
}

function PatientCategoryStep({
  data,
  updateData,
  onNext,
}: PatientCategoryStepProps) {
  const categories = [
    {
      id: "walk-in",
      label: "Walk-in",
      description: "Patient without appointment",
      icon: Users,
      color: "bg-gray-700",
      discount: 0,
    },
    {
      id: "referred",
      label: "Referred",
      description: "Referred by another patient",
      icon: UserCheck,
      color: "bg-gray-700",
      discount: 10,
    },
    {
      id: "hospital",
      label: "Hospital",
      description: "Hospital patient",
      icon: Hospital,
      color: "bg-gray-700",
      discount: 20,
    },
    {
      id: "hmo",
      label: "HMO",
      description: "Health Maintenance Organization",
      icon: Shield,
      color: "bg-gray-700",
      discount: 30,
    },
    {
      id: "corporate",
      label: "Corporate",
      description: "Corporate employee",
      icon: Stethoscope,
      color: "bg-gray-700",
      discount: 50,
    },
  ];

  const handleCategorySelect = (category: string) => {
    updateData({ category });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Patient Category
        </h2>
        <p className="text-gray-600">
          What category does the patient fall into?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = data.category === category.id;

          return (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-purple-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full ${category.color} mb-3`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.label}
                </h3>
                <p className="text-sm text-gray-600">{category.description}</p>
                {category.discount > 0 && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    {category.discount}% Discount Applied
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.category}
          className="px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

export default PatientCategoryStep;