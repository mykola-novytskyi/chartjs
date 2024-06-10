import { TimePeriodType } from './time-period-type.enum';

export interface Period {
  startDate: string;
  endDate: string;
  compareEndDate?: string;
  compareStartDate?: string;
}

export interface Periods {
  [TimePeriodType.Today]: Period;
  [TimePeriodType.Yesterday]: Period;
  [TimePeriodType.WeekToDate]: Period;
  [TimePeriodType.MonthToDate]: Period;
  [TimePeriodType.TwoMonthToDate]: Period;
  [TimePeriodType.ThreeMonthToDate]: Period;
  [TimePeriodType.YearToDate]: Period;
}

export interface TimePeriod {
  type: TimePeriodType;
  periods: Periods;
  customPeriod: Period;
}
