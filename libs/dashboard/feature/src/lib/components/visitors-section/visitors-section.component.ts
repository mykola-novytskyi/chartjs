import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelColor, LineChartComponent, TabsComponent } from '@chartjs/components';

@Component({
  selector: 'ia-visitors-section',
  standalone: true,
  imports: [CommonModule, LineChartComponent, TabsComponent],
  templateUrl: './visitors-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitorsSectionComponent {
  @Input({ required: true }) entities!: { [key: string]: number[] };

  readonly labelColors: LabelColor[] = [
    { label: 'Registrations', color: '#FEDB4D' },
    { label: 'All Users visiting', color: '#179C24' },
    { label: 'Active by Deposit', color: '#8583FF' },
    { label: 'Active by Balance', color: '#F66666' },
    { label: 'Active by Bet', color: '#6D6D85' },
  ];

  readonly hiddenLines = signal<boolean[]>([false, false]);

  onToggleLegend(index: number): void {
    this.hiddenLines.update((lines) => {
      const newHiddenLines = [...lines];
      newHiddenLines[index] = !lines[index];

      return newHiddenLines;
    });
  }
}
