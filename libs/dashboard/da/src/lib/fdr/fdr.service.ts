import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimePeriodType } from '../time-period';
import { FDR } from './fdr.interface';

@Injectable({
  providedIn: 'root',
})
export class FDRService {
  #http = inject(HttpClient);

  fetchFDR(timePeriod: TimePeriodType): Observable<FDR> {
    return this.#http.get<FDR>(`http://localhost:3000/api/dashboard/fdr`, { params: { timePeriod } });
  }

  fetchFDRForCustomPeriod(startDate: string, endDate: string): Observable<FDR> {
    return this.#http.get<FDR>(`http://localhost:3000/api/dashboard/fdr`, {
      params: { startDate, endDate },
    });
  }
}
