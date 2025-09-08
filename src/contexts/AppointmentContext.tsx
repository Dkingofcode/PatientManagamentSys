import React, { createContext, useContext, useEffect, useState } from "react";
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
  submitReport: (
    appointmentId: string,
    report: { file: File; notes: string; uploadedAt: string }
  ) => Promise<void>;
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

const dummyPatients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+2341234567890",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    category: "walk-in",
    insurance: { provider: "HealthCorp", policyNumber: "HC123456" },
  },
  {
    id: "p2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+2340987654321",
    dateOfBirth: "1990-03-22",
    gender: "Female",
    category: "referral",
    insurance: { provider: "MediCare", policyNumber: "MC987654" },
  },
  {
    id: "p3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+2345551234567",
    dateOfBirth: "1978-11-10",
    gender: "Female",
    category: "hmo",
    insurance: { provider: "HMOPlus", policyNumber: "HMO456789" },
  },
  {
    id: "p4",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    phone: "+2347779876543",
    dateOfBirth: "1982-07-30",
    gender: "Male",
    category: "corporate",
    insurance: { provider: "CorpHealth", policyNumber: "CH123789" },
  },
  {
    id: "p5",
    name: "Emma Brown",
    email: "emma.brown@example.com",
    phone: "+2346664567890",
    dateOfBirth: "1995-01-25",
    gender: "Female",
    category: "hospital",
    insurance: { provider: "HospitalCare", policyNumber: "HC987123" },
  },
  {
    id: "p6",
    name: "Michael Davis",
    email: "michael.davis@example.com",
    phone: "+2344443219876",
    dateOfBirth: "1988-09-12",
    gender: "Male",
    category: "walk-in",
    insurance: { provider: "HealthCorp", policyNumber: "HC456123" },
  },
];

