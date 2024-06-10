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
import { CommonModule, DecimalPipe } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LabelColor, LineChartComponent, TabsComponent } from '@chartjs/components';
import { ActiveUser } from '@chartjs/da';

enum ActiveUserPosition {
  Casino,
  Together,
  Sport,
}

const activeUserLabels: LabelColor[] = [
  { label: 'Casino Only', color: '#179C24' },
  { label: 'Sport&Casino', color: '#F66666' },
  { label: 'Sport Only', color: '#FEDB4D' },
];

@Component({
  selector: 'ia-active-users-section',
  standalone: true,
  imports: [CommonModule, TabsComponent, LineChartComponent, BaseChartDirective],
  templateUrl: './active-users-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveUsersSectionComponent implements OnChanges {
  @Input({ required: true }) users!: ActiveUser;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  readonly hiddenLines = signal([false, false, false]);

  readonly labels: LabelColor[] = activeUserLabels;
  readonly chartPlugins = [ChartDataLabels];
  readonly localBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: activeUserLabels.map(({ label, color }) => ({
      data: [],
      label,
      backgroundColor: color,
      stack: 'bar',
    })),
  };
  readonly #decimalPipe = inject(DecimalPipe);
  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: ({ datasetIndex }) => (datasetIndex === ActiveUserPosition.Sport ? '#7A7A7A' : 'transparent'),
        formatter: (_, { dataIndex }) => {
          const sum = [ActiveUserPosition.Casino, ActiveUserPosition.Together, ActiveUserPosition.Sport].reduce(
            (acc, index) => {
              return acc + (this.localBarChartData.datasets[index].data[dataIndex] as number);
            },
            0,
          );

          return this.#decimalPipe.transform(sum, '1.0-0');
        },
        // @ts-ignore
        anchor: ({ dataset }) => (['Loss'].includes(dataset.label) ? 'start' : 'end'),
        clamp: true,
        // @ts-ignore
        align: ({ dataset }) => (['Loss'].includes(dataset.label) ? 'start' : 'end'),
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}  ${this.#decimalPipe.transform(context.raw as number, '1.0-0')}`;
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
        stacked: true,
        grid: { color: (value) => (value.tick.value === 0 ? '#7A7A7A' : '#F5F5F5') },
      },
      x: { stacked: true, grid: { color: '#EAEAEA' } },
    },
  };

  ngOnChanges({ users }: SimpleChanges): void {
    if (users && this.users) {
      const labels = Object.keys(this.users);

      [ActiveUserPosition.Casino, ActiveUserPosition.Together, ActiveUserPosition.Sport].forEach((index) => {
        this.localBarChartData.datasets[index].data = [];
      });

      labels.forEach((label) => {
        [ActiveUserPosition.Casino, ActiveUserPosition.Together, ActiveUserPosition.Sport].forEach((index) => {
          this.localBarChartData.datasets[index].data.push(this.users[label][index]);
        });
      });

      this.localBarChartData.labels = labels;
      this.chart?.update();
    }
  }

  onToggleLegend(index: ActiveUserPosition): void {
    this.localBarChartData.datasets[index].hidden = !this.localBarChartData.datasets[index].hidden;
    this.hiddenLines.update((legends) => {
      legends[index] = !legends[index];
      return legends;
    });
    this.chart?.update();
  }
}
