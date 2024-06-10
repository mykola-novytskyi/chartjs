import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from 'chart.js';
import { DoughnutChartComponent, DoughnutChartType } from '@chartjs/components';
import { PaymentSystemsDTO } from '@chartjs/da';
import { TitleValue } from '../../interfaces/title-value.interface';

const backgroundColor = ['#8583FF', '#F66666', '#FEDB4D', '#6D6D85', '#5DBA66'];

interface LocalPayment {
  title: string;
  value: number;
  values: number[];
  labels: string[];
  doughnutChartData: ChartData<'doughnut'>;
}

@Component({
  selector: 'ia-payment-systems-section',
  standalone: true,
  imports: [CommonModule, DoughnutChartComponent],
  templateUrl: './payment-systems-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSystemsSectionComponent implements OnChanges {
  @Input({ required: true }) payment!: PaymentSystemsDTO;

  readonly DoughnutChartType = DoughnutChartType;

  payments: LocalPayment[] = [
    {
      title: 'Deposits',
      value: 0,
      values: [],
      labels: [],
      doughnutChartData: { datasets: [{ data: [], backgroundColor }] },
    },
    {
      title: 'Withdrawals',
      value: 0,
      values: [],
      labels: [],
      doughnutChartData: { datasets: [{ data: [], backgroundColor }] },
    },
  ];

  ngOnChanges({ payment }: SimpleChanges) {
    if (payment) {
      this.payments = [
        {
          title: 'Deposits',
          value: this.payment.deposit.value,
          values: this.payment.deposit.providers.map((titleValue: TitleValue) => titleValue.value),
          // @ts-ignore
          labels: this.payment.deposit.providers.map((titleValue) => titleValue.title),
          doughnutChartData: { datasets: [{ data: [], backgroundColor }] },
        },
        {
          title: 'Withdrawals',
          value: this.payment.withdrawal.value,
          values: this.payment.withdrawal.providers.map((titleValue: TitleValue) => titleValue.value),
          // @ts-ignore
          labels: this.payment.withdrawal.providers.map((titleValue) => titleValue.title),
          doughnutChartData: { datasets: [{ data: [], backgroundColor }] },
        },
      ];
    }
  }
}
