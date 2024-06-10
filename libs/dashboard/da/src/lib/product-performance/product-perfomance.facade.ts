import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductPerformance } from './product-performance.interface';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { Period, TimePeriodFacade } from '../time-period';
import { StoreProvider } from '@chartjs/providers';


interface ProductPerformanceState {
  products: ProductPerformance[];
}

@Injectable()
export class ProductPerformanceFacade extends StoreProvider<ProductPerformanceState> {
  readonly products = this.selectSignal(({ products }) => products);

  #http = inject(HttpClient);
  #timePeriodFacade = inject(TimePeriodFacade);


  #getProducts = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(([period]: [Period]) =>
        this.#http
          .get<ProductPerformance[]>(`http://localhost:3000/api/dashboard/product-performance`, {
            params: { ...period },
          })
          .pipe(
            tap((products) => this.patchState({ products })),
            tapResponse(this.setLoaded, this.setError),
          ),
      ),
    ),
  );

  constructor() {
    super({ products: [] });
  }
}
