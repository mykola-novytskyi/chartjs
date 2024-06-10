import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { TimePeriodFacade } from '../time-period';
import { GGR } from './ggr.interface';
import { StoreProvider } from '@chartjs/providers';

interface GGRState {
  data: GGR;
}

@Injectable()
export class GGRFacade extends StoreProvider<GGRState> {
  #http = inject(HttpClient);
  #timePeriodFacade = inject(TimePeriodFacade);

  readonly ggr: Signal<{ [key: string]: number[] }> = this.selectSignal(({ data }) => {
    const ggr: { [key: string]: number[] } = {};
    Object.keys(data).forEach((label) => {
      const graphData: number[] = [];
      data[label].forEach((value, index) => {
        graphData.push(value);
        if (index === 1) {
          graphData.push(graphData[0] + value);
        }
      });

      ggr[label] = graphData;
    });
    return ggr;
  });

  #getGgr$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(() =>
        this.#http
          .get<GGR>(`http://localhost:3000/api/dashboard/ggr`, {
            params: { ...this.#timePeriodFacade.comparisonPeriod() },
          })
          .pipe(
            tap((data) => this.patchState({ data })),
            tapResponse(this.setLoaded, this.setError),
          ),
      ),
    ),
  );

  constructor() {
    super({
      data: {} as GGR,
    });
  }
}
