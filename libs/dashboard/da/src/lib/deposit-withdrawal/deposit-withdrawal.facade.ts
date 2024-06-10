import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { DepositWithdrawal } from './deposit-withdrawal.interface';
import { Period, TimePeriodFacade } from '../time-period';
import { StoreProvider } from '@chartjs/providers';


interface DepositWithdrawalState {
  data: DepositWithdrawal;
}

@Injectable()
export class DepositWithdrawalFacade extends StoreProvider<DepositWithdrawalState> {
  #http = inject(HttpClient);
  #timePeriodFacade = inject(TimePeriodFacade);


  readonly depositAndWithdrawal = this.selectSignal(({ data }) => data);

  #getDepositAndWithdrawal$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(([period]: [Period]) =>
        this.#http
          .get<DepositWithdrawal>(`http://localhost:3000/api/dashboard/deposits-and-withdrawals`, {
            params: { ...period },
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
      data: {
        deposit: 0,
        withdrawal: 0,
        graphData: {},
      } as DepositWithdrawal,
    });
  }
}
