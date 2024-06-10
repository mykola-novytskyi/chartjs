import { inject, Pipe, PipeTransform } from '@angular/core';
import { Metric, MetricType } from '@ia/dashboard/da';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Pipe({
  name: 'metricValue',
  standalone: true,
})
export class MetricValuePipe implements PipeTransform {
  #currencyPipe = inject(CurrencyPipe);
  #decimalPipe = inject(DecimalPipe);

  transform(metric: Metric, currency = 'USD', property: keyof Metric = 'value'): string {
    if ([MetricType.Decimal, MetricType.Integer].includes(metric.type)) {
      return this.#decimalPipe.transform(metric[property]) as string;
    } else if (metric.type === MetricType.Percentage) {
      return [null, undefined].includes(metric[property]) ? '' : `${metric[property]}%`;
    }

    return this.#currencyPipe.transform(metric[property], currency, 'symbol', '1.0-2') as string;
  }
}
