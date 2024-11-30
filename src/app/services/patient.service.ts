import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Patients } from '../models/GetAllPatients.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private getApiUrl = '/api/HospitalAppointment/GetAllPatients';
  private updateApiUrl = '/api/HospitalAppointment/UpdatePatient';
  private addNewApiUrl = '/api/HospitalAppointment/AddNewPatient';

  constructor(private http: HttpClient) {
    console.log('DashboardService initialized');
  }

  getAllPatient(): Observable<Patients[]> {
    return this.http.get<{ message: string; result: boolean; data: Patients[] }>(this.getApiUrl).pipe(
      map(response => response.data)
    );
  }

  updatePatient(patient: Patients): Observable<{ message: string; result: boolean; data: Patients }> {
    return this.http.post<{ message: string; result: boolean; data: Patients }>(this.updateApiUrl, patient);
  }

  addNewPatient(patient: Patients): Observable<{ message: string; result: boolean; data: Patients }> {
    return this.http.post<{ message: string; result: boolean; data: Patients }>(this.addNewApiUrl, patient);
  }

  deletePatientById(patientId: string | number): Observable<any> {
    const url = `/api/HospitalAppointment/DeletePatientByPatienId?patientId=${patientId}`;
return this.http.delete(url);
  }
}
