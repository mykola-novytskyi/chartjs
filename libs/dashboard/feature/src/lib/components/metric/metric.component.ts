import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Metric, METRIC_DESCRIPTION, MetricId, TimePeriodType } from '@ia/dashboard/da';
import { MatIconModule } from '@angular/material/icon';
import { MetricDiffPipe } from './metric-diff.pipe';
import { MetricArrowPipe } from '../../pipes/metric-arrow.pipe';
import { MetricValuePipe } from './metric-value.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { transformEnumToObjectRecord } from '@ia/shared/util';

@Component({
  selector: 'ia-metric',
  standalone: true,
  imports: [CommonModule, MatIconModule, MetricDiffPipe, MetricArrowPipe, MetricValuePipe, MatMenuModule],
  templateUrl: './metric.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricComponent {
  @Input({ required: true }) metric!: Metric;
  @Input({ required: true }) timePeriodType!: TimePeriodType;
  @Input({ required: true }) isOneDaySelected!: boolean;
  @Input({ required: true }) loading!: boolean;
  @Input() currencyCode = 'USD';

  readonly TimePeriodType = TimePeriodType;
  readonly METRIC_TITLE = transformEnumToObjectRecord(MetricId);
  readonly METRIC_DESCRIPTION = METRIC_DESCRIPTION;

  @HostBinding('class') private readonly hostClasses =
    'relative flex rounded-lg bg-white h-28 pt-3 pb-2 flex-col items-center';
}
