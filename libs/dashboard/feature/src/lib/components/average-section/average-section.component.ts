import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Tab, TabsComponent } from '@chartjs/components';
import { AverageType, GraphData } from '@chartjs/da';

const separator = '-';

@Component({
  selector: 'ia-average-section',
  standalone: true,
  imports: [CommonModule, TabsComponent, BaseChartDirective],
  templateUrl: './average-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AverageSectionComponent implements OnChanges {
  @Input({ required: true }) data!: GraphData[];
  @Input({ required: true }) selectedTab!: AverageType;
  @Input({ required: true }) average!: number;
  @Input({ required: true }) totalAmount!: number;
  @Input({ required: true }) totalCount!: number;

  @Output() selectTab = new EventEmitter<AverageType>();

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  readonly TYPE_COLOR: { [key in AverageType]: string } = {
    deposit: '#5DBA66',
    withdrawal: '#FF6666',
    bets: '#8583FF',
  };
  readonly tabs: Tab[] = [
    { name: 'Deposits', value: 'deposit' },
    { name: 'Withdrawals', value: 'withdrawal' },
    { name: 'SB Bets', value: 'bets' },
  ];
  readonly tabRecord: { [key in AverageType]: string } = {
    deposit: 'Deposits',
    withdrawal: 'Withdrawals',
    bets: 'Bets',
  };

  readonly chartData: ChartData<'bar'> = {
    datasets: [
      {
        data: [],
        backgroundColor: 'transparent',
      },
    ],
    labels: [],
  };

  readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.raw}`,
          title: ([{ label }]: any[]): string | string[] | void => label,
          labelColor: () => ({
            borderColor: `${this.TYPE_COLOR[this.selectedTab]}`,
            backgroundColor: `${this.TYPE_COLOR[this.selectedTab]}`,
            borderWidth: 3,
            borderRadius: 2,
          }),
        },
      },
    },
  };

  ngOnChanges({ selectedTab, data }: SimpleChanges) {
    if (selectedTab) {
      this.chartData.datasets[0].label = this.tabRecord[this.selectedTab];
      this.chartData.datasets[0].borderColor = this.TYPE_COLOR[this.selectedTab];
    }
    if (data) {
      const graphData: number[] = [];
      this.data.forEach((d) => {
        let i = 0;
        while (i < d.count) {
          graphData.push(d.amount);
          i++;
        }
      });

      graphData.sort((a: number, b: number) => a - b);
      // interval
      const max = Math.max(...graphData);
      const inter = max / (max / (graphData.length > 30 ? 2.5 : 0.5));

      // grouper par interval
      const grouped = [];
      for (const i of graphData) {
        const group = Math.floor(i / inter);
        grouped[group] ? grouped[group].push(i) : (grouped[group] = [i]);
      }

      // keep only first and last element from each group and separate by separator
      const grouped2: string[] = [];
      for (const i of grouped) {
        if (i) {
          grouped2.push(`${i[0]}${separator}${i[i.length - 1]}`);
        }
      }

      // if element from number equal included in the interval of a group from grouped2 , replace it by the group
      const grouped3: string[] = [];
      for (const i of graphData) {
        let found = false;
        for (const j of grouped2) {
          const group: number[] = j.split(separator).map((a) => +a);
          if (i >= group[0] && i <= group[1]) {
            grouped3.push(j);
            found = true;
            break;
          }
        }
        if (!found) {
          grouped3.push(`${i}`);
        }
      }
      // unique grouped
      const uniqueLabels = grouped3.filter(
        (value: string, index: number, array: string[]): boolean => array.indexOf(value) === index,
      );

      const wordCount = [];
      for (let i = 0; i < uniqueLabels.length; i++) {
        wordCount[i] = 0;
        for (const j of grouped3) {
          if (uniqueLabels[i] === j) {
            wordCount[i]++;
          }
        }
      }

      const labels = uniqueLabels.map((value) => {
        const group = value.split(separator).map((a) => +a);
        if (group[0] === group[1]) {
          return `$${group[0]}`;
        }
        return `$${group[0]}${separator}$${group[1]}`;
      });

      this.chartData.datasets[0].data = wordCount;
      this.chartData.datasets[0].backgroundColor = `${this.TYPE_COLOR[this.selectedTab]}`;
      this.chartData.labels = labels;
    }

    this.chart?.update();
  }

  onSelectTab(type: unknown): void {
    this.selectTab.emit(type as AverageType);
  }
}
