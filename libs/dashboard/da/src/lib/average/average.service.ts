import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphData } from './average.interface';
import { TimePeriodType } from '../time-period';

@Injectable({
  providedIn: 'root',
})
export class AverageService {
  #http = inject(HttpClient);

  fetchAverageDeposit(timePeriod: TimePeriodType): Observable<GraphData[]> {
    return this.#http.get<GraphData[]>(`http://localhost:3000/api/dashboard/deposit-line-chart`, {
      params: { timePeriod },
    });
  }

  fetchCustomAverageDeposit(startDate: string, endDate: string): Observable<GraphData[]> {
    return this.#http.get<GraphData[]>(`http://localhost:3000/api/dashboard/deposit-line-chart`, {
      params: { startDate, endDate },
    });
  }

  fetchAverageWithdrawal(timePeriod: TimePeriodType): Observable<GraphData[]> {
    return this.#http.get<GraphData[]>(`http://localhost:3000/api/dashboard/withdraw-line-chart`, {
      params: { timePeriod },
    });
  }

  fetchCustomAverageWithdrawal(startDate: string, endDate: string): Observable<GraphData[]> {
    return this.#http.get<GraphData[]>(`http://localhost:3000/api/dashboard/withdraw-line-chart`, {
      params: { startDate, endDate },
    });
  }

  fetchAverageBets(timePeriod: TimePeriodType): Observable<GraphData[]> {
    return this.#http.get<GraphData[]>(`http://localhost:3000/api/dashboard/sb-line-chart`, { params: { timePeriod } });
  }

  fetchCustomAverageBets(startDate: string, endDate: string): Observable<GraphData[]> {
    return this.#http.get<GraphData[]>(`http://localhost:3000/api/dashboard/sb-line-chart`, {
      params: { startDate, endDate },
    });
  }
}
