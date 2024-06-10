import { parseISO } from './parse-iso';

export function getDate(date: Date | number | string): Date | number {
  return typeof date === 'string' ? parseISO(date) : date;
}
