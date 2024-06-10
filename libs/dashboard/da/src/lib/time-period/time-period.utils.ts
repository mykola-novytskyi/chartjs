import { Periods } from './time-period.interface';
import { TimePeriodType } from './time-period-type.enum';
import { formatDate, subtract } from '@chartjs/util';

export function getPeriods(): { periods: Periods } {
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date().setDate(new Date().getDate() - 1));
  const dayBeforeYesterday = formatDate(new Date().setDate(new Date().getDate() - 2));

  return {
    periods: {
      [TimePeriodType.Today]: { startDate: today, endDate: today },
      [TimePeriodType.Yesterday]: {
        startDate: yesterday,
        endDate: yesterday,
        compareStartDate: dayBeforeYesterday,
        compareEndDate: dayBeforeYesterday,
      },
      [TimePeriodType.WeekToDate]: {
        startDate: formatDate(subtract(new Date(), { days: 7 })),
        endDate: yesterday,
        compareStartDate: formatDate(subtract(new Date(), { days: 14 })),
        compareEndDate: formatDate(subtract(new Date(), { days: 8 })),
      },
      [TimePeriodType.MonthToDate]: {
        startDate: formatDate(subtract(new Date(), { days: 30 })),
        endDate: yesterday,
        compareStartDate: formatDate(subtract(new Date(), { days: 61 })),
        compareEndDate: formatDate(subtract(new Date(), { days: 31 })),
      },
      [TimePeriodType.TwoMonthToDate]: {
        startDate: formatDate(subtract(new Date(), { days: 60 })),
        endDate: yesterday,
        compareStartDate: formatDate(subtract(new Date(), { days: 121 })),
        compareEndDate: formatDate(subtract(new Date(), { days: 61 })),
      },
      [TimePeriodType.ThreeMonthToDate]: {
        startDate: formatDate(subtract(new Date(), { days: 90 })),
        endDate: yesterday,
        compareStartDate: formatDate(subtract(new Date(), { days: 181 })),
        compareEndDate: formatDate(subtract(new Date(), { days: 91 })),
      },
      [TimePeriodType.YearToDate]: {
        startDate: formatDate(subtract(new Date(), { days: 365 })),
        endDate: yesterday,
        compareStartDate: formatDate(subtract(new Date(), { days: 731 })),
        compareEndDate: formatDate(subtract(new Date(), { days: 366 })),
      },
    },
  };
}
