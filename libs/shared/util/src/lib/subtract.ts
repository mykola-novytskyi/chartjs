import dateFnsSubtract from 'date-fns/fp/sub';

export function subtract(date: Date | number, duration: Duration): Date {
  return dateFnsSubtract(duration, date);
}
