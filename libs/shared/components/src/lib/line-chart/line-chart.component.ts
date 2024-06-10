import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartDataset, Point, TooltipItem } from 'chart.js';
import { LabelColor } from './label-color.interface';

@Component({
  selector: 'ia-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnChanges {
  @Input({ required: true }) entities!: { [key: string]: number[] };
  @Input({ required: true }) labelColors!: LabelColor[];
  @Input() hiddenLines?: boolean[];
  @Input() fillNegativeValues = false;
  @Input() currency = '';
  @Input() suffix = '';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  readonly #currencyPipe = inject(CurrencyPipe);
  readonly lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };
  readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          source: 'labels',
        },
      },
      y: {
        ticks: {
          callback: (value) => this.#getTickValue(value),
        },
        grid: { color: (value) => (value.tick.value === 0 ? '#7A7A7A' : '#F5F5F5') },
      },
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) =>
            ` ${context.dataset.label}: ${this.#getTickValue(context.raw as string)}`,
          title: ([{ label }]: TooltipItem<'line'>[]): string | string[] | void => label,
          labelColor: ({ datasetIndex }) => ({
            borderColor: `${this.labelColors[datasetIndex].color}`,
            backgroundColor: `${this.labelColors[datasetIndex].color}`,
            borderWidth: 3,
            borderRadius: 2,
          }),
        },
      },
    },
  };

  ngOnChanges({ entities }: SimpleChanges) {
    if (entities) {
      const graphData: number[][] = [];
      const labels: string[] = [];
      this.lineChartData.datasets = [];

      Object.keys(this.entities).forEach((label) => {
        labels.push(label);
        this.entities[label].forEach((value, index) => {
          if (!graphData[index]) {
            graphData[index] = [];
          }
          graphData[index].push(value);
        });
      });
      graphData.forEach((lineData, index) => {
        if (!this.lineChartData.datasets[index]) {
          this.lineChartData.datasets[index] = {} as ChartDataset<'line', (number | Point | null)[]>;
        }
        this.lineChartData.datasets[index].data = lineData;
        this.lineChartData.datasets[index].label = this.labelColors[index].label;
        this.lineChartData.datasets[index].borderColor = this.labelColors[index].color;
        this.lineChartData.datasets[index].pointBorderColor = this.labelColors[index].color;
        this.lineChartData.datasets[index].pointBackgroundColor = this.labelColors[index].color;
        this.lineChartData.datasets[index].pointHoverBackgroundColor = this.labelColors[index].color;
        if (this.fillNegativeValues) {
          this.lineChartData.datasets[index].tension = 0.1;
          this.lineChartData.datasets[index].fill = {
            target: 'origin',
            above: 'rgba(0, 0, 0, 0)',
            below: 'rgba(235, 113, 115, 0.1)',
          };
          // @ts-ignore
          this.lineChartOptions.animation = false;
        }
      });
      this.lineChartData.labels = labels;
    }

    if (this.hiddenLines?.length) {
      this.hiddenLines.forEach((indexBoolean: boolean, index: number) => {
        if (!this.lineChartData.datasets[index]) {
          this.lineChartData.datasets[index] = {} as ChartDataset<'line', (number | Point | null)[]>;
        }
        this.lineChartData.datasets[index].hidden = indexBoolean;
      });
    }

    this.chart?.update();
  }

  #getTickValue(value: string | number): string {
    let visualValue = value;
    if (this.currency) {
      visualValue = this.#currencyPipe.transform(value, this.currency, 'symbol', '1.0-2') as string;
    } else if (this.suffix) {
      visualValue = `${value}${this.suffix}`;
    }
    return `${visualValue}`;
  }
}
