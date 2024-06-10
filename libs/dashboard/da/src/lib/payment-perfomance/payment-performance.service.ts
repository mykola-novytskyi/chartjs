import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentPerformance, PaymentPerformanceRequest } from './payment-performance.models';

@Injectable({
  providedIn: 'root',
})
export class PaymentPerformanceService {
  #http = inject(HttpClient);

  fetchIndicators(request: PaymentPerformanceRequest): Observable<PaymentPerformance> {
    return this.#http.get<PaymentPerformance>(`http://localhost:3000/api/dashboard/payment-indicator`, {
      params: { ...request },
    });
  }
}
