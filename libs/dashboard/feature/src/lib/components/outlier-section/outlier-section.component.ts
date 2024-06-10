import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, Tick } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Tab, TabsComponent } from '@chartjs/components';
import { Outlier, OutlierType } from '@chartjs/da';

const underlinePlugin = {
  id: 'underlinePlugin',
  afterDraw: (chart: Chart<'bar', unknown, unknown>) => {
    const yAxis = chart.scales['y'];
    const ctx = chart.ctx;

    const tickEnd = yAxis.right;

    yAxis.ticks.forEach((tick: Tick, i: number) => {
      const y = yAxis.getPixelForTick(i);
      const metrics = ctx.measureText(tick.label as string);
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#000'; // Modify this to change the underline color
      ctx.moveTo(tickEnd - metrics.width - 13, y + 5); // The 5px offset need to be adjusted to fit font size
      ctx.lineTo(tickEnd - 10, y + 5); // The 5px offset need to be adjusted to fit font size
      ctx.stroke();
    });
  },
};

@Component({
  selector: 'ia-outlier-section',
  standalone: true,
  imports: [CommonModule, TabsComponent, BaseChartDirective],
  templateUrl: './outlier-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutlierSectionComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) outliers!: Outlier[];
  @Input({ required: true }) selectedTab!: OutlierType;
  @Input() currencyCode = 'USD';

  @Output() selectTab = new EventEmitter<OutlierType>();

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  #currencyPipe = inject(CurrencyPipe);

  readonly chartPlugins = [ChartDataLabels, underlinePlugin];
  readonly tabs: Tab[] = [
    { name: 'Total', value: 'total' },
    { name: 'Sports', value: 'sports' },
    { name: 'Casino', value: 'casino' },
  ];

  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${this.#currencyPipe.transform(Math.abs(context.raw as number), this.currencyCode, 'symbol', '1.0-2')}`,
          labelColor: (context) => {
            const color: string = (context.dataset.backgroundColor as string[])[context.dataIndex];
            return {
              borderColor: color,
              backgroundColor: color,
              borderWidth: 3,
              borderRadius: 2,
            };
          },
        },
      },
      datalabels: {
        color: ({ dataset, dataIndex }) => ((dataset.data[dataIndex] as number) >= 0 ? '#FF5050' : '#2EA63A'),
        formatter: (value) => this.#currencyPipe.transform(value, this.currencyCode, 'symbol', '1.0-2'),
        anchor: ({ dataset, dataIndex }) => ((dataset.data[dataIndex] as number) >= 0 ? 'start' : 'end'),
        align: ({ dataset, dataIndex }) => ((dataset.data[dataIndex] as number) >= 0 ? 'start' : 'end'),
      },
    },
    scales: {
      x: { ticks: { callback: (value) => this.#currencyPipe.transform(value, this.currencyCode, 'symbol', '1.0-2') } },
    },
  };

  localBarChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  ngAfterViewInit(): void {
    if (this.chart && this.chart.chart) {
      const canvas = this.chart.chart.canvas;
      canvas.onclick = (event: MouseEvent) => {
        // @ts-ignore
        const yAxis = this.chart.chart.scales['y'];
        if (yAxis) {
          const yTicks = yAxis.ticks;
          let tickYPos;
          let nextTickYPos;

          const clickYPos = event.offsetY + 15;

          // Calculate if click was within y-axis area
          if (event.offsetX >= yAxis.left && event.offsetX <= yAxis.right) {
            for (let i = 0; i < yTicks.length; i++) {
              tickYPos = yAxis.getPixelForTick(i);

              if (i !== yTicks.length - 1) {
                // If it's not the last tick
                nextTickYPos = yAxis.getPixelForTick(i + 1);
              } else {
                nextTickYPos = yAxis.bottom;
              }

              if (clickYPos > tickYPos && clickYPos < nextTickYPos) {
                this.#openClientDashboard(i);
                break; // Stop loop when click detected
              }

              // Special case, handle click above the first tick
              if (i === 0 && clickYPos < tickYPos) {
                this.#openClientDashboard(i);
                break;
              }
            }
          }
        }
      };

      canvas.onmousemove = (event: MouseEvent) => {
        // @ts-ignore
        const yAxis = this.chart.chart.scales['y'];
        if (event.offsetX < yAxis.right) {
          // if the mouse is on the left of the y-axis
          canvas.style.cursor = 'pointer'; // change cursor to pointer
        } else {
          canvas.style.cursor = 'default'; // else change it back to default
        }
      };

      canvas.onmouseout = () => {
        canvas.style.cursor = 'default'; // ensure cursor is returned to default when not over the canvas
      };
    }
  }

  ngOnChanges({ outliers }: SimpleChanges): void {
    if (outliers) {
      const labels: string[] = [];
      const data: number[] = [];
      const backgroundColor: string[] = [];
      this.outliers.forEach((outlier) => {
        labels.push(`${outlier.clientId}`);
        data.push(outlier.amount);
        backgroundColor.push(outlier.amount >= 0 ? '#FF5050' : '#2EA63A');
      });
      this.localBarChartData = { labels, datasets: [{ data, backgroundColor }] };
    }
  }

  onSelectTab(type: unknown): void {
    this.selectTab.emit(type as OutlierType);
  }

  #openClientDashboard(index: number): void {
    console.log(index);
  }
}
