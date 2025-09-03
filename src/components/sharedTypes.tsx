// sharedTypes.ts
export interface Patient {
  id: string;
  name: string;
  email: string;
  category: string;
}

export interface Test {
  id: string;
  name: string;
  price: number;
  status: 'pending'|'assigned'|'in-progress'|'completed'|'rejected';
  department: string;
  priority: 'low'|'normal'|'high';
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled'|'in-progress'|'lab-completed'|'completed';
  tests: Test[];
  doctorApproved: boolean;
  labAssignmentId?: string;
}

export interface LabAssignment {
  id: string;
  appointmentId: string;
  doctorId: string;
  labTechId?: string;
  patientId: string;
  tests: Test[];
  status: 'assigned'|'in-progress'|'completed'|'pending-qa';
  assignedAt: string;
  completedAt?: string;
  sampleId?: string;
  sampleStatus?: 'received'|'pending'|'rejected';
}