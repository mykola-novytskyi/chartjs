import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelColor, LineChartComponent, TabsComponent } from '@chartjs/components';

@Component({
  selector: 'ia-fdr-section',
  standalone: true,
  imports: [CommonModule, LineChartComponent, TabsComponent],
  templateUrl: './fdr-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FdrSectionComponent {
  @Input({ required: true }) entities!: { [key: string]: [number] };

  readonly labelColors: LabelColor[] = [{ label: 'First Deposit Rate', color: '#179C24' }];
}
