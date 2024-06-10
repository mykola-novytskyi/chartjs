import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { TimePeriodFacade } from '../time-period';

import { InvitedFriends } from './invited-friends.interface';
import { StoreProvider } from '@chartjs/providers';

interface InvitedFriendsState {
  invitedFriends: InvitedFriends;
}

@Injectable()
export class InvitedFriendsFacade extends StoreProvider<InvitedFriendsState> {
  #http = inject(HttpClient);
  #timePeriodFacade = inject(TimePeriodFacade);


  readonly invitedFriends: Signal<{ [key: string]: number[] }> = this.selectSignal(
    ({ invitedFriends }) => invitedFriends,
  );

  #getInvitedFriends$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(() =>
        this.#http
          .get<InvitedFriends>(`http://localhost:3000/api/Dashboard/invites`, {
            params: { ...this.#timePeriodFacade.comparisonPeriod() },
          })
          .pipe(
            tap((invitedFriends) => this.patchState({ invitedFriends })),
            tapResponse(this.setLoaded, this.setError),
          ),
      ),
    ),
  );

  constructor() {
    super({
      invitedFriends: {} as InvitedFriends,
    });
  }
}
