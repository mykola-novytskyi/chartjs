import { inject, Injectable } from '@angular/core';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { BetsByProviders } from './bets-by-providers.interface';
import { HttpClient } from '@angular/common/http';
import { Period, TimePeriodFacade } from '../time-period';
import { StoreProvider } from '@chartjs/providers';

interface BetsByProvidersState {
  bets: BetsByProviders[];
}

@Injectable()
export class BetsByProvidersFacade extends StoreProvider<BetsByProvidersState> {
  #timePeriodFacade = inject(TimePeriodFacade);
  #http = inject(HttpClient);

  /***************
   *   Selectors *
   ***************/
  readonly bets = this.selectSignal(({ bets }: BetsByProvidersState) => bets);

  /***************
   *   Effects   *
   ***************/
  #getBets$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(([period]: [Period]) =>
        this.#http
          .get<BetsByProviders[]>(`http://localhost:3000/api/dashboard/bets-by-providers`, {
            params: { ...period },
          })
          .pipe(
            tap((bets: BetsByProviders[]) => this.patchState({ bets })),
            tapResponse(this.setLoaded, this.setError),
          ),
      ),
    ),
  );

  constructor() {
    super({
      bets: [],
    });
  }
}