const dummyTestAssignments: Appointment[] = [
  {
    id: "1",
    patientId: "p1",
    patientName: "John Doe",
    doctorId: "7",
    date: "2025-09-04",
    time: "09:00",
    tests: [
      {
        id: "t1",
        name: "Complete Blood Count",
        price: 50,
        prices: {
          "walk-in": 50,
          referral: 45,
          hmo: 40,
          hospital: 42,
          corporate: 48,
        },
        duration: 30,
        department: "Hematology",
      },
      {
        id: "t2",
        name: "Lipid Panel",
        price: 60,
        prices: {
          "walk-in": 60,
          referral: 55,
          hmo: 50,
          hospital: 52,
          corporate: 58,
        },
        duration: 45,
        department: "Biochemistry",
      },
    ],
    status: "in-progress",
    priority: "high",
    department: "Hematology",
    sampleId: "SMP001",
    sampleStatus: "received",
    sampleCondition: "Good",
    approvedAt: "2025-09-04T08:00:00Z",
    startTime: "2025-09-04T09:00:00Z",
    completionTime: undefined,
    qcStatus: "pending",
    technicianNotes:
      "Sample processed on CBC Analyzer. Awaiting lipid panel results.",
    doctorApproved: true,
    labAssigned: true,
    assignedLabTech: "tech1",
    doctorComments: "Urgent processing required.",
    createdAt: "2025-09-04T07:00:00Z",
    updatedAt: "2025-09-04T09:00:00Z",
  },
  {
    id: "2",
    patientId: "p2",
    patientName: "Jane Smith",
    doctorId: "8",
    date: "2025-09-03",
    time: "11:00",
    tests: [
      {
        id: "t3",
        name: "Urinalysis",
        price: 30,
        prices: {
          "walk-in": 30,
          referral: 27,
          hmo: 25,
          hospital: 26,
          corporate: 28,
        },
        duration: 20,
        department: "Biochemistry",
      },
    ],
    status: "lab-completed",
    priority: "normal",
    department: "Biochemistry",
    sampleId: "SMP002",
    sampleStatus: "received",
    sampleCondition: "Slightly hemolyzed",
    approvedAt: "2025-09-03T10:00:00Z",
    startTime: "2025-09-03T11:00:00Z",
    completionTime: "2025-09-03T14:00:00Z",
    qcStatus: "passed",
    technicianNotes: "Urinalysis completed. Results within normal range.",
    doctorApproved: true,
    labAssigned: true,
    assignedLabTech: "tech1",
    doctorComments: "Results look stable.",
    createdAt: "2025-09-03T09:00:00Z",
    updatedAt: "2025-09-03T14:00:00Z",
  },
  {
    id: "3",
    patientId: "p3",
    patientName: "Alice Johnson",
    doctorId: "7",
    date: "2025-09-02",
    time: "08:00",
    tests: [
      {
        id: "t4",
        name: "Blood Glucose",
        price: 25,
        prices: {
          "walk-in": 25,
          referral: 22,
          hmo: 20,
          hospital: 21,
          corporate: 23,
        },
        duration: 15,
        department: "Biochemistry",
      },
    ],
    status: "completed",
    priority: "low",
    department: "Biochemistry",
    sampleId: "SMP003",
    sampleStatus: "received",
    sampleCondition: "Good",
    approvedAt: "2025-09-02T07:30:00Z",
    startTime: "2025-09-02T08:00:00Z",
    completionTime: "2025-09-02T09:30:00Z",
    qcStatus: "passed",
    technicianNotes: "Blood glucose test completed. Doctor approved.",
    doctorApproved: true,
    labAssigned: true,
    assignedLabTech: "tech1",
    doctorComments: "Approved for patient records.",
    createdAt: "2025-09-02T07:00:00Z",
    updatedAt: "2025-09-02T09:30:00Z",
  },
  {
    id: "4",
    patientId: "p4",
    patientName: "Bob Williams",
    doctorId: "8",
    date: "2025-09-05",
    time: "10:00",
    tests: [
      {
        id: "t5",
        name: "Thyroid Function Test",
        price: 70,
        prices: {
          "walk-in": 70,
          referral: 65,
          hmo: 60,
          hospital: 62,
          corporate: 68,
        },
        duration: 60,
        department: "Immunology",
      },
    ],
    status: "in-progress",
    priority: "normal",
    department: "Immunology",
    sampleId: "SMP004",
    sampleStatus: "pending",
    sampleCondition: "Not specified",
    approvedAt: "2025-09-05T06:00:00Z",
    startTime: undefined,
    completionTime: undefined,
    qcStatus: undefined,
    technicianNotes: "Sample collection scheduled for today.",
    doctorApproved: true,
    labAssigned: true,
    assignedLabTech: "tech1",
    doctorComments: "Awaiting sample collection.",
    createdAt: "2025-09-05T05:00:00Z",
    updatedAt: "2025-09-05T06:00:00Z",
  },
  {
    id: "5",
    patientId: "p5",
    patientName: "Emma Brown",
    doctorId: "7",
    date: "2025-09-04",
    time: "13:00",
    tests: [
      {
        id: "t6",
        name: "Microbiology Culture",
        price: 80,
        prices: {
          "walk-in": 80,
          referral: 75,
          hmo: 70,
          hospital: 72,
          corporate: 78,
        },
        duration: 120,
        department: "Microbiology",
      },
    ],
    status: "in-progress",
    priority: "high",
    department: "Microbiology",
    sampleId: "SMP005",
    sampleStatus: "received",
    sampleCondition: "Good",
    approvedAt: "2025-09-04T12:00:00Z",
    startTime: "2025-09-04T13:00:00Z",
    completionTime: undefined,
    qcStatus: "pending",
    technicianNotes:
      "Culture in progress. Preliminary results expected tomorrow.",
    doctorApproved: true,
    labAssigned: true,
    assignedLabTech: "tech1",
    doctorComments: "Monitor culture closely.",
    createdAt: "2025-09-04T11:00:00Z",
    updatedAt: "2025-09-04T13:00:00Z",
  },
  {
    id: "6",
    patientId: "p6",
    patientName: "Michael Davis",
    doctorId: "8",
    date: "2025-09-03",
    time: "10:00",
    tests: [
      {
        id: "t7",
        name: "Electrolyte Panel",
        price: 55,
        prices: {
          "walk-in": 55,
          referral: 50,
          hmo: 45,
          hospital: 47,
          corporate: 53,
        },
        duration: 40,
        department: "Biochemistry",
      },
    ],
    status: "lab-completed",
    priority: "normal",
    department: "Biochemistry",
    sampleId: "SMP006",
    sampleStatus: "received",
    sampleCondition: "Good",
    approvedAt: "2025-09-03T09:00:00Z",
    startTime: "2025-09-03T10:00:00Z",
    completionTime: "2025-09-03T12:00:00Z",
    qcStatus: "failed",
    technicianNotes:
      "Electrolyte panel completed, but QC failed. Retesting required.",
    doctorApproved: true,
    labAssigned: true,
    assignedLabTech: "tech1",
    doctorComments: "Retest due to QC failure.",
    createdAt: "2025-09-03T08:00:00Z",
    updatedAt: "2025-09-03T12:00:00Z",
  },
];


