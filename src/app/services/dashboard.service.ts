import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GetDashboardData } from '../models/GetDashboardData.model';


@Injectable({
  providedIn: 'root' // Servis, root seviyesinde sağlanır
})
export class DashboardService {

  private apiUrl = '/api/HospitalAppointment/GetDashboardData';


  constructor(private http: HttpClient) {
    console.log('DashboardService initialized'); // Servisin çalışıp çalışmadığını kontrol et
  }

  getDashboardData(): Observable<GetDashboardData[]> {
    return this.http.get<{ message: string; result: boolean; data: GetDashboardData[] }>(this.apiUrl).pipe(
      map(response => response.data) // Sadece 'data' kısmını al
    );
  }
}