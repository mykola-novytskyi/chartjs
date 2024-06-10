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
import { ChartData } from 'chart.js';
import { DoughnutChartType } from './doughnut-chart-type.enum';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'ia-doughnut-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './doughnut-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutChartComponent implements OnChanges {
  // @Input({ required: true }) doughnutChartData!: ChartData<'doughnut'>;
  @Input({ required: true }) doughnutChartData!: any;
  @Input({ required: true }) chartData!: number[];
  @Input() labels: string[] = [];
  @Input() type: DoughnutChartType = DoughnutChartType.Currency;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  #currencyPipe = inject(CurrencyPipe);
  readonly hiddenLegends = signal<boolean[]>([]);
  readonly DoughnutChartType = DoughnutChartType;

  doughnutChartOptions: any = {
    borderWidth: 0,
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: ({ raw }: { raw: number }) => {
            if (this.type === DoughnutChartType.Currency) {
              return ` ${this.#currencyPipe.transform(Math.abs(raw as number), 'USD', 'symbol', '1.0-2')}`;
            }
            return ` ${raw}%`;
          },
          labelColor: ({ dataIndex, dataset }: { dataIndex: number; dataset: { backgroundColor: [] } }) => ({
            borderColor: `${dataset.backgroundColor[dataIndex]}`,
            backgroundColor: `${dataset.backgroundColor[dataIndex]}`,
            borderWidth: 3,
            borderRadius: 2,
          }),
        },
      },
    },
  };

  ngOnChanges({ doughnutChartData, chartData, labels }: SimpleChanges) {
    if (chartData) {
      this.doughnutChartData.datasets[0].data = this.chartData;
      this.chart?.update();
    }
    if (labels) {
      this.doughnutChartData.labels = this.labels;
      this.chart?.update();
    }
    if (doughnutChartData && this.doughnutChartData && this.doughnutChartData.labels) {
      this.hiddenLegends.set(this.doughnutChartData.labels.map(() => false));
    }
  }

  onToggleLegend(index: number) {
    this.chart?.chart?.toggleDataVisibility(index);
    this.chart?.update();
    this.hiddenLegends.update((legends) => {
      legends[index] = !legends[index];
      return legends;
    });
  }
}
