import { ComponentStore } from '@ngrx/component-store';
import { LoadingState } from './loading-state.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseState } from './base-state.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { filter, tap } from 'rxjs';

export abstract class StoreProvider<State extends object> extends ComponentStore<State & BaseState> {
  readonly #snackBar = inject(MatSnackBar);

  protected constructor(initialState?: State) {
    super({ ...initialState, callState: LoadingState.Init } as State & BaseState);
  }

  readonly setLoading = this.updater((state) => {
    return { ...state, callState: LoadingState.Loading };
  });

  readonly setLoaded = this.updater((state) => {
    return { ...state, callState: LoadingState.Loaded };
  });

  readonly setError = this.updater((state, error: HttpErrorResponse | string) => {
    return {
      ...state,
      callState: {
        error: error instanceof HttpErrorResponse ? error.error?.error || error.error || error.message : error,
      },
    };
  });

  readonly loading$ = this.select((state) => state.callState === LoadingState.Loading);
  readonly loading = this.selectSignal((state) => state.callState === LoadingState.Loading);
  readonly loaded$ = this.select((state) => state.callState === LoadingState.Loaded);
  readonly loaded = this.selectSignal((state) => state.callState === LoadingState.Loaded);
  readonly error$ = this.select((state) => (typeof state.callState === 'object' ? state.callState.error : undefined));

  readonly #errorListener = this.effect(() =>
    this.error$.pipe(
      filter(Boolean),
      tap((error: string) => {
        this.#snackBar.open(error);
      }),
    ),
  );
}
