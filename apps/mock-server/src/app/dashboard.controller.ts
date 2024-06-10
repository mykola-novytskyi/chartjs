import { Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { timePeriods } from '../data/dashboard/time-periods';
import { metrics } from '../data/dashboard/metrics';
import { bets } from '../data/dashboard/bets';
import { productPerformance } from '../data/dashboard/product-perfomance';
import { betTypes } from '../data/dashboard/bet-types';
import { depositsAndWithdrawals } from '../data/dashboard/deposits-and-withdrawals';
import { payments } from '../data/dashboard/payments';
import { topEvents } from '../data/dashboard/top-events';
import { averageData } from '../data/dashboard/average-data';
import { betsByProviders } from '../data/dashboard/bets-by-providers';
import { utm } from '../data/dashboard/utm';
import { btag } from '../data/dashboard/btag';
import { deposits } from '../data/dashboard/deposits';
import { visitors } from '../data/dashboard/visitors';
import { ggr } from '../data/dashboard/ggr';
import { betsByProduct } from '../data/dashboard/bets-by-product';
import { totalBets } from '../data/dashboard/total-bets';
import { outliers } from '../data/dashboard/outlier';
import { percentagePaymentPerformance, timePaymentPerformance } from '../data/dashboard/payment-performance';
import { affiliate } from '../data/dashboard/affiliate';
import { activeUsers } from '../data/dashboard/active-users';
import { fdr } from '../data/dashboard/fdr';

type PaymentPerformanceTab = 'time' | 'percentage';

@Controller('api/dashboard')
export class DashboardController {
  @Get('time-periods')
  getTimePeriods() {
    return timePeriods;
  }

  @Get('metrics')
  getMetrics(@Res() res: any) {
    // return metrics;
    setTimeout(() => res.send(metrics), 5000);
  }

  @Get('bets')
  getBets(@Res() res: any) {
    // return bets;
    setTimeout(() => res.send(bets), 5000);
  }

  @Get('total-bets')
  getTotalBets() {
    return totalBets;
  }

  @Get('bet-types')
  getBetsType() {
    return betTypes;
  }

  @Get('product-performance')
  getProductPerformance(@Res() res: any) {
    // return productPerformance;
    setTimeout(() => res.send(productPerformance), 2000);
  }

  @Get('deposits-and-withdrawals')
  getDepositsAndWithdrawals() {
    return depositsAndWithdrawals;
  }

  @Get('top-events')
  getPopular() {
    return topEvents;
  }

  @Get('deposit-line-chart')
  getAverageDepositData() {
    return averageData;
  }

  @Get('withdraw-line-chart')
  getAverageWithdrawalData() {
    return averageData;
  }

  @Get('sb-line-chart')
  getAverageBetsData() {
    return averageData;
  }

  @Get('payment-systems')
  getPaymentSystems() {
    return payments;
  }

  @Get('bets-by-providers')
  getBetsByProviders() {
    return betsByProviders;
  }

  @Get('utm')
  getUtm() {
    return utm;
  }

  @Get('btag')
  getBtag() {
    return btag;
  }

  @HttpCode(200)
  @Post('update-metric-tile-order')
  // @typescript-eslint/no-empty-function
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateOrder() {}

  @Get('deposits')
  getDeposits() {
    return deposits;
  }

  @Get('visitors')
  getVisitors() {
    return visitors;
  }

  @Get('ggr')
  getGgr() {
    return ggr;
  }

  @Get('bets-by-product')
  getBetsByType() {
    return betsByProduct;
  }

  @Get('biggest-winner-losers')
  getBiggestWinnerLosers() {
    return outliers;
  }

  @Get('affiliate')
  getAffiliate() {
    return affiliate;
  }

  @Get('active-clients')
  getActiveUsers() {
    return activeUsers;
  }

  @Get('payment-indicator')
  getPaymentPerformance(@Query('tab') tab: PaymentPerformanceTab) {
    if (tab === 'time') {
      return timePaymentPerformance;
    }

    return percentagePaymentPerformance;
  }

  @Get('fdr')
  getFdr() {
    return fdr;
  }
}
