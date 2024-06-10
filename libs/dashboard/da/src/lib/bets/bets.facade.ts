import { inject, Injectable } from '@angular/core';
import { combineLatest, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { BetService } from './bet.service';
import { ChartConfiguration } from 'chart.js';
import { Period, TimePeriodFacade } from '../time-period';

import { Bet, BetDTO, BetTab } from './bet.models';
import { StoreProvider } from '@chartjs/providers';
import { TitleValue } from '../../../../feature/src/lib/interfaces/title-value.interface';

interface BetsState {
  tab: BetTab;
  bet: Bet;
}

@Injectable()
export class BetsFacade extends StoreProvider<BetsState> {
  #timePeriodFacade = inject(TimePeriodFacade);

  #betRepository = inject(BetService);

  constructor() {
    super({
      tab: 'total',
      bet: {
        Lost: 0,
        Won: 0,
        Profit: 0,
        Loss: 0,
        barChartData: { labels: [], datasets: [] },
      },
    });
  }

  /***************
   *   Selectors *
   ***************/
  readonly currentTab$ = this.select(({ tab }: BetsState) => tab);
  readonly bet = this.selectSignal(({ bet }: BetsState) => bet);

  /***************
   *   Effects   *
   ***************/
  #getBets$ = this.effect(() =>
    combineLatest([
      this.#timePeriodFacade.period$,
      this.currentTab$,
    ]).pipe(
      tap(this.setLoading),
      switchMap(([period, betTab]: [Period, BetTab]) =>
        this.#betRepository.fetchBets(period, betTab).pipe(
          tap((betsDTO: BetDTO) => this.#processData(betsDTO)),
          tapResponse(this.setLoaded, this.setError),
        ),
      ),
    ),
  );

  setCurrentType(type: BetTab): void {
    this.patchState({ tab: type });
  }

  #processData(betsDTO: BetDTO): void {
    const bet: Bet = {} as Bet;
    // @ts-ignore
    betsDTO.elements.forEach((e) => (bet[e.title] = e.value));
    bet.barChartData = this.#makeBarChartData(betsDTO.graphData);
    // @ts-ignore
    bet[betsDTO.title] = bet;

    this.patchState({ bet });
  }

  #makeBarChartData(graphData: Record<string, TitleValue[]>): ChartConfiguration<'bar'>['data'] {
    const labels = Object.keys(graphData);
    const datasets: any[] = [
      { data: [], label: 'Profit', backgroundColor: '#2EA63A', stack: 'bar' },
      { data: [], label: 'Lost', backgroundColor: '#A2D7A7', stack: 'bar' },
      { data: [], label: 'Loss', backgroundColor: '#FF5050', stack: 'bar' },
      { data: [], label: 'Won', backgroundColor: '#FFBDBD', stack: 'bar' },
    ];

    labels.forEach((label) => {
      graphData[label].forEach((titleValue, index) => {
        const value = ['Won', 'Loss'].includes(titleValue.title) ? titleValue.value * -1 : titleValue.value;
        datasets[index].data.push(value);
      });
    });

    return { labels, datasets };
  }
}
