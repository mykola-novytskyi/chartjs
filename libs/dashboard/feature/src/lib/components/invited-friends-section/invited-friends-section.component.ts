import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LabelColor, LineChartComponent } from '@chartjs/components';

@Component({
  selector: 'ia-invited-friends-section',
  standalone: true,
  imports: [CommonModule, LineChartComponent],
  templateUrl: './invited-friends-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitedFriendsSectionComponent {
  @Input({ required: true }) entities!: { [key: string]: number[] };

  readonly labelColors: LabelColor[] = [{ label: 'Invited friends', color: '#179C24' }];
}
