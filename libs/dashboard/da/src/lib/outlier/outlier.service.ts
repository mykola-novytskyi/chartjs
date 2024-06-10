import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Period } from '../time-period';
import { Outlier, OutlierType } from './outlier.models';

@Injectable({
  providedIn: 'root',
})
export class OutlierService {
  #http = inject(HttpClient);

  fetchOutliers(period: Period, tab: OutlierType): Observable<Outlier[]> {
    return this.#http.get<Outlier[]>(`http://localhost:3000/api/dashboard/biggest-winner-losers`, {
      params: { ...period, tab },
    });
  }
}
