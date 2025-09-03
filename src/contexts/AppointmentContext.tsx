// import { createContext, useContext, useEffect, useState } from "react";
// import type { ReactNode } from "react";
// import { fetchTests } from "../services/testService";

// export interface Patient {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   dateOfBirth: string;
//   gender: string;
//   category: "walk-in" | "referral" | "corporate" | "hospital" | "hmo";
//   address?: string;
//   registeredBy?: string;
//   registeredById?: string;
//   emergencyContact?: {
//     name: string;
//     phone: string;
//     relationship: string;
//   };
//   insurance: {
//     provider: string;
//     policyNumber: string;
//     coverageDetails?: string;
//     groupNumber?: string;
//   };
//   medicalHistory?: string;
//   registrationDate?: string;
//   paymentInfo?: {
//     selectedPaymentMethod?: string;
//     paymentMethods?: string[];
//     paymentAmounts?: { [key: string]: number };
//     creditAmount?: number;
//     totalAmount?: number;
//     totalPaid?: number;
//     remainingBalance?: number;
//     processedBy?: string;
//     processedById?: string;
//     processedAt?: string;
//   };
// }

// export interface TestType {
//   id: string;
//   name: string;
//   price: number;
//   prices: {
//     "walk-in": number;
//     referral: number;
//     hmo: number;
//     hospital: number;
//     corporate: number;
//   };
//   duration: number;
//   department: string;
//   description?: string;
// }

// export interface Appointment {
//   id: string;
//   patientId: string;
//   doctorId: string;
//   date: string;
//   time: string;
//   tests: TestType[];
//   status: "scheduled" | "in-progress" | "lab-completed" | "completed" | "cancelled";
//   doctorApproved: boolean;
//   labAssigned: boolean;
//   assignedLabTech?: string;
//   approvedAt?: string;
//   doctorSignature?: string;
//   doctorComments?: string;
//   finalizedAt?: string;
//   remarks?: string;
//   results?: string[];
//   rescheduleHistory?: {
//     originalDate: string;
//     originalTime: string;
//     newDate: string;
//     newTime: string;
//     timestamp: string;
//     reason?: string;
//   }[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface Doctor {
//   id: string;
//   name: string;
//   specialty: string;
//   profileImage: string;
//   availability: boolean;
//   nextAvailable?: string;
// }

// interface AppointmentContextType {
//   patients: Patient[];
//   appointments: Appointment[];
//   doctors: Doctor[];
//   addPatient: (patient: Patient) => void;
//   addAppointment: (appointment: Appointment) => void;
//   updateAppointment: (id: string, updates: Partial<Appointment>) => void;
//   getPatientById: (id: string) => Patient | undefined;
//   getAppointmentsByDoctor: (doctorId: string) => Appointment[];
//   getAppointmentsByDate: (date: string) => Appointment[];
//   getPatientsByFrontDesk: (frontDeskId: string) => Patient[];
//   getAppointmentsByFrontDesk: (frontDeskId: string) => Appointment[];
//   rescheduleAppointment: (id: string, newDate: string, newTime: string, reason?: string) => void;
//   approveForLab: (appointmentId: string) => void;
//   getApprovedAppointments: () => Appointment[];
//   availableTests: TestType[];
//   getDiscountPercent: (category: Patient["category"]) => number;
//   refreshTests: (options?: { category?: string; search?: string }) => Promise<void>;
// }

// const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// const mockDoctors: Doctor[] = [
//   { id: "2", name: "Dr. Sesan", specialty: "", profileImage: "", availability: true },
//   { id: "3", name: "Dr. Abigail", specialty: "", profileImage: "", availability: true },
//   { id: "7", name: "Dr. Kuti", specialty: "", profileImage: "", availability: true, nextAvailable: "2025-01-15" },
//   { id: "8", name: "Dr. Oduyemi", specialty: "", profileImage: "", availability: true }
// ];

// export function AppointmentProvider({ children }: { children: ReactNode }) {
//   // Load patients from localStorage or use defaults
//   const [patients, setPatients] = useState<Patient[]>(() => {
//     const saved = localStorage.getItem("patients");
//     if (saved) return JSON.parse(saved);
//     return [];
//   });

