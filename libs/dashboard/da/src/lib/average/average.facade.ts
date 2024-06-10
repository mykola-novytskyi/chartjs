import { computed, inject, Injectable } from '@angular/core';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { AverageType } from './average.type';
import { GraphData } from './average.interface';
import { AverageService } from './average.service';
import { Period, TimePeriodFacade } from '../time-period';
import { StoreProvider } from '@chartjs/providers';

interface AverageState {
  type: AverageType;
  types: { [key in AverageType]: GraphData[] };
}

@Injectable()
export class AverageFacade extends StoreProvider<AverageState> {
  /***************
   *   Selectors *
   ***************/
  readonly currentType$ = this.select(({ type }: AverageState) => type);
  readonly graphData = this.selectSignal(({ type, types }: AverageState) => types[type]);
  readonly totalAmount = computed(() => this.graphData().reduce((acc, val) => acc + val.amount * val.count, 0));
  readonly totalCount = computed(() => this.graphData().reduce((acc, val) => acc + val.count, 0));
  readonly average = computed(() => this.totalAmount() / this.totalCount());

  #timePeriodFacade = inject(TimePeriodFacade);
  #averageRepository = inject(AverageService);
  /***************
   *   Effects   *
   ***************/
  #getCustomAverage$ = this.effect(() =>
    combineLatest([
      this.#timePeriodFacade.period$,
      this.currentType$,
    ]).pipe(
      tap(this.setLoading),
      switchMap(([{ startDate, endDate }, type]: [Period, AverageType]) => {
        const request =
          type === 'deposit'
            ? this.#averageRepository.fetchCustomAverageDeposit
            : type === 'withdrawal'
              ? this.#averageRepository.fetchCustomAverageWithdrawal
              : this.#averageRepository.fetchCustomAverageBets;

        return request.call(this.#averageRepository, startDate, endDate).pipe(
          tap((graphData: GraphData[]) => {
            const state = this.get();
            this.patchState({ ...state, types: { ...state.types, [type]: graphData } });
          }),
          tapResponse(this.setLoaded, this.setError),
        );
      }),
    ),
  );

  constructor() {
    super({
      type: 'deposit',
      types: {
        deposit: [],
        withdrawal: [],
        bets: [],
      },
    });
  }

  setCurrentType(type: AverageType): void {
    this.patchState({ type });
  }
}
