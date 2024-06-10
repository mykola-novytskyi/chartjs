import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveUser } from './active-users.models';
import { Period } from '../time-period';

@Injectable({
  providedIn: 'root',
})
export class ActiveUsersService {
  #http = inject(HttpClient);

  fetchActiveUsersForCustomPeriod(period: Period): Observable<ActiveUser> {
    return this.#http.get<ActiveUser>(`http://localhost:3000/api/dashboard/active-clients`, {
      params: { ...period },
    });
  }
}
