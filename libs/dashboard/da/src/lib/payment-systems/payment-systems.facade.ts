import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { PaymentSystemsDTO } from './payment-systems-dto.interface';
import { Period, TimePeriodFacade } from '../time-period';
import { StoreProvider } from '@chartjs/providers';


interface PaymentSystemsState {
  payment: PaymentSystemsDTO;
}

@Injectable()
export class PaymentSystemsFacade extends StoreProvider<PaymentSystemsState> {
  #http = inject(HttpClient);
  #timePeriodFacade = inject(TimePeriodFacade);


  readonly payment = this.selectSignal(({ payment }) => payment);

  #getPayments = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(([period]: [Period]) =>
        this.#http
          .get<PaymentSystemsDTO>(`http://localhost:3000/api/dashboard/payment-systems`, {
            params: { ...period },
          })
          .pipe(
            tap((payment) => this.patchState({ payment })),
            tapResponse(this.setLoaded, this.setError),
          ),
      ),
    ),
  );

  constructor() {
    super({
      payment: {
        deposit: { value: 0, providers: [] },
        withdrawal: { value: 0, providers: [] },
      } as PaymentSystemsDTO,
    });
  }
}
