import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BetDTO, BetTab } from './bet.models';
import { Period } from '../time-period';

@Injectable({
  providedIn: 'root',
})
export class BetService {
  #http = inject(HttpClient);

  fetchBets(period: Period, tab: BetTab): Observable<BetDTO> {
    return this.#http.get<BetDTO>(`http://localhost:3000/api/dashboard/bets`, {
      params: { ...period, tab },
    });
  }
}