//   // Save patients whenever they change
//   useEffect(() => {
//     localStorage.setItem("patients", JSON.stringify(patients));
//   }, [patients]);

//   // Load appointments from localStorage or use defaults
//   const [appointments, setAppointments] = useState<Appointment[]>(() => {
//     const saved = localStorage.getItem("appointments");
//     if (saved) return JSON.parse(saved);
//     return [];
//   });

//   // Save appointments whenever they change
//   useEffect(() => {
//     localStorage.setItem("appointments", JSON.stringify(appointments));
//   }, [appointments]);

//   const [doctors] = useState<Doctor[]>(mockDoctors);

//   const addPatient = (patient: Patient) => {
//     setPatients(prev => [...prev, patient]);
//   };

//   const addAppointment = (appointment: Appointment) => {
//     const newAppointment = {
//       ...appointment,
//       doctorApproved: appointment.doctorApproved || false,
//       labAssigned: appointment.labAssigned || false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };
//     setAppointments(prev => [...prev, newAppointment]);
//   };

//   const updateAppointment = (id: string, updates: Partial<Appointment>) => {
//     setAppointments(prev =>
//       prev.map(appointment =>
//         appointment.id === id ? { ...appointment, ...updates, updatedAt: new Date().toISOString() } : appointment
//       )
//     );
//   };

//   const getPatientById = (id: string) => patients.find(patient => patient.id === id);

//   const getAppointmentsByDoctor = (doctorId: string) =>
//     appointments.filter(appointment => appointment.doctorId === doctorId);

//   const getAppointmentsByDate = (date: string) =>
//     appointments.filter(appointment => appointment.date === date);

//   const rescheduleAppointment = (id: string, newDate: string, newTime: string, reason?: string) => {
//     setAppointments(prev =>
//       prev.map(appointment =>
//         appointment.id === id
//           ? {
//               ...appointment,
//               date: newDate,
//               time: newTime,
//               updatedAt: new Date().toISOString(),
//               rescheduleHistory: [
//                 ...(appointment.rescheduleHistory || []),
//                 {
//                   originalDate: appointment.date,
//                   originalTime: appointment.time,
//                   newDate,
//                   newTime,
//                   timestamp: new Date().toISOString(),
//                   reason
//                 }
//               ]
//             }
//           : appointment
//       )
//     );
//   };

//   const approveForLab = (appointmentId: string) => {
//     setAppointments(prev =>
//       prev.map(appointment =>
//         appointment.id === appointmentId
//           ? { ...appointment, doctorApproved: true, labAssigned: true, updatedAt: new Date().toISOString() }
//           : appointment
//       )
//     );
//   };

//   const getApprovedAppointments = () =>
//     appointments.filter(appointment => appointment.doctorApproved && appointment.labAssigned);

//   const getPatientsByFrontDesk = (frontDeskId: string) =>
//     patients.filter(patient => patient.registeredById === frontDeskId);

//   const getAppointmentsByFrontDesk = (frontDeskId: string) =>
//     appointments.filter(appointment => {
//       const patient = getPatientById(appointment.patientId);
//       return patient?.registeredById === frontDeskId;
//     });

//   const [availableTests, setAvailableTests] = useState<TestType[]>([]);

//   const refreshTests = async (options?: { category?: string; search?: string }) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     try {
//       const data = await fetchTests(token, options);
//       setAvailableTests(data.tests);
//     } catch (err) {
//       console.error("Error fetching tests", err);
//     }
//   };

//   const getDiscountPercent = (category: Patient["category"]) => {
//     const discounts = {
//       "walk-in": 0,
//       referral: 10,
//       corporate: 15,
//       hmo: 30,
//       hospital: 20,
//       staff: 50
//     };
//     return discounts[category] || 0;
//   };

//   useEffect(() => {
//     refreshTests();
//   }, []);

//   return (
//     <AppointmentContext.Provider
//       value={{
//         patients,
//         appointments,
//         doctors,
//         addPatient,
//         addAppointment,
//         updateAppointment,
//         getPatientById,
//         getAppointmentsByDoctor,
//         getAppointmentsByDate,
//         getPatientsByFrontDesk,
//         getAppointmentsByFrontDesk,
//         rescheduleAppointment,
//         approveForLab,
//         getApprovedAppointments,
//         availableTests,
//         getDiscountPercent,
//         refreshTests
//       }}
//     >
//       {children}
//     </AppointmentContext.Provider>
//   );
// }

