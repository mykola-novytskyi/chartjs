import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Tab, TabsComponent } from '@chartjs/components';
import { Bet, BetTab } from '@chartjs/da';

export enum BetDataSetPosition {
  Profit,
  Lost,
  Loss,
  Won,
}

@Component({
  selector: 'ia-bets-section',
  standalone: true,
  imports: [CommonModule, TabsComponent, BaseChartDirective],
  templateUrl: './bets-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetsSectionComponent implements OnChanges {
  @Input({ required: true }) bet!: Bet;
  @Input({ required: true }) selectedTab!: BetTab;

  @Output() selectTab = new EventEmitter<BetTab>();

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  #currencyPipe = inject(CurrencyPipe);

  readonly hiddenLegends = signal([false, false, false, false]);
  readonly BetDataSetPosition = BetDataSetPosition;
  readonly tabs: Tab<BetTab>[] = [
    { name: 'Total', value: 'total' },
    { name: 'Sports', value: 'sports' },
    // { name: 'eSport', value: 'eSport' },
    { name: 'Casino', value: 'casino' },
  ];

  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}  ${this.#currencyPipe.transform(
              Math.abs(context.raw as number),
              'USD',
              'symbol',
              '1.0-2',
            )}`;
          },
          labelColor: (context) => {
            return {
              borderColor: `${context.dataset.backgroundColor}`,
              backgroundColor: `${context.dataset.backgroundColor}`,
              borderWidth: 3,
              borderRadius: 2,
            };
          },
        },
      },
    },
    scales: {
      y: {
        // overlap for bars
        stacked: false,
        ticks: { callback: (value) => this.#currencyPipe.transform(value, 'USD', 'symbol', '1.0-2') },
        grid: { color: (value) => (value.tick.value === 0 ? '#7A7A7A' : '#F5F5F5') },
      },
      x: { stacked: true, grid: { color: '#EAEAEA' } },
    },
  };

  localBarChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  ngOnChanges({ bet }: SimpleChanges): void {
    if (bet) {
      const localBarChartData = structuredClone(this.bet.barChartData);
      if (this.bet.barChartData.datasets[0]) {
        this.hiddenLegends().forEach((hiddenIndex, index) => {
          localBarChartData.datasets[index].hidden = hiddenIndex;
        });
      }

      this.localBarChartData = localBarChartData;
      this.chart?.update();
    }
  }

  onSelectTab(type: unknown): void {
    this.selectTab.emit(type as BetTab);
  }

  onToggleLegend(index: BetDataSetPosition): void {
    this.localBarChartData.datasets[index].hidden = !this.localBarChartData.datasets[index].hidden;
    this.hiddenLegends.update((legends) => {
      legends[index] = !legends[index];
      return legends;
    });
    this.chart?.update();
  }
}
