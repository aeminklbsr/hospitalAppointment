export interface Appointment {
    appointmentDate: string ;  // Tarih formatında saklanabilir
    appointmentId: number;
    appointmentTime: string;
    isFirstVisit: boolean;
    naration: string;
    name: string;
    patientId: number;
    mobileNo: string;
    isDone: boolean;
    appointmentNo: number;
  }