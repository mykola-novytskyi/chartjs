import { inject, Injectable, Signal } from '@angular/core';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { Period, TimePeriodFacade } from '../time-period';

import { FDR } from './fdr.interface';
import { FDRService } from './fdr.service';
import { StoreProvider } from '@chartjs/providers';

interface VisitorsState {
  fdr: FDR;
}

@Injectable()
export class FdrFacade extends StoreProvider<VisitorsState> {
  #service = inject(FDRService);
  #timePeriodFacade = inject(TimePeriodFacade);


  readonly fdr: Signal<FDR> = this.selectSignal(({ fdr }) => fdr);

  #getCustomFDR$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(([{ startDate, endDate }]: [Period]) =>
        this.#service.fetchFDRForCustomPeriod(startDate, endDate).pipe(
          tap((fdr) => this.patchState({ fdr })),
          tapResponse(this.setLoaded, this.setError),
        ),
      ),
    ),
  );

  constructor() {
    super({
      fdr: {} as FDR,
    });
  }
}
