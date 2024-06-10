import { ChartConfiguration } from 'chart.js';
import { TitleValue } from '../../../../feature/src/lib/interfaces/title-value.interface';

export interface BetDTO {
  graphData: Record<string, TitleValue[]>;
  elements: TitleValue[];
  title: BetType;
}

export type BetType = 'Total' | 'Sports' | 'eSport' | 'Casino';

export interface Bet {
  Lost: number;
  Won: number;
  Profit: number;
  Loss: number;
  barChartData: ChartConfiguration<'bar'>['data'];
}

export type BetTab = 'total' | 'sports' | 'casino';
