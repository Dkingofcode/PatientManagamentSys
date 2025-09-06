import { useState } from "react";
import { Check } from "lucide-react";
import type { RegistrationData } from "../../pages/PatientRegistration";

interface ServiceSelectionStepProps {
  data: Partial<RegistrationData>;
  updateData: (data: Partial<RegistrationData>) => void;
  onPrev?: () => void;
  onNext: () => void;
  currentStep: number;
}

interface ServiceWithTimestamp {
  id: string;
  timestamp: string;
}

interface ServiceOption {
  id: string;
  name: string;
  department: string;
  description?: string;
}

interface TestMapping {
  [key: string]: {
    name: string;
    department: string;
  };
}

function ServiceSelectionStep({
  data,
  updateData,
  onPrev,
  onNext,
}: ServiceSelectionStepProps) {
  const [selectedServices, setSelectedServices] = useState<ServiceWithTimestamp[]>(
    data.services?.map((s) => ({ 
      id: s, 
      timestamp: new Date().toISOString() 
    })) || []
  );

  const serviceOptions: ServiceOption[] = [
    { 
      id: "consultation", 
      name: "Consultation", 
      department: "General",
      description: "Doctor consultation and examination"
    },
    { 
      id: "sonography", 
      name: "Sonography", 
      department: "Radiology",
      description: "Ultrasound imaging services"
    },
    { 
      id: "radiography", 
      name: "Radiography", 
      department: "Radiology",
      description: "X-ray and imaging services"
    },
    { 
      id: "laboratory", 
      name: "Laboratory", 
      department: "Laboratory",
      description: "Lab tests and analysis"
    },
  ];

  const toggleService = (id: string) => {
    const timestamp = new Date().toISOString();
    const isCurrentlySelected = selectedServices.some((s) => s.id === id);
    
    if (isCurrentlySelected) {
      setSelectedServices(prev => prev.filter((s) => s.id !== id));
    } else {
      setSelectedServices(prev => [...prev, { id, timestamp }]);
    }
  };

  const handleNext = () => {
    if (selectedServices.length === 0) {
      return;
    }

    const selectedServiceIds = selectedServices.map(s => s.id);
    
    const hasTestServices = selectedServiceIds.some(
      (id) => id === "radiography" || id === "laboratory"
    );

    const hasDoctorServices = selectedServiceIds.some(
      (id) => id === "consultation" || id === "sonography"
    );

    // Test mapping for services that need test selection
    const testMapping: TestMapping = {
      sonography: { name: "Sonography", department: "Radiology" },
      radiography: { name: "Radiography", department: "Radiology" },
      laboratory: { name: "Laboratory", department: "Laboratory" },
    };

    // Map selected services to tests where applicable
    const mappedTests = selectedServices
      .filter((s) => testMapping[s.id])
      .map((s) => ({
        id: s.id,
        name: testMapping[s.id].name,
        department: testMapping[s.id].department,
        price: 0,
        timestamp: s.timestamp,
      }));

    // Create service timestamps object
    const serviceTimestamps = selectedServices.reduce(
      (acc, s) => ({ ...acc, [s.id]: s.timestamp }),
      {} as Record<string, string>
    );

    // Update data with all necessary information
    updateData({
      services: selectedServiceIds,
      tests: mappedTests.length > 0 ? mappedTests : undefined,
      needsTests: hasTestServices,
      needsDoctor: hasDoctorServices,
      prices: {},
      duration: 0,
      skipPricing: selectedServiceIds.every((id) => id === "consultation"),
      serviceTimestamps,
    });

    onNext();
  };

  const isServiceSelected = (serviceId: string): boolean => {
    return selectedServices.some((s) => s.id === serviceId);
  };

  const getSelectedServiceInfo = () => {
    return selectedServices
      .map((s) => {
        const serviceOption = serviceOptions.find((opt) => opt.id === s.id);
        return serviceOption ? {
          ...serviceOption,
          timestamp: s.timestamp,
        } : null;
      })
      .filter(Boolean);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Service(s)</h2>
        <p className="text-gray-600">Choose one or more services for this patient</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {serviceOptions.map((service) => {
          const isSelected = isServiceSelected(service.id);
          
          return (
            <div
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{service.department}</p>
                  {service.description && (
                    <p className="text-xs text-gray-500">{service.description}</p>
                  )}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedServices.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">
            Selected Services ({selectedServices.length})
          </h3>
          <div className="space-y-1">
            {getSelectedServiceInfo().map((service) => (
              <div key={service?.id} className="text-sm text-green-800">
                <span className="font-medium">{service?.name}</span>
                <span className="text-green-600 ml-2">
                  (Selected: {new Date(service?.timestamp || '').toLocaleTimeString()})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-6">
        {onPrev ? (
          <button
            onClick={onPrev}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
        ) : (
          <div></div>
        )}
        
        <button
          onClick={handleNext}
          disabled={selectedServices.length === 0}
          className="px-6 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          Continue
          {selectedServices.length > 0 && (
            <span className="ml-2 bg-purple-700 text-xs px-2 py-1 rounded-full">
              {selectedServices.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default ServiceSelectionStep;