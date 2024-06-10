import { inject, Injectable } from '@angular/core';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { ActiveUsersService } from './active-users.service';
import { Period, TimePeriodFacade } from '../time-period';
import { ActiveUser } from './active-users.models';
import { StoreProvider } from '@chartjs/providers';

interface ActiveUserState {
  users: ActiveUser;
}

@Injectable()
export class ActiveUsersFacade extends StoreProvider<ActiveUserState> {
  #timePeriodFacade = inject(TimePeriodFacade);
  #betRepository = inject(ActiveUsersService);

  constructor() {
    super({} as ActiveUserState);
  }

  /***************
   *   Selectors *
   ***************/
  readonly activeUsers = this.selectSignal(({ users }: ActiveUserState) => users);

  /***************
   *   Effects   *
   ***************/
  #getCustomActiveUsers$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(([period]: [Period]) =>
        this.#betRepository.fetchActiveUsersForCustomPeriod(period).pipe(
          tap((users: ActiveUser) => this.patchState({ users })),
          tapResponse(this.setLoaded, this.setError),
        ),
      ),
    ),
  );
}
