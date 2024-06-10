import { inject, Injectable } from '@angular/core';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { Period, TimePeriodFacade } from '../time-period';

import { OutlierService } from './outlier.service';
import { Outlier, OutlierType } from './outlier.models';
import { StoreProvider } from '@chartjs/providers';

interface OutlierState {
  outliers: Outlier[];
  type: OutlierType;
}

@Injectable()
export class OutlierFacade extends StoreProvider<OutlierState> {
  /***************
   *   Selectors *
   ***************/
  readonly outliers = this.selectSignal(({ outliers }: OutlierState) => outliers);
  readonly currentTab$ = this.select(({ type }: OutlierState) => type);

  #timePeriodFacade = inject(TimePeriodFacade);

  #service = inject(OutlierService);
  /***************
   *   Effects   *
   ***************/
  #getOutliers$ = this.effect(() =>
    combineLatest([
      this.#timePeriodFacade.period$,
      this.currentTab$,
    ]).pipe(
      tap(this.setLoading),
      switchMap(([period, tab]: [Period, OutlierType]) =>
        this.#service.fetchOutliers(period, tab).pipe(
          tap((outliers) => this.patchState({ outliers: this.#modifyData(outliers) })),
          tapResponse(this.setLoaded, this.setError),
        ),
      ),
    ),
  );

  setCurrentType(type: OutlierType): void {
    this.patchState({ type });
  }

  #modifyData(outliers: Outlier[]): Outlier[] {
    return outliers.map((outlier) => ({
      ...outlier,
      amount: -1 * outlier.amount,
    }));
  }

  constructor() {
    super({ outliers: [], type: 'total' });
  }
}
