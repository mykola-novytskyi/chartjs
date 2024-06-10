import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from 'chart.js';
import { DoughnutChartComponent, Tab, TabsComponent } from '@chartjs/components';
import { BetsType, BetsTypeData } from '@chartjs/da';
import { TitleValue } from '../../interfaces/title-value.interface';

const DONUTS = {
  Singles: { title: 'Singles', color: '#8583FF' },
  Multiples: { title: 'Multiples', color: '#FEDB4D' },
  System: { title: 'System', color: '#F66666' },
  Chain: { title: 'Chain', color: '#6D6D85' },
};

@Component({
  selector: 'ia-bets-type-section',
  standalone: true,
  imports: [CommonModule, TabsComponent, DoughnutChartComponent],
  templateUrl: './bets-type-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetsTypeSectionComponent implements OnChanges {
  @Input({ required: true }) bet!: BetsTypeData;
  @Input({ required: true }) selectedTab!: BetsType;

  @Output() selectTab = new EventEmitter<BetsType>();

  readonly tabs: Tab[] = [
    { name: 'Sports', value: 'Sports' },
    { name: 'eSport', value: 'eSport' },
  ];
  titleValues: TitleValue[] = [];
  doughnutChartData: ChartData<'doughnut'> = {
    labels: [DONUTS.Singles.title, DONUTS.Multiples.title, DONUTS.System.title, DONUTS.Chain.title],
    datasets: [
      {
        data: [],
        backgroundColor: [DONUTS.Singles.color, DONUTS.Multiples.color, DONUTS.System.color, DONUTS.Chain.color],
      },
    ],
  };

  chartData: number[] = [];

  ngOnChanges({ bet }: SimpleChanges) {
    if (bet) {
      this.titleValues = [
        { title: 'Total', value: this.bet.Total },
        { title: 'Live', value: this.bet.Live },
        { title: 'PreMatch', value: this.bet.PreMatch },
      ];

      this.chartData = [this.bet.Singles, this.bet.Multiples, this.bet.System, this.bet.Chain];
    }
  }

  onSelectTab(type: BetsType): void {
    this.selectTab.emit(type);
  }
}
