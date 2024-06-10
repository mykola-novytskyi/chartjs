import { inject, Injectable } from '@angular/core';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { BetsType } from './bets.type';
import { BetsTypeData } from './bets-type.interface';
import { BetsTypeService } from './bets-type.service';
import { BetsTypeDTO } from './bets-type-dto.interface';
import { Period, TimePeriodFacade } from '../time-period';
import { StoreProvider } from '@chartjs/providers';

interface BetsState {
  type: BetsType;
  bets: { [key in BetsType]: BetsTypeData };
}

@Injectable()
export class BetsTypeFacade extends StoreProvider<BetsState> {
  #timePeriodFacade = inject(TimePeriodFacade);
  #betsTypeRepository = inject(BetsTypeService);

  constructor() {
    super({
      type: 'Sports',
      bets: {
        Sports: { Total: 0, Live: 0, PreMatch: 0, Singles: 0, Multiples: 0, System: 0, Chain: 0 },
        eSport: { Total: 0, Live: 0, PreMatch: 0, Singles: 0, Multiples: 0, System: 0, Chain: 0 },
      },
    });
  }

  /***************
   *   Selectors *
   ***************/
  readonly currentType$ = this.select(({ type }: BetsState) => type);
  readonly currentBetType$ = this.select(({ type, bets }: BetsState) => bets[type]);

  /***************
   *   Effects   *
   ***************/
  #getBetsType$ = this.effect(() =>
    combineLatest([this.#timePeriodFacade.period$]).pipe(
      tap(this.setLoading),
      switchMap(([period]: [Period]) =>
        this.#betsTypeRepository.fetchBetsType(period).pipe(
          tap((betsDTO: BetsTypeDTO[]) => this.#processData(betsDTO)),
          tapResponse(this.setLoaded, this.setError),
        ),
      ),
    ),
  );

  #processData(betsDTO: BetsTypeDTO[]): void {
    const bets: { [key in BetsType]: BetsTypeData } = {} as { [key in BetsType]: BetsTypeData };
    betsDTO.forEach((b) => {
      const bet: { [key in BetsType]: BetsTypeData } = {} as { [key in BetsType]: BetsTypeData };

      // @ts-ignore
      b.elements.forEach((e) => (bet[e.title] = e.value));
      // @ts-ignore
      bets[b.title] = bet;
    });

    this.patchState({ bets });
  }

  setCurrentType(type: BetsType): void {
    this.patchState({ type });
  }
}
