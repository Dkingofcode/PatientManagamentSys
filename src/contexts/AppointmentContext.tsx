import  { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  category: 'walk-in' | 'referral' |  'corporate' | 'hospital' | 'hmo';
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
  basePrice: number;
  prices: {
    'walk-in': number;
    'referral': number;
    'hmo': number;
    'hospital': number;
    'corporate': number;
  };
  duration: number; // in minutes
  department: string;
  description?: string; // Optional field for additional info
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  tests: TestType[];
  status: 'scheduled' | 'in-progress' | 'lab-completed' | 'completed' | 'cancelled';
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
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  profileImage: string;
  availability: boolean;
  nextAvailable?: string;
}

interface AppointmentContextType {
  patients: Patient[];
  appointments: Appointment[];
  doctors: Doctor[];
  addPatient: (patient: Patient) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  getPatientById: (id: string) => Patient | undefined;
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getAppointmentsByDate: (date: string) => Appointment[];
  getPatientsByFrontDesk: (frontDeskId: string) => Patient[];
  getAppointmentsByFrontDesk: (frontDeskId: string) => Appointment[];
  rescheduleAppointment: (id: string, newDate: string, newTime: string, reason?: string) => void;
  approveForLab: (appointmentId: string) => void;
  getApprovedAppointments: () => Appointment[];
  availableTests: TestType[];
  getTestPrice: (testId: string, category: Patient['category']) => number;
  getDiscountPercent: (category: Patient['category']) => number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

const mockDoctors: Doctor[] = [
  {
    id: '2',
    name: 'Dr. Michael Smith',
    specialty: 'Cardiology',
    profileImage: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Wilson',
    specialty: 'Radiology',
    profileImage: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: true,
  },
  {
    id: '7',
    name: 'Dr. David Chen',
    specialty: 'Orthopedics',
    profileImage: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: false,
    nextAvailable: '2025-01-15',
  },
  {
    id: '8',
    name: 'Dr. Sarah Davis',
    specialty: 'Neurology',
    profileImage: 'https://images.pexels.com/photos/4270088/pexels-photo-4270088.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    availability: true,
  },
];

export function AppointmentProvider({ children }: { children: ReactNode }) {
  // Initialize with some sample data for testing
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'P001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      category: 'walk-in',
      address: '123 Main St, City, State',
      registeredBy: 'Sarah Johnson',
      registeredById: '4',
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1-555-0123',
        relationship: 'Spouse',
      },
      insurance: {
        provider: 'Health Insurance Co.',
        policyNumber: 'HIC123456',
        coverageDetails: 'Full coverage for all tests',
        groupNumber: 'HIC-GROUP-001',
      },
      medicalHistory: 'No known allergies or chronic conditions',
        registrationDate: new Date().toISOString()
      },


    {
      id: 'P002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0124',
      dateOfBirth: '1990-07-22',
      gender: 'female',
      category: 'hmo',
      address: '456 Oak Ave, City, State',
      registeredBy: 'Mike Wilson',
      registeredById: '5',
      emergencyContact: {
        name: 'Emily Johnson',
        phone: '+1-555-0125',
        relationship: 'Sister',
      },
      insurance: {
        provider: 'HMO Health',
        policyNumber: 'HMO123456',
        coverageDetails: 'Partial coverage for lab tests',
        groupNumber: 'HMO-GROUP-002',
      },
      medicalHistory: 'Diabetic, on medication',
      registrationDate: new Date().toISOString()
    }
  ]);
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APT001',
      patientId: 'P001',
      doctorId: '2', // Dr. Michael Smith's ID
      date: new Date().toISOString().split('T')[0], // Today's date
      time: '10:00',
      tests: [
        { id: '1', name: 'Blood Test',  prices: {  // <-- Changed to `prices`
          'walk-in': 50,
          referral: 40,
          hmo: 45,
          hospital: 55,
          corporate: 30, // <-- Changed to `corporate`
        },
        basePrice: 40,
        department: 'Hematology',
         duration: 15 },
      
        { id: '2', name: 'Urine Test',  prices: {  // <-- Changed to `prices`
          'walk-in': 50,
          referral: 40,
          hmo: 45,
          hospital: 55,
          corporate: 30, // <-- Changed to `corporate`
        },
        basePrice: 30,
        department: 'Clinical Chemistry',
         duration: 10 }
      ],

      status: 'scheduled',
      doctorApproved: false,
      labAssigned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'APT002',
      patientId: 'P002',
      doctorId: '2', // Dr. Michael Smith's ID
      date: new Date().toISOString().split('T')[0], // Today's date
      time: '14:30',
      tests: [
        { id: '3', name: 'X-Ray', prices: {  // <-- Changed to `prices`
          'walk-in': 50,
          referral: 40,
          hmo: 45,
          hospital: 55,
          corporate: 30, // <-- Changed to `corporate`
        },
        basePrice: 30,
        department: 'Clinical Chemistry', duration: 20 }
      ],
      status: 'scheduled',
      doctorApproved: false,
      labAssigned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'APT003',
      patientId: 'P001',
      doctorId: '3', // Dr. Emily Wilson's ID
      date: new Date().toISOString().split('T')[0], // Today's date
      time: '11:00',
      tests: [
        { id: '4', name: 'CT Scan', prices: {  // <-- Changed to `prices`
          'walk-in': 50,
          referral: 40,
          hmo: 45,
          hospital: 55,
          corporate: 30, // <-- Changed to `corporate`
        },
        basePrice: 30,
        department: 'Clinical Chemistry', duration: 45 }
      ],
      status: 'in-progress',
      doctorApproved: true,
      labAssigned: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [doctors] = useState<Doctor[]>(mockDoctors);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const addAppointment = (appointment: Appointment) => {
    const newAppointment = {
      ...appointment,
      doctorApproved: appointment.doctorApproved || false,
      labAssigned: appointment.labAssigned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id ? { 
          ...appointment, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } : appointment
      )
    );
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  const getAppointmentsByDoctor = (doctorId: string) => {
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  };

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(appointment => appointment.date === date);
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string, reason?: string) => {
    setAppointments(prev => 
      prev.map(appointment => {
        if (appointment.id === id) {
          const rescheduleEntry = {
            originalDate: appointment.date,
            originalTime: appointment.time,
            newDate,
            newTime,
            timestamp: new Date().toISOString(),
            reason,
          };
          
          return {
            ...appointment,
            date: newDate,
            time: newTime,
            updatedAt: new Date().toISOString(),
            rescheduleHistory: [...(appointment.rescheduleHistory || []), rescheduleEntry],
          };
        }
        return appointment;
      })
    );
  };

  const approveForLab = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { 
              ...appointment, 
              doctorApproved: true, 
              labAssigned: true,
              updatedAt: new Date().toISOString()
            }
          : appointment
      )
    );
  };

  const getApprovedAppointments = () => {
    return appointments.filter(appointment => 
      appointment.doctorApproved === true && appointment.labAssigned === true
    );
  };

  const getPatientsByFrontDesk = (frontDeskId: string) => {
    return patients.filter(patient => patient.registeredById === frontDeskId);
  };

  const getAppointmentsByFrontDesk = (frontDeskId: string) => {
    return appointments.filter(appointment => {
      const patient = getPatientById(appointment.patientId);
      return patient?.registeredById === frontDeskId;
    });
  };

  const availableTests: TestType[] = [
    {
      id: '1',
      name: 'Complete Blood Count (CBC)',
      basePrice: 80,
      prices: {
        'walk-in': 80,
        'referral': 72,
        'hmo': 56,
        'hospital': 64,
        'corporate': 48, // <-- Changed to `corporate`
      },
      duration: 30,
      department: 'Hematology'
    },
    {
      id: '2',
      name: 'Urinalysis',
      basePrice: 50,
      prices: {
        'walk-in': 50,
        'referral': 45,
        'hmo': 35,
        'hospital': 40,
        'corporate': 30, // <-- Changed to `corporate`
      },
      duration: 20,
      department: 'Clinical Chemistry'
    },
    {
      id: '3',
      name: 'Chest X-Ray',
      basePrice: 120,
      prices: {
        'walk-in': 120,
        'referral': 108,
        'hmo': 84,
        'hospital': 96,
         'corporate': 72, // <-- Changed to `corporate`
      },
      duration: 15,
      department: 'Radiology'
    },
    {
      id: '4',
      name: 'Liver Function Test',
      basePrice: 100,
      prices: {
        'walk-in': 100,
        'referral': 90,
        'hmo': 70,
        'hospital': 80,
        'corporate': 60, // <-- Changed to `corporate`
      },
      duration: 25,
      department: 'Clinical Chemistry'
    },
    {
      id: '5',
      name: 'Lipid Profile',
      basePrice: 90,
      prices: {
        'walk-in': 90,
        'referral': 81,
        'hmo': 63,
        'hospital': 72,
        'corporate': 54, // <-- Changed to `corporate`
      },
      duration: 20,
      department: 'Clinical Chemistry'
    },
    {
      id: '6',
      name: 'Electrocardiogram (ECG)',
      basePrice: 70,
      prices: {
        'walk-in': 70,
        'referral': 63,
        'hmo': 49,
        'hospital': 56,
        'corporate': 42, // <-- Changed to `corporate`
      },
      duration: 15,
      department: 'Cardiology'
    },
    {
      id: '7',
      name: 'Abdominal Ultrasound',
      basePrice: 150,
      prices: {
        'walk-in': 150,
        'referral': 135,
        'hmo': 105,
        'hospital': 120,
        'corporate': 90, // <-- Changed to `corporate`
      },
      duration: 30,
      department: 'Radiology'
    },
    {
      id: '8',
      name: 'Blood Sugar (Fasting)',
      basePrice: 40,
      prices: {
        'walk-in': 40,
        'referral': 36,
        'hmo': 28,
        'hospital': 32,
        'corporate': 24, // <-- Changed to `corporate`
      },
      duration: 10,
      department: 'Clinical Chemistry'
    }
  ];

  const getTestPrice = (testId: string, category: Patient['category']) => {
    const test = availableTests.find(t => t.id === testId);
    if (!test) return 0;
    // Map mismatched categories
  const priceKeyMap: Record<Patient['category'], keyof typeof test.prices> = {
    'walk-in': 'walk-in',
    'referral': 'referral', // "referred" → "referral"
     // or another fallback
    'corporate': 'hmo', // or another fallback
    'hospital': 'hospital',
    'hmo': 'hmo',
  };

  const priceKey = priceKeyMap[category];
  return test.prices[priceKey] ?? test.basePrice;
  };

  const getDiscountPercent = (category: Patient['category']) => {
    const discounts = {
      'walk-in': 0,
      'referral': 10,
      'corporate': 15,
      'hmo': 30,
      'hospital': 20,
      'staff': 50
    };
    return discounts[category] || 0;
  };

  return (
    <AppointmentContext.Provider value={{
      patients,
      appointments,
      doctors,
      addPatient,
      addAppointment,
      updateAppointment,
      getPatientById,
      getAppointmentsByDoctor,
      getAppointmentsByDate,
      getPatientsByFrontDesk,
      getAppointmentsByFrontDesk,
      //getPatientsByFrontDesk,
      //getAppointmentsByFrontDesk,
      rescheduleAppointment,
      approveForLab,
      getApprovedAppointments,
      availableTests,
      getTestPrice,
      getDiscountPercent,
      //availableTests,
      //getTestPrice,
      //getDiscountPercent,
    }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}