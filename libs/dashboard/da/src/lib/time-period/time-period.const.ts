import { TimePeriodType } from './time-period-type.enum';
import { TimePeriod } from './time-period.interface';

export const selectedTimePeriodLocalStorageKey = 'dashboard-time-period';

export const defaultTimePeriodState: Partial<TimePeriod> = {
  type: TimePeriodType.Yesterday,
  customPeriod: { startDate: '', endDate: '', compareStartDate: '', compareEndDate: '' }
};
