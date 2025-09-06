import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import PatientCategoryStep from "../components/registration/PatientCategoryStep";
import TestSelectionStep from "../components/registration/TestSelectionStep";
import PatientInfoStep from "../components/registration/PatientInfoStep";
import DoctorSelectionStep from "../components/registration/DoctorSelectionStep";
import PaymentMethodSelection from "../components/registration/PaymentMethodSelection";
import RegistrationSuccess from "../components/registration/RegistrationSuccess";
import { useAppointments } from "../contexts/AppointmentContext";
import { useNotifications } from "../contexts/NotificationContext";
import type { TestType } from "../contexts/AppointmentContext";
import type { Patient } from "../contexts/AppointmentContext";

export interface RegistrationData {
  category: string;
  tests: TestType[];
  patientInfo: Partial<Patient>;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethods?: string[];
  patient: Partial<Patient>;
  paymentData: {
    selectedPaymentMethod: string;
    paymentMethods: string[];
    paymentAmounts: { [key: string]: number };
    creditAmount: number;
    totalAmount: number;
    totalPaid: number;
    remainingBalance: number;
    processedBy?: string | undefined;
    processedById?: string | undefined;
    processedAt: string;
  };
  doctorApproved?: boolean;
  labAssigned?: boolean;

  paymentAmounts?: { [key: string]: number };
  creditAmount?: number;
  selectedPaymentMethod?: string;
}

export const initialPaymentData = {
  selectedPaymentMethod: "",
  paymentMethods: ["Cash", "Credit Card", "Insurance", "HMO"],
  paymentAmounts: {},
  creditAmount: 0,
  totalAmount: 0,
  totalPaid: 0,
  remainingBalance: 0,
  processedAt: new Date().toISOString(),
};

function PatientRegistration() {
  const navigate = useNavigate();
  const { addPatient, addAppointment } = useAppointments();
  const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<
    Partial<RegistrationData>
  >({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [generatedIds, setGeneratedIds] = useState<{
    patientId: string;
    appointmentId: string;
  } | null>(null);

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const completeRegistration = () => {
    setShowPaymentStep(true);
  };

  const completePayment = () => {
    if (
      registrationData.patientInfo &&
      registrationData.doctorId &&
      registrationData.tests
    ) {
      // Generate patient ID
      const patientId = `PID-${String(Date.now()).slice(-5)}`;

      // Create patient
      const patient: Patient = {
        ...(registrationData.patientInfo as Patient),
        id: patientId,
      };

      // Create appointment
      const appointmentId = `APT-${String(Date.now()).slice(-5)}`;
      const appointment = {
        id: appointmentId,
        patientId,
        doctorId: registrationData.doctorId!,
        date: registrationData.appointmentDate!,
        time: registrationData.appointmentTime!,
        tests: registrationData.tests,
        status: "scheduled" as const,
        doctorApproved: false,
        labAssigned: false,
        patientName: "donvisod",
      };

      addPatient(patient);
      addAppointment(appointment);

      // Send notifications
      addNotification({
        title: "New Appointment Scheduled",
        message: `New patient ${patient.name} registered and appointment scheduled for ${registrationData.appointmentDate} at ${registrationData.appointmentTime}. Awaiting doctor approval.`,
        type: "success",
        category: "appointment",
        priority: "high",
        recipientRole: "admin",
      });

      setGeneratedIds({ patientId, appointmentId });
      setIsCompleted(true);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/front-desk");
  };

  const steps = [
    { number: 1, title: "Patient Category", component: PatientCategoryStep },
    { number: 2, title: "Test Selection", component: TestSelectionStep },
    { number: 3, title: "Patient Information", component: PatientInfoStep },
    {
      number: 4,
      title: "Doctor & Appointment",
      component: DoctorSelectionStep,
    },
  ];

  if (isCompleted && generatedIds) {
    return (
      <Layout title="Registration Complete">
        <div className="max-w-2xl mx-auto">
          <RegistrationSuccess
            patientId={generatedIds.patientId}
            appointmentId={generatedIds.appointmentId}
            registrationData={registrationData}
            onBackToDashboard={handleBackToDashboard}
          />
        </div>
      </Layout>
    );
  }

  if (showPaymentStep && !isCompleted) {
    return (
      <Layout title="Payment Processing">
        <div className="max-w-4xl mx-auto">
          <PaymentMethodSelection
            data={registrationData}
            updateData={updateRegistrationData}
            onComplete={completePayment}
            onBack={() => setShowPaymentStep(false)}
          />
        </div>
      </Layout>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <Layout title="">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-purple-700 border-purple-700 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step.number}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-purple-600"
                        : "text-gray-400"
                    }`}
                  >
                    Step {step.number}
                  </p>
                  <p
                    className={`text-sm ${
                      currentStep >= step.number
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block flex-1 h-0.5 mx-4 ${
                      currentStep > step.number ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}

            {/* Payment Step Indicator */}
            <div className="flex items-center">
              <div
                className={`hidden md:block flex-1 h-0.5 mx-4 ${
                  showPaymentStep || isCompleted ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  showPaymentStep || isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                5
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    showPaymentStep || isCompleted
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  Step 5
                </p>
                <p
                  className={`text-sm ${
                    showPaymentStep || isCompleted
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Payment Processing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <CurrentStepComponent
            data={registrationData}
            updateData={updateRegistrationData}
            onNext={nextStep}
            onPrev={prevStep}
            onComplete={completeRegistration}
            currentStep={currentStep}
          />
        </div>
      </div>
    </Layout>
  );
}

export default PatientRegistration;
