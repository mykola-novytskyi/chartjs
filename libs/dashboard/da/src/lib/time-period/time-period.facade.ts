import { computed, Injectable } from '@angular/core';
import { Period, TimePeriod } from './time-period.interface';
import { TimePeriodType } from './time-period-type.enum';
import { defaultTimePeriodState, selectedTimePeriodLocalStorageKey } from './time-period.const';
import { getPeriods } from './time-period.utils';
import { toObservable } from '@angular/core/rxjs-interop';
import { StoreProvider } from '@chartjs/providers';

@Injectable()
export class TimePeriodFacade extends StoreProvider<TimePeriod> {
  /***************
   *   Selectors *
   ***************/

  readonly currentType$ = this.select(({ type }: TimePeriod) => type);
  readonly isOneDayPeriod = this.selectSignal(({ type }: TimePeriod) =>
    [TimePeriodType.Today, TimePeriodType.Yesterday].includes(type),
  );
  readonly periods = this.selectSignal(({ periods, customPeriod }) => ({
    ...periods,
    custom: customPeriod,
  }));
  readonly isTodayPeriod = this.selectSignal(({ type }: TimePeriod) => type === TimePeriodType.Today);

  readonly comparisonPeriod = this.selectSignal(({ type, periods, customPeriod }) => {
    if (type === TimePeriodType.CustomPeriod) {
      return customPeriod;
    }
    return periods[type];
  });
  readonly comparisonPeriod$ = toObservable(this.comparisonPeriod);
  #startDate = computed(() => this.comparisonPeriod().startDate);
  #endDate = computed(() => this.comparisonPeriod().endDate);
  readonly period = computed(() => ({ startDate: this.#startDate(), endDate: this.#endDate() }));
  readonly period$ = toObservable(this.period);

  constructor() {
    const localState = JSON.parse(localStorage.getItem(selectedTimePeriodLocalStorageKey) || '{}');
    super({ ...defaultTimePeriodState, ...getPeriods(), ...localState });
  }

  setCurrentType(type: TimePeriodType, customPeriod?: Period): void {
    if (type === TimePeriodType.CustomPeriod) {
      const state = { type, customPeriod };
      localStorage.setItem(selectedTimePeriodLocalStorageKey, JSON.stringify(state));
      this.patchState(state);
    } else {
      localStorage.setItem(selectedTimePeriodLocalStorageKey, JSON.stringify({ type }));
      this.patchState({ type, customPeriod: this.periods()[type] });
    }
  }
}
