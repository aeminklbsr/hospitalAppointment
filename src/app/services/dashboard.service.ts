import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GetDashboardData } from '../models/GetDashboardData.model';
import { dashboardApi } from '../environments/dashbaordApi'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private dashboardDataApi: string = dashboardApi.dashboardDataApi

  constructor(private http: HttpClient) {
    console.log('DashboardService initialized');
  }

  getDashboardData(): Observable<GetDashboardData[]> {
    return this.http.get<{ message: string; result: boolean; data: GetDashboardData[] }>(this.dashboardDataApi).pipe(
      map(response => response.data)
    );
  }
}