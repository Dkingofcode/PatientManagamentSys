import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PatientCategoryStep from '../components/registration/PatientCategoryStep';
import ServiceSelectionStep from '../components/registration/ServiceSelectionStep';
import TestSelectionStep from '../components/registration/TestSelectionStep';
import PatientInfoStep from '../components/registration/PatientInfoStep';
import DoctorSelectionStep from '../components/registration/DoctorSelectionStep';
import PaymentMethodSelection from '../components/registration/PaymentMethodSelection';
import RegistrationSuccess from '../components/registration/RegistrationSuccess';
import { useAppointments } from '../contexts/AppointmentContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import type { TestType, Patient, Appointment } from '../contexts/AppointmentContext';

export interface RegistrationData {
  category: string;
  service: string;
  needsTests?: boolean;
  needsDoctor?: boolean;
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
  selectedPaymentMethod: '',
  paymentMethods: ['Cash', 'Credit Card', 'Insurance', 'HMO'],
  paymentAmounts: {},
  creditAmount: 0,
  totalAmount: 0,
  totalPaid: 0,
  remainingBalance: 0,
  processedAt: new Date().toISOString(),
};

function PatientRegistration() {
  const navigate = useNavigate();
  const { addPatient, addAppointment, approveForLab } = useAppointments();
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<Partial<RegistrationData>>({ doctorId: '7' });
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [generatedIds, setGeneratedIds] = useState<{ patientId: string; appointmentId: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New: Prevent multiple submissions

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const completeRegistration = () => {
    setShowPaymentStep(true);
  };

  const completePayment = () => {
    if (isSubmitting) {
      console.log("Submission already in progress, skipping...");
      return;
    }

    console.log("Registration data before completion:", registrationData); // Debug: Check data
    console.log("Validation checks:", { // Debug: Check validation
      hasName: !!registrationData.patientInfo?.name,
      hasCategory: !!registrationData.category,
      testsValid: !registrationData.needsTests || (registrationData.tests && registrationData.tests.length > 0),
      doctorValid: !registrationData.needsDoctor || (registrationData.doctorId && registrationData.appointmentDate && registrationData.appointmentTime),
    });

    if (
      registrationData.patientInfo?.name &&
      registrationData.category &&
      (!registrationData.needsTests || (registrationData.tests && registrationData.tests.length > 0)) &&
      (!registrationData.needsDoctor || (registrationData.doctorId && registrationData.appointmentDate && registrationData.appointmentTime))
    ) {
      setIsSubmitting(true);
      try {
        const patientId = `PID-${String(Date.now()).slice(-5)}`;
        const frontDeskId = "987656789";

        const patient: Patient = {
          id: patientId,
          name: registrationData.patientInfo.name as string,
          email: registrationData.patientInfo.email || "",
          phone: registrationData.patientInfo.phone || "",
          dateOfBirth: registrationData.patientInfo.dateOfBirth || "",
          gender: registrationData.patientInfo.gender || "",
          category: registrationData.category as Patient["category"],
          insurance: registrationData.patientInfo.insurance || { provider: "", policyNumber: "" },
          registrationDate: new Date().toISOString(),
          registeredById: frontDeskId,
        };

        addPatient(patient);

        const appointmentId = `APT-${String(Date.now()).slice(-5)}`;

      
        const appointment: Appointment = {
          id: appointmentId,
          patientId,
          patientName: patient.name,
          doctorId: (registrationData.doctorId as string) || '7', // fallback to '7' if missing
          date: registrationData.appointmentDate || new Date().toISOString().split('T')[0],
          time: registrationData.appointmentTime || new Date().toLocaleTimeString().slice(0,5),
          tests: (registrationData.tests || []) as TestType[],
          status: 'scheduled',
          doctorApproved: false,
          labAssigned: true,
          assignedLabTech: user?.id || "TECH001",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addAppointment(appointment);

        approveForLab(appointmentId, user?.id || "TECH001");

        addNotification({
          title: 'New Appointment Scheduled',
          message: `New patient ${patient.name} registered and appointment scheduled for ${registrationData.appointmentDate} at ${registrationData.appointmentTime}. Awaiting doctor approval.`,
          type: 'success',
          category: 'appointment',
          priority: 'high',
          recipientRole: 'admin',
        });

        setGeneratedIds({ patientId, appointmentId });
        setIsCompleted(true);
        setShowPaymentStep(false); // Ensure payment step is hidden
      } catch (error) {
        console.error("Error during registration:", error);
        addNotification({
          title: 'Registration Error',
          message: 'An unexpected error occurred. Please try again.',
          type: 'error',
          category: 'appointment',
          priority: 'high',
          recipientRole: 'admin',
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      addNotification({
        title: 'Registration Failed',
        message: 'Please complete all required fields.',
        type: 'error',
        category: 'appointment',
        priority: 'high',
        recipientRole: 'admin',
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate('/front-desk');
  };

  const stepConfigs = [
    { title: 'Patient Category', component: PatientCategoryStep },
    { title: 'Select Service(s)', component: ServiceSelectionStep },
    { title: 'Test Selection', component: TestSelectionStep },
    { title: 'Patient Information', component: PatientInfoStep },
    { title: 'Doctor & Appointment', component: DoctorSelectionStep },
  ];

  const adjustedStepConfigs = stepConfigs.filter((step) => {
    if (step.title === 'Test Selection') return registrationData.needsTests !== false;
    if (step.title === 'Doctor & Appointment') return registrationData.needsDoctor !== false;
    return true;
  });

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

  const CurrentStepComponent = adjustedStepConfigs[currentStep - 1]?.component;
  const isLastStep = currentStep === adjustedStepConfigs.length;
  const onStepNext = isLastStep ? completeRegistration : nextStep;
  const onStepPrev = currentStep > 1 ? prevStep : undefined;

  return (
    <Layout title="">
      <div className="max-w-4xl mx-auto">
        {/* Stepper UI */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-4">
            {adjustedStepConfigs.map((step, index) => {
              const stepNum = index + 1;
              return (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= stepNum
                        ? 'bg-purple-700 border-purple-700 text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {stepNum}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= stepNum ? 'text-purple-600' : 'text-gray-400'
                      }`}
                    >
                      Step {stepNum}
                    </p>
                    <p
                      className={`text-sm ${
                        currentStep >= stepNum ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < adjustedStepConfigs.length - 1 && (
                    <div
                      className={`hidden md:block flex-1 h-0.5 mx-4 ${
                        currentStep > stepNum ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
            <div className="flex items-center">
              <div
                className={`hidden md:block flex-1 h-0.5 mx-4 ${
                  showPaymentStep || isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  showPaymentStep || isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {adjustedStepConfigs.length + 1}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    showPaymentStep || isCompleted ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  Step {adjustedStepConfigs.length + 1}
                </p>
                <p
                  className={`text-sm ${
                    showPaymentStep || isCompleted ? 'text-gray-900' : 'text-gray-500'
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
          {CurrentStepComponent && (
            <CurrentStepComponent
              data={registrationData}
              updateData={updateRegistrationData}
              onNext={onStepNext}
              onPrev={onStepPrev}
              currentStep={currentStep}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default PatientRegistration;
