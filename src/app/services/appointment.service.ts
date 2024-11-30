import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Appointment } from '../models/GetAllAppointments.model'
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private todayAppointments = '/api/HospitalAppointment/GetTodaysAppointments';
  private allAppointments = '/api/HospitalAppointment/GetAllAppointments';

  constructor(private http: HttpClient) {
    console.log('DashboardService initialized'); // Servisin çalışıp çalışmadığını kontrol et
  }

  getTodayAppointments(): Observable<Appointment[]>{
    return this.http.get<{ message: string; result: boolean; data: Appointment[] }>(this.todayAppointments).pipe(
      map(response => response.data) // Sadece 'data' kısmını al
    ); 
  }

  getAllAppointments(): Observable<Appointment[]>{
    return this.http.get<{ message: string; result: boolean; data: Appointment[] }>(this.allAppointments).pipe(
      map(response => response.data)
    ); 
  }
}
