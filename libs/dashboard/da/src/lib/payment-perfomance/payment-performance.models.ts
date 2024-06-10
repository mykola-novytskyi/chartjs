import { Period } from '../time-period';

export interface PaymentPerformance {
  [key: string]: number[];
}

export type PaymentPerformanceTab = 'time' | 'percentage';

export interface PaymentPerformanceRequest extends Period {
  tab: PaymentPerformanceTab;
}
