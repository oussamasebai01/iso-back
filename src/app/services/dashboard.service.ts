import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  overallTurnoverRate: number;
  overallTrainingCompletionRate: number;
  overallAveragePerformance: number;
  departments: {
    [department: string]: {
      turnoverRate: number;
      trainingCompletionRate: number;
      performanceMetrics: { [name: string]: number };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8070/api/hr/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(startDate: string, endDate: string): Observable<DashboardData> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<DashboardData>(this.apiUrl, { params });
  }
}