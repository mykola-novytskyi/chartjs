import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BetsTypeDTO } from './bets-type-dto.interface';
import { Period } from '../time-period';

@Injectable({
  providedIn: 'root',
})
export class BetsTypeService {
  #http = inject(HttpClient);

  fetchBetsType(period: Period): Observable<BetsTypeDTO[]> {
    return this.#http.get<BetsTypeDTO[]>(`http://localhost:3000/api/dashboard/bet-types`, {
      params: { ...period },
    });
  }
}