// export function useAppointments() {
//   const context = useContext(AppointmentContext);
//   if (!context) throw new Error("useAppointments must be used within an AppointmentProvider");
//   return context;
// }

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import io from "socket.io-client";
import { fetchTests } from "../services/testService";
import doctorImg from "../assets/doctor.png";


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
    results: { data: string; notes: string }
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

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [availableTests, setAvailableTests] = useState<TestType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          axios.get("https://pms-backend-postgresql.onrender.com/api/patients"),
          axios.get("https://pms-backend-postgresql.onrender.com/api/appointments"),
        ]);
        setPatients(patientsRes.data);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();

    const socket = io("https://pms-backend-postgresql.onrender.com");
    socket.on("appointments-changed", () => {
      fetchData();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const addPatient = async (patient: Patient) => {
    try {
      const res = await axios.post(
        "https://pms-backend-postgresql.onrender.com/api/patients",
        patient
      );
      setPatients((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding patient", err);
    }
  };

  const addAppointment = async (appointment: Appointment) => {
    try {
      const newAppointment = {
        ...appointment,
        doctorApproved: appointment.doctorApproved || false,
        labAssigned: appointment.labAssigned || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const res = await axios.post(
        "https://pms-backend-postgresql.onrender.com/api/appointments",
        newAppointment
      );
      setAppointments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding appointment", err);
    }
  };

  const updateAppointment = async (
    id: string,
    updates: Partial<Appointment>
  ) => {
    try {
      await axios.put(`https://pms-backend-postgresql.onrender.com/api/appointments/${id}`, updates);
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : appointment
        )
      );
    } catch (err) {
      console.error("Error updating appointment", err);
    }
  };

  const submitTestResults = async (
    id: string,
    results: { data: string; notes: string }
  ) => {
    try {
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
      await axios.put(
        `https://pms-backend-postgresql.onrender.com/api/appointments/${id}/results`,
        updates
      );
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                ...updates,
                status: "lab-completed",
                updatedAt: new Date().toISOString(),
              }
            : appointment
        )
      );
    } catch (err) {
      console.error("Error submitting test results", err);
    }
  };

  const getPatientById = (id: string) =>
    patients.find((patient) => patient.id === id);

  const getAppointmentsByDoctor = (doctorId: string) =>
    appointments.filter((appointment) => appointment.doctorId === doctorId);

  const getAppointmentsByTechnician = (technicianId: string) =>
    appointments.filter(
      (appointment) =>
        appointment.assignedLabTech === technicianId && appointment.labAssigned
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

  const rescheduleAppointment = async (
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
    await updateAppointment(id, updates);
  };

  const approveForLab = async (
    appointmentId: string,
    labTechnicianId?: string
  ) => {
    const updates: Partial<Appointment> = {
      doctorApproved: true,
      labAssigned: true,
      status: "in-progress" as Appointment["status"],
      assignedLabTech: labTechnicianId,
      approvedAt: new Date().toISOString(),
    };
    try {
      await axios.post(
        `https://pms-backend-postgresql.onrender.com/api/appointments/${appointmentId}/assign`,
        { labTechnicianId }
      );
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : appointment
        )
      );
    } catch (err) {
      console.error("Error approving for lab", err);
    }
  };

  const getApprovedAppointments = () =>
    appointments.filter(
      (appointment) => appointment.doctorApproved && appointment.labAssigned
    );

  const getDiscountPercent = (category: Patient["category"]) => {
    const discounts = {
      "walk-in": 0,
      referral: 10,
      corporate: 15,
      hmo: 30,
      hospital: 20,
      staff: 50,
    };
    return discounts[category] || 0;
  };

  const refreshTests = async (options?: {
    category?: string;
    search?: string;
  }) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await fetchTests(token, options);
      const tests = (data as { tests: TestType[] }).tests;
      setAvailableTests(tests);
    } catch (err) {
      console.error("Error fetching tests", err);
    }
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
  if (!context)
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  return context;
}
