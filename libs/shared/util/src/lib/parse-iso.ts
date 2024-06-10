import dateFnsParseISO from 'date-fns/fp/parseISO';

export function parseISO(date: string): Date {
  return dateFnsParseISO(date);
}
