import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepositType } from '@chartjs/da';
import { LabelColor, LineChartComponent, Tab, TabsComponent } from '@chartjs/components';

@Component({
  selector: 'ia-deposits-section',
  standalone: true,
  imports: [CommonModule, TabsComponent, LineChartComponent],
  templateUrl: './deposits-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositsSectionComponent {
  @Input({ required: true }) entities!: { [key: string]: number[] };
  @Input({ required: true }) selectedTab!: DepositType;

  @Output() selectTab = new EventEmitter<DepositType>();

  readonly tabs: Tab[] = [
    { name: 'Number', value: 0 },
    { name: 'Amount', value: 1 },
  ];

  readonly labelColors: LabelColor[] = [
    { label: 'First', color: '#FEDB4D' },
    { label: 'All', color: '#179C24' },
  ];

  readonly hiddenLines = signal<boolean[]>([false, false]);

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
