import dateFnsFormat from 'date-fns/fp/format';
import { getDate } from './get-date';

export function formatDate(date: Date | number | string, format = 'yyyy-MM-dd'): string {
  const d = getDate(date);
  return dateFnsFormat(format, d);
}
