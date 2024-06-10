import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelColor, LineChartComponent, Tab, TabsComponent } from '@chartjs/components';
import { PaymentPerformanceTab } from '@chartjs/da';

const timeLabels: LabelColor[] = [
  { label: 'Deposits', color: '#FEDB4D' },
  { label: 'Withdrawals', color: '#8583FF' },
];

const numberLabels: LabelColor[] = [{ label: '% of manual withdrawals', color: '#FF6666' }];

const hiddenTimeLines = [false, false];
const hiddenNumberLines = [false];

@Component({
  selector: 'ia-payment-performance-section',
  standalone: true,
  imports: [CommonModule, LineChartComponent, TabsComponent],
  templateUrl: './payment-performance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPerformanceComponent implements OnChanges {
  @Input({ required: true }) entities!: { [key: string]: number[] };
  @Input({ required: true }) selectedTab!: PaymentPerformanceTab;

  @Output() selectTab = new EventEmitter<PaymentPerformanceTab>();

  readonly tabs: Tab<PaymentPerformanceTab>[] = [
    { name: 'Time', value: 'time' },
    { name: 'Percentage', value: 'percentage' },
  ];

  labelColors: LabelColor[] = timeLabels;

  readonly hiddenLines = signal<boolean[]>(hiddenTimeLines);

  ngOnChanges({ selectedTab }: SimpleChanges) {
    if (selectedTab) {
      this.labelColors = this.selectedTab === 'time' ? timeLabels : numberLabels;
      const currentLines = this.selectedTab === 'time' ? hiddenTimeLines : hiddenNumberLines;
      this.hiddenLines.set([...currentLines]);
    }
  }

  onSelectTab(tab: unknown): void {
    this.selectTab.emit(tab as PaymentPerformanceTab);
  }

  onToggleLegend(index: number): void {
    const currentLines = this.selectedTab === 'time' ? hiddenTimeLines : hiddenNumberLines;
    currentLines[index] = !currentLines[index];
    this.hiddenLines.set([...currentLines]);
  }
}
