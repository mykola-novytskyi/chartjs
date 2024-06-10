import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { TimePeriodFacade } from '../time-period';

import { Visitors } from './visitors.interface';
import { StoreProvider } from '@chartjs/providers';

interface VisitorsState {
  visitors: Visitors;
}

@Injectable()
export class VisitorsFacade extends StoreProvider<VisitorsState> {
  #http = inject(HttpClient);
  #timePeriodFacade = inject(TimePeriodFacade);


  readonly visitors: Signal<{ [key: string]: number[] }> = this.selectSignal(({ visitors }) => visitors);

  #getVisitors$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(() =>
        this.#http
          .get<Visitors>(`http://localhost:3000/api/dashboard/visitors`, {
            params: { ...this.#timePeriodFacade.comparisonPeriod() },
          })
          .pipe(
            tap((visitors) => this.patchState({ visitors })),
            tapResponse(this.setLoaded, this.setError),
          ),
      ),
    ),
  );

  constructor() {
    super({
      visitors: {} as Visitors,
    });
  }
}
