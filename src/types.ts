export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;   // format: "YYYY-MM-DD"
  time: string;   // format: "HH:mm"
  status: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed';
}