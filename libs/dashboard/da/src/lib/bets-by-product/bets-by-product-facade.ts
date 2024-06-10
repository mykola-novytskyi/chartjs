import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { TimePeriodFacade } from '../time-period';
import { BetsByProduct } from './bets-by-product.interface';
import { BetsByProductType } from './bets-by-product.type';
import { StoreProvider } from '@chartjs/providers';

interface DepositsState {
  bets: BetsByProduct;
  currentType: BetsByProductType; // number or amount
}

@Injectable()
export class BetsByProductFacade extends StoreProvider<DepositsState> {
  #http = inject(HttpClient);
  #timePeriodFacade = inject(TimePeriodFacade);

  readonly bets: Signal<{ [key: string]: number[] }> = this.selectSignal(({ bets, currentType }) => {
    const deposits: { [key: string]: number[] } = {};
    Object.keys(bets).forEach((label) => {
      const graphData: number[] = [];
      bets[label].forEach((value, index) => {
        graphData.push(value[currentType]);

        if (index === 1) {
          graphData.push(graphData[0] + graphData[1]);
        }
      });

      deposits[label] = graphData;
    });
    return deposits;
  });

  readonly currentType$: Observable<BetsByProductType> = this.select(({ currentType }) => currentType);

  #getBets$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(() =>
        this.#http
          .get<BetsByProduct>(`http://localhost:3000/api/dashboard/bets-by-product`, {
            params: { ...this.#timePeriodFacade.comparisonPeriod() },
          })
          .pipe(
            tap((data) => this.patchState({ bets: data })),
            tapResponse(this.setLoaded, this.setError),
          ),
      ),
    ),
  );

  changeCurrentType(currentType: BetsByProductType): void {
    this.patchState({ currentType });
  }

  constructor() {
    super({
      bets: {} as BetsByProduct,
      currentType: 0,
    });
  }
}
