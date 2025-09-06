import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import doctorImg from "../assets/doctor.png";
import { fetchTests } from "../services/testService";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  category: "walk-in" | "referral" | "corporate" | "hospital" | "hmo";
  address?: string;
  registeredBy?: string;
  registeredById?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    coverageDetails?: string;
    groupNumber?: string;
  };
  medicalHistory?: string;
  registrationDate?: string;
  paymentInfo?: {
    selectedPaymentMethod?: string;
    paymentMethods?: string[];
    paymentAmounts?: { [key: string]: number };
    creditAmount?: number;
    totalAmount?: number;
    totalPaid?: number;
    remainingBalance?: number;
    processedBy?: string;
    processedById?: string;
    processedAt?: string;
  };
}

export interface TestType {
  id: string;
  name: string;
  price: number;
  prices: {
    "walk-in": number;
    referral: number;
    hmo: number;
    hospital: number;
    corporate: number;
  };
  duration: number;
  department: string;
  description?: string;
  
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  tests: TestType[];
  status:
    | "scheduled"
    | "in-progress"
    | "lab-completed"
    | "completed"
    | "cancelled";
  doctorApproved: boolean;
  labAssigned: boolean;
  assignedLabTech?: string;
  approvedAt?: string;
  doctorSignature?: string;
  doctorComments?: string;
  finalizedAt?: string;
  remarks?: string;
  results?: string[];
  rescheduleHistory?: {
    originalDate: string;
    originalTime: string;
    newDate: string;
    newTime: string;
    timestamp: string;
    reason?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  sampleId?: string;
  sampleStatus?: "received" | "pending" | "rejected";
  sampleCondition?: string;
  technicianNotes?: string;
  qcStatus?: "passed" | "failed" | "pending";
  startTime?: string;
  completionTime?: string;
  priority?: "low" | "normal" | "high";
  department?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  profileImage: string;
  availability: boolean;
  nextAvailable?: string;
}

export interface AppointmentContextType {
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  addPatient: (patient: Patient) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  submitTestResults: (
    id: string,
    results: { data: string; notes: string; file?: File }
  ) => void;
  getPatientById: (id: string) => Patient | undefined;
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getAppointmentsByTechnician: (technicianId: string) => Appointment[];
  getAppointmentsByDate: (date: string) => Appointment[];
  getPatientsByFrontDesk: (frontDeskId: string) => Patient[];
  getAppointmentsByFrontDesk: (frontDeskId: string) => Appointment[];
  rescheduleAppointment: (
    id: string,
    newDate: string,
    newTime: string,
    reason?: string
  ) => void;
  approveForLab: (appointmentId: string, labTechnicianId?: string) => void;
  getApprovedAppointments: () => Appointment[];
  availableTests: TestType[];
  getDiscountPercent: (category: Patient["category"]) => number;
  refreshTests: (options?: {
    category?: string;
    search?: string;
  }) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

const mockDoctors: Doctor[] = [
  {
    id: "7",
    name: "Dr. Kuti",
    specialty: "",
    profileImage: doctorImg,
    availability: true,
    nextAvailable: "2025-01-15",
  },
  {
    id: "8",
    name: "Dr. Oduyemi",
    specialty: "",
    profileImage: doctorImg,
    availability: true,
  },
];

// const mockTests: TestType[] = [
//   {
//     id: "1",
//     name: "Complete Blood Count (CBC)",
//     price: 50,
//     prices: { "walk-in": 50, referral: 45, hmo: 40, hospital: 35, corporate: 30 },
//     duration: 30,
//     department: "Lab",
//     description: "Basic blood test",
//   },
//   {
//     id: "2",
//     name: "X-Ray",
//     price: 100,
//     prices: { "walk-in": 100, referral: 90, hmo: 80, hospital: 70, corporate: 60 },
//     duration: 15,
//     department: "Radiology",
//     description: "Chest X-Ray",
//   },
//   {
//     id: "3",
//     name: "Blood Glucose Test",
//     price: 30,
//     prices: { "walk-in": 30, referral: 25, hmo: 20, hospital: 15, corporate: 10 },
//     duration: 10,
//     department: "Lab",
//     description: "Glucose level test",
//   },
//   {
//     id: "4",
//     name: "Urinalysis",
//     price: 40,
//     prices: { "walk-in": 40, referral: 35, hmo: 30, hospital: 25, corporate: 20 },
//     duration: 20,
//     department: "Lab",
//     description: "Urine test",
//   },
//   {
//     id: "5",
//     name: "Lipid Profile",
//     price: 60,
//     prices: { "walk-in": 60, referral: 55, hmo: 50, hospital: 45, corporate: 40 },
//     duration: 25,
//     department: "Lab",
//     description: "Cholesterol test",
//   },
//   {
//     id: "6",
//     name: "Thyroid Function Test",
//     price: 70,
//     prices: { "walk-in": 70, referral: 65, hmo: 60, hospital: 55, corporate: 50 },
//     duration: 30,
//     department: "Lab",
//     description: "Thyroid hormone test",
//   },
//   {
//     id: "7",
//     name: "Abdominal CT",
//     price: 200,
//     prices: { "walk-in": 200, referral: 180, hmo: 160, hospital: 140, corporate: 120 },
//     duration: 45,
//     department: "Radiology",
//     description: "Abdominal CT scan",
//   },
//   {
//     id: "8",
//     name: "Spine MRI",
//     price: 250,
//     prices: { "walk-in": 250, referral: 225, hmo: 200, hospital: 175, corporate: 150 },
//     duration: 60,
//     department: "Radiology",
//     description: "Spine MRI scan",
//   },
// ];

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const savedPatients = localStorage.getItem("patients");
    return savedPatients ? JSON.parse(savedPatients) : [];
  });
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const savedAppointments = localStorage.getItem("appointments");
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [availableTests, setAvailableTests] = useState<TestType[]>([]);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const addPatient = (patient: Patient) => {
    const newPatient = {
      ...patient,
      id: patient.id || `PAT${Date.now().toString().slice(-6)}`,
      registrationDate: patient.registrationDate || new Date().toISOString(),
    };
    setPatients((prev) => [...prev.filter((p) => p.id !== newPatient.id), newPatient]);
  };

  const addAppointment = (appointment: Appointment) => {
    const newAppointment = {
      ...appointment,
      id: appointment.id || `APT${Date.now().toString().slice(-6)}`,
      doctorApproved: appointment.doctorApproved || false,
      labAssigned: appointment.labAssigned || false,
      createdAt: appointment.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAppointments((prev) => [...prev.filter((a) => a.id !== newAppointment.id), newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? { ...appointment, ...updates, updatedAt: new Date().toISOString() }
          : appointment
      )
    );
  };

  const submitTestResults = (id: string, results: { data: string; notes: string; file?: File }) => {
    const updates: Partial<Appointment> = {
      status: "lab-completed" as Appointment["status"],
      results: [results.data],
      technicianNotes: results.notes,
      qcStatus: "pending",
      sampleId: `SMP-${id}-${Date.now()}`,
      sampleStatus: "received",
      sampleCondition: "Good",
      completionTime: new Date().toISOString(),
    };
    updateAppointment(id, updates);
    console.log("Test results submitted client-side:", updates);
  };

  const getPatientById = (id: string) => patients.find((patient) => patient.id === id);

  const getAppointmentsByDoctor = (doctorId: string) =>
    appointments.filter((appointment) => appointment.doctorId === doctorId);

  const getAppointmentsByTechnician = (technicianId: string) =>
    appointments.filter(
      (appointment) => appointment.assignedLabTech === technicianId && appointment.labAssigned
    );

  const getAppointmentsByDate = (date: string) =>
    appointments.filter((appointment) => appointment.date === date);

  const getPatientsByFrontDesk = (frontDeskId: string) =>
    patients.filter((patient) => patient.registeredById === frontDeskId);

  const getAppointmentsByFrontDesk = (frontDeskId: string) =>
    appointments.filter((appointment) => {
      const patient = getPatientById(appointment.patientId);
      return patient?.registeredById === frontDeskId;
    });

  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newTime: string,
    reason?: string
  ) => {
    const appointment = appointments.find((a) => a.id === id);
    if (!appointment) return;
    const updates = {
      date: newDate,
      time: newTime,
      rescheduleHistory: [
        ...(appointment.rescheduleHistory || []),
        {
          originalDate: appointment.date,
          originalTime: appointment.time,
          newDate,
          newTime,
          timestamp: new Date().toISOString(),
          reason,
        },
      ],
    };
    updateAppointment(id, updates);
  };

  const approveForLab = (appointmentId: string, labTechnicianId?: string) => {
    const updates: Partial<Appointment> = {
      doctorApproved: true,
      labAssigned: true,
      status: "in-progress" as Appointment["status"],
      assignedLabTech: labTechnicianId,
      approvedAt: new Date().toISOString(),
    };
    updateAppointment(appointmentId, updates);
  };

  const getApprovedAppointments = () =>
    appointments.filter((appointment) => appointment.doctorApproved && appointment.labAssigned);

  const getDiscountPercent = (category: Patient["category"]) => {
    const discounts = {
      "walk-in": 0,
      referral: 10,
      corporate: 15,
      hmo: 30,
      hospital: 20,
    };
    return discounts[category] || 0;
  };

  const refreshTests = async (options?: { category?: string; search?: string }) => {
  let token = localStorage.getItem("token") || "";
  console.log("Using token:", token);

  let testData: any = await fetchTests(token, options);
  console.log("Fetched test data:", testData);

  let filteredTests = testData.tests || [];
  if (options?.search) {
    filteredTests = filteredTests.filter((test: any) =>
      test.name.toLowerCase().includes(options.search!.toLowerCase())
    );
  }
  setAvailableTests(filteredTests);
};


  useEffect(() => {
    refreshTests();
  }, []);

  return (
    <AppointmentContext.Provider
      value={{
        patients,
        appointments,
        doctors,
        addPatient,
        addAppointment,
        updateAppointment,
        submitTestResults,
        getPatientById,
        getAppointmentsByDoctor,
        getAppointmentsByTechnician,
        getAppointmentsByDate,
        getPatientsByFrontDesk,
        getAppointmentsByFrontDesk,
        rescheduleAppointment,
        approveForLab,
        getApprovedAppointments,
        availableTests,
        getDiscountPercent,
        refreshTests,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error("useAppointments must be used within an AppointmentProvider");
  return context;
}