import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../models/GetAllAppointments.model'
import { map, Observable } from 'rxjs';
import { appointmentApi } from '../environments/appointmentApi';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {

  private todayAppointments: string = appointmentApi.todayAppointments;
  private allAppointments: string = appointmentApi.allAppointments;
  private addAppointments: string = appointmentApi.addAppointments;
  private deleteAppointments: string = appointmentApi.deleteAppointments;
  private markAppointments: string = appointmentApi.markAppointments;

  constructor(private http: HttpClient) {
    console.log('AppointmentService initialized');
  }

  getTodayAppointments(): Observable<Appointment[]> {
    return this.http.get<{ message: string; result: boolean; data: Appointment[] }>(this.todayAppointments).pipe(
      map(response => response.data)
    );
  }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<{ message: string; result: boolean; data: Appointment[] }>(this.allAppointments).pipe(
      map(response => response.data)
    );
  }

  addNewAppointment(appointment: {
    name: string;
    mobileNo: string;
    city: string;
    age: number;
    gender: string;
    appointmentTime: string;
    naration: string;
    appointmentDate: string;
  }): Observable<{ message: string; result: boolean }> {
    return this.http.post<{ message: string; result: boolean }>(this.addAppointments, appointment);
  }

  deleteAppointment(appointmentId: number): Observable<{ message: string; result: boolean }> {
    const url = `${this.deleteAppointments}?appointmentId=${appointmentId}`;
    return this.http.delete<{ message: string; result: boolean }>(url);
  }

  markAppointmentDone(appointmentId: number): Observable<{ message: string; result: boolean }> {
    const url = `${this.markAppointments}?appointmentId=${appointmentId}`;
    return this.http.get<{ message: string; result: boolean }>(url, {});
  }
}