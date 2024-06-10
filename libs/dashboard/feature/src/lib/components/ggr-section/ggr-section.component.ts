import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelColor, LineChartComponent } from '@chartjs/components';

@Component({
  selector: 'ia-ggr-section',
  standalone: true,
  imports: [CommonModule, LineChartComponent],
  templateUrl: './ggr-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GgrSectionComponent {
  @Input({ required: true }) entities!: { [key: string]: number[] };

  readonly labelColors: LabelColor[] = [
    { label: 'Sportsbook', color: '#FEDB4D' },
    { label: 'Casino', color: '#8583FF' },
    { label: 'Total', color: '#179C24' },
  ];

  readonly hiddenLines = signal<boolean[]>([false, false, false]);

  onToggleLegend(index: number): void {
    this.hiddenLines.update((lines) => {
      const newHiddenLines = [...lines];
      newHiddenLines[index] = !lines[index];

      return newHiddenLines;
    });
  }
}