export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(dummyPatients);
  const [appointments, setAppointments] =
  useState<Appointment[]>(dummyTestAssignments);
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [availableTests, setAvailableTests] = useState<TestType[]>([]);
  const [results, setResults] = useState([]);


  // Use useEffect to set state only when dummyTestAssignments changes
  useEffect(() => {
    const tests = dummyTestAssignments.flatMap((dummyTests) => dummyTests.tests);
    console.log(tests);
    setAvailableTests(tests);
  }, []); // Empty dependency array ensures this runs only once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/patients"),
          axios.get("http://localhost:8000/api/appointments"),
        ]);
        setPatients(patientsRes.data);
        setAppointments(appointmentsRes.data);

        await fetchResults();
      } catch (err) {
        console.error("Error fetching data", err);
        // Fallback to dummy data if API fails
        setPatients(dummyPatients);
        //setAppointments(dummyTestAssignments);
      }
    };
    fetchData();

  //   const socket = io("http://localhost:8000");
  //   socket.on("appointments-changed", () => {
  //     fetchData();
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
   }, []);

  const addPatient = async (patient: Patient) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/patients",
        patient,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
        "http://localhost:8000/api/appointments",
        newAppointment,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
      await axios.put(`http://localhost:8000/api/appointments/${id}`, updates, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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
        `http://localhost:8000/api/appointments/${id}/results`,
        updates,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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

  const submitReport = async (
    testRequestId: string,
    report: {
      file: File;
      interpretation: string;
      comments: string;
      qualityControl: string;
    }
  ) => {
    try {
      const formData = new FormData();
      formData.append("resultFile", report.file); // 🔑 must match upload.single('resultFile')
      formData.append("testRequestId", "f39e7349-6e5b-422a-b66c-54369baef968");
      formData.append("interpretation", report.interpretation);
      formData.append("comments", report.comments);
      formData.append("qualityControl", report.qualityControl);
      console.log(localStorage.getItem("token"));
      await axios.post(
        `http://localhost:8000/api/lab-tech/submit-result/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === testRequestId
            ? {
                ...appt,
                technicianNotes: report.comments,
                updatedAt: new Date().toISOString(),
              }
            : appt
        )
      );
    } catch (err) {
      console.error("Error submitting report", err);
      throw err;
    }
  };

  const fetchResults = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot fetch results");
      return;
    }

    const response = await axios.get(`http://localhost:8000/api/results`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // API returns { results, pagination }
    const fetchedResults = response.data.results || [];

    setResults(fetchedResults);

  } catch (err) {
    console.error("Error fetching results", err);
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
        `http://localhost:8000/api/appointments/${appointmentId}/assign`,
        { labTechnicianId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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

  // const refreshTests = async (options?: {
  //   category?: string;
  //   search?: string;
  // }) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;
  //   try {
  //     const data = await fetchTests(token, options);
  //    // const tests = (data as { tests: TestType[] }).tests;
  //    const tests = [];
  //    setAvailableTests(tests);
  //   } catch (err) {
  //     console.error("Error fetching tests", err);
  //     // Fallback to mock tests
  //     setAvailableTests([
  //       {
  //         id: "t1",
  //         name: "Complete Blood Count",
  //         price: 50,
  //         prices: {
  //           "walk-in": 50,
  //           referral: 45,
  //           hmo: 40,
  //           hospital: 42,
  //           corporate: 48,
  //         },
  //         duration: 30,
  //         department: "Hematology",
  //       },
  //       {
  //         id: "t2",
  //         name: "Lipid Panel",
  //         price: 60,
  //         prices: {
  //           "walk-in": 60,
  //           referral: 55,
  //           hmo: 50,
  //           hospital: 52,
  //           corporate: 58,
  //         },
  //         duration: 45,
  //         department: "Biochemistry",
  //       },
  //       {
  //         id: "t3",
  //         name: "Urinalysis",
  //         price: 30,
  //         prices: {
  //           "walk-in": 30,
  //           referral: 27,
  //           hmo: 25,
  //           hospital: 26,
  //           corporate: 28,
  //         },
  //         duration: 20,
  //         department: "Biochemistry",
  //       },
  //       {
  //         id: "t4",
  //         name: "Blood Glucose",
  //         price: 25,
  //         prices: {
  //           "walk-in": 25,
  //           referral: 22,
  //           hmo: 20,
  //           hospital: 21,
  //           corporate: 23,
  //         },
  //         duration: 15,
  //         department: "Biochemistry",
  //       },
  //       {
  //         id: "t5",
  //         name: "Thyroid Function Test",
  //         price: 70,
  //         prices: {
  //           "walk-in": 70,
  //           referral: 65,
  //           hmo: 60,
  //           hospital: 62,
  //           corporate: 68,
  //         },
  //         duration: 60,
  //         department: "Immunology",
  //       },
  //       {
  //         id: "t6",
  //         name: "Microbiology Culture",
  //         price: 80,
  //         prices: {
  //           "walk-in": 80,
  //           referral: 75,
  //           hmo: 70,
  //           hospital: 72,
  //           corporate: 78,
  //         },
  //         duration: 120,
  //         department: "Microbiology",
  //       },
  //       {
  //         id: "t7",
  //         name: "Electrolyte Panel",
  //         price: 55,
  //         prices: {
  //           "walk-in": 55,
  //           referral: 50,
  //           hmo: 45,
  //           hospital: 47,
  //           corporate: 53,
  //         },
  //         duration: 40,
  //         department: "Biochemistry",
  //       },
  //     ]);
  //   }
  // };

  // useEffect(() => {
  //   refreshTests();
  // }, []);

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
        submitReport,
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
        fetchResults
       // refreshTests,
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
