import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { TimePeriodFacade } from '../time-period';
import { Deposits } from './deposits.interface';
import { DepositType } from './deposit.type';
import { StoreProvider } from '@chartjs/providers';

interface DepositsState {
  data: Deposits;
  currentType: DepositType; // number or amount
}

@Injectable()
export class DepositsFacade extends StoreProvider<DepositsState> {
  #http = inject(HttpClient);
  #timePeriodFacade = inject(TimePeriodFacade);

  readonly deposits: Signal<{ [key: string]: number[] }> = this.selectSignal(({ data, currentType }) => {
    const deposits: { [key: string]: number[] } = {};
    Object.keys(data).forEach((label) => {
      const graphData: number[] = [];
      data[label].forEach((value) => {
        graphData.push(value[currentType]);
      });

      deposits[label] = graphData;
    });
    return deposits;
  });

  readonly currentType$: Observable<DepositType> = this.select(({ currentType }) => currentType);

  #getDeposits$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(() =>
        this.#http
          .get<Deposits>(`http://localhost:3000/api/dashboard/deposits`, {
            params: { ...this.#timePeriodFacade.comparisonPeriod() },
          })
          .pipe(
            tap((data) => this.patchState({ data })),
            tapResponse(this.setLoaded, this.setError),
          ),
      ),
    ),
  );

  changeCurrentType(currentType: DepositType): void {
    this.patchState({ currentType });
  }

  constructor() {
    super({
      data: {} as Deposits,
      currentType: 0,
    });
  }
}
