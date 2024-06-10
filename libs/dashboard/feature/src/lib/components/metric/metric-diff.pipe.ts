import { Pipe, PipeTransform } from '@angular/core';
import { Metric, TimePeriodType } from '@ia/dashboard/da';

@Pipe({
  name: 'metricDiff',
  standalone: true,
})
export class MetricDiffPipe implements PipeTransform {
  transform(metric: Metric, timePeriodType: TimePeriodType): string {
    const value = ((metric.value - metric.compareValue) / metric.compareValue) * 100;
    let metricValue = `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

    if ([null, undefined].includes(metric.value) || [null, undefined].includes(metric.compareValue)) {
      metricValue = '';
    } else if (metric.compareValue === 0) {
      metricValue = metric.value === 0 ? '<div class="rotate-90 inline-block">8</div> ' : '--';
    }

    return `${metricValue} ${this.#getTimePeriod(timePeriodType)}`;
  }

  #getTimePeriod(timePeriodType: TimePeriodType): string {
    switch (timePeriodType) {
      case TimePeriodType.Yesterday:
        return 'd/d';
      case TimePeriodType.WeekToDate:
        return 'w/w';
      case TimePeriodType.MonthToDate:
        return 'm/m';
      case TimePeriodType.TwoMonthToDate:
        return '2m/2m';
      case TimePeriodType.ThreeMonthToDate:
        return '3m/3m';
      case TimePeriodType.YearToDate:
        return 'yr/yr';
      default:
        return '';
    }
  }
}
