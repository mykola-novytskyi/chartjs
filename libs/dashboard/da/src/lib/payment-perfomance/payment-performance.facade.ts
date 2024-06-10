import { inject, Injectable, Signal } from '@angular/core';
import { combineLatest, Observable, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { Period, TimePeriodFacade } from '../time-period';

import { PaymentPerformance, PaymentPerformanceTab } from './payment-performance.models';
import { PaymentPerformanceService } from './payment-performance.service';
import { StoreProvider } from '@chartjs/providers';

interface DepositsState {
  indicators: PaymentPerformance;
  currentTab: PaymentPerformanceTab; // time or number
}

@Injectable()
export class PaymentPerformanceFacade extends StoreProvider<DepositsState> {
  #timePeriodFacade = inject(TimePeriodFacade);

  #service = inject(PaymentPerformanceService);

  readonly indicators: Signal<{ [key: string]: number[] }> = this.selectSignal(({ indicators }) => indicators);
  readonly currentTab$: Observable<PaymentPerformanceTab> = this.select(({ currentTab }) => currentTab);

  #getIndicators$ = this.effect(() =>
    combineLatest([
      this.#timePeriodFacade.period$,
      this.currentTab$,
    ]).pipe(
      tap(this.setLoading),
      switchMap(([period, currentTab]: [Period, PaymentPerformanceTab]) =>
        this.#service.fetchIndicators({ ...period, tab: currentTab }).pipe(
          tap((indicators) => this.patchState({ indicators })),
          tapResponse(this.setLoaded, this.setError),
        ),
      ),
    ),
  );

  changeCurrentTab(currentType: PaymentPerformanceTab): void {
    this.patchState({ currentTab: currentType });
  }

  constructor() {
    super({
      indicators: {},
      currentTab: 'time',
    });
  }
}
