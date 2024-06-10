import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelColor, LineChartComponent, Tab, TabsComponent } from '@chartjs/components';
import { DepositType } from '@chartjs/da';

@Component({
  selector: 'ia-bets-by-product-section',
  standalone: true,
  imports: [CommonModule, LineChartComponent, TabsComponent],
  templateUrl: './bets-by-product-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetsByProductSectionComponent {
  @Input({ required: true }) entities!: { [key: string]: number[] };
  @Input({ required: true }) selectedTab!: DepositType;

  @Output() selectTab = new EventEmitter<DepositType>();

  readonly tabs: Tab[] = [
    { name: 'Number', value: 0 },
    { name: 'Amount', value: 1 },
  ];

  readonly labelColors: LabelColor[] = [
    { label: 'Sportsbook', color: '#FEDB4D' },
    { label: 'Casino', color: '#8583FF' },
    { label: 'All', color: '#179C24' },
  ];

  readonly hiddenLines = signal<boolean[]>([false, false, false]);

  onSelectTab(type: unknown): void {
    this.selectTab.emit(type as DepositType);
  }

  onToggleLegend(index: number): void {
    this.hiddenLines.update((lines) => {
      const newHiddenLines = [...lines];
      newHiddenLines[index] = !lines[index];

      return newHiddenLines;
    });
  }
}
