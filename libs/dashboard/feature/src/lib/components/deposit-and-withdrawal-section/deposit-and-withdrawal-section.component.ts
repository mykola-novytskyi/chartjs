import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DepositWithdrawal } from '@chartjs/da';

interface TitleValueColor {
  title: string;
  value: number;
  color: string;
}

@Component({
  selector: 'ia-deposit-and-withdrawal-section',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './deposit-and-withdrawal-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositAndWithdrawalSectionComponent implements OnChanges {
  @Input({ required: true }) depositAndWithdrawal!: DepositWithdrawal;

  #currencyPipe = inject(CurrencyPipe);

  barValues: TitleValueColor[] = [];
  readonly hiddenBarLegends = signal<boolean[]>([false, false]);

  @ViewChild(BaseChartDirective) barChart: BaseChartDirective | undefined;

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
              context.raw as number,
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
        ticks: { callback: (value) => this.#currencyPipe.transform(value, 'USD', 'symbol', '1.0-2') },
      },
    },
  };

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Deposits', backgroundColor: '#179C24', hidden: false },
      { data: [], label: 'Withdrawals', backgroundColor: '#FF2424', hidden: false },
    ],
  };

  ngOnChanges({ depositAndWithdrawal }: SimpleChanges): void {
    if (depositAndWithdrawal) {
      this.barValues = [
        { title: 'Deposits', value: this.depositAndWithdrawal.deposit, color: '#179C24' },
        { title: 'Withdrawals', value: this.depositAndWithdrawal.withdrawal, color: '#FF2424' },
      ];
      const labels = Object.keys(this.depositAndWithdrawal.graphData);

      this.barChartData.labels = labels;
      this.barChartData.datasets[0].data = [];
      this.barChartData.datasets[1].data = [];

      labels.forEach((label) => {
        this.barChartData.datasets[0].data.push(this.depositAndWithdrawal.graphData[label][0]);
        this.barChartData.datasets[1].data.push(this.depositAndWithdrawal.graphData[label][1]);
      });

      this.barChart?.update();
    }
  }

  onToggleLegend(index: number): void {
    this.barChartData.datasets[index].hidden = !this.barChartData.datasets[index].hidden;
    this.hiddenBarLegends.update((legends) => {
      legends[index] = !legends[index];
      return legends;
    });
    this.barChart?.update();
  }
}
