import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { LetDirective } from '@ngrx/component';
import { BetsSectionComponent } from './components/bets-section/bets-section.component';
import { BetsTypeSectionComponent } from './components/bets-type-section/bets-type-section.component';
import { PaymentSystemsSectionComponent } from './components/payment-systems-section/payment-systems-section.component';
import {
  DepositAndWithdrawalSectionComponent
} from './components/deposit-and-withdrawal-section/deposit-and-withdrawal-section.component';
import { RouterLink } from '@angular/router';
import { AverageSectionComponent } from './components/average-section/average-section.component';
import { FormsModule } from '@angular/forms';
import { DepositsSectionComponent } from './components/deposits-section/deposits-section.component';
import { VisitorsSectionComponent } from './components/visitors-section/visitors-section.component';
import { GgrSectionComponent } from './components/ggr-section/ggr-section.component';
import { BetsByProductSectionComponent } from './components/bets-by-product-section/bets-by-product-section.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { OutlierSectionComponent } from './components/outlier-section/outlier-section.component';
import { PaymentPerformanceComponent } from './components/payment-performance/payment-performance.component';
import { ActiveUsersSectionComponent } from './components/active-users-section/active-users-section.component';
import { FdrSectionComponent } from './components/fdr-section/fdr-section.component';
import { InvitedFriendsSectionComponent } from './components/invited-friends-section/invited-friends-section.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import {
  ActiveUsersFacade,
  AverageFacade,
  AverageType,
  BetsByProductFacade,
  BetsByProductType,
  BetsByProvidersFacade,
  BetsFacade,
  BetsType,
  BetsTypeFacade,
  BetTab,
  DepositsFacade,
  DepositType,
  DepositWithdrawalFacade,
  FdrFacade,
  GGRFacade,
  InvitedFriendsFacade,
  OutlierFacade,
  OutlierType,
  PaymentPerformanceFacade,
  PaymentPerformanceTab,
  PaymentSystemsFacade,
  ProductPerformanceFacade,
  VisitorsFacade
} from '@chartjs/da';
import { DataLoadingDirective } from './directives/data-loading.directive';

@Component({
  selector: 'ia-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    LetDirective,
    BetsSectionComponent,
    BetsTypeSectionComponent,
    PaymentSystemsSectionComponent,
    DepositAndWithdrawalSectionComponent,
    RouterLink,
    AverageSectionComponent,
    FormsModule,
    DepositsSectionComponent,
    VisitorsSectionComponent,
    GgrSectionComponent,
    BetsByProductSectionComponent,
    DataLoadingDirective,
    MatProgressSpinnerModule,
    MatButtonModule,
    OutlierSectionComponent,
    PaymentPerformanceComponent,
    ActiveUsersSectionComponent,
    FdrSectionComponent,
    InvitedFriendsSectionComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styles: [
    `
      header {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.06);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DatePipe,
    MatBottomSheet,
    ProductPerformanceFacade,
    BetsFacade,
    BetsTypeFacade,
    PaymentSystemsFacade,
    DepositWithdrawalFacade,
    BetsByProvidersFacade,
    AverageFacade,
    DepositsFacade,
    VisitorsFacade,
    GGRFacade,
    BetsByProductFacade,
    OutlierFacade,
    PaymentPerformanceFacade,
    ActiveUsersFacade,
    FdrFacade,
    CurrencyPipe,
    DecimalPipe,
    InvitedFriendsFacade,
    provideCharts(withDefaultRegisterables())
  ]
})
export default class DashboardPageComponent {
  @HostBinding('class') private readonly classes = 'bg-blue-10 block';

  readonly productPerformanceFacade = inject(ProductPerformanceFacade);
  readonly betsFacade = inject(BetsFacade);
  readonly betsTypeFacade = inject(BetsTypeFacade);
  readonly paymentSystemsFacade = inject(PaymentSystemsFacade);
  readonly betsByProvidersFacade = inject(BetsByProvidersFacade);
  // // readonly topEventsFacade = inject(TopEventsFacade);
  readonly depositWithdrawalFacade = inject(DepositWithdrawalFacade);
  readonly averageFacade = inject(AverageFacade);
  readonly depositsFacade = inject(DepositsFacade);
  readonly visitorsFacade = inject(VisitorsFacade);
  readonly ggrFacade = inject(GGRFacade);
  readonly betsByProductFacade = inject(BetsByProductFacade);
  readonly paymentPerformanceFacade = inject(PaymentPerformanceFacade);
  readonly outlierFacade = inject(OutlierFacade);
  readonly fdrFacade = inject(FdrFacade);
  readonly activeUsersFacade = inject(ActiveUsersFacade);
  readonly invitedFriendsFacade = inject(InvitedFriendsFacade);

  onSelectBetTab(type: BetTab): void {
    this.betsFacade.setCurrentType(type);
  }

  onSelectOutlier(type: OutlierType): void {
    this.outlierFacade.setCurrentType(type);
  }

  onSelectBetsTab(type: BetsType): void {
    this.betsTypeFacade.setCurrentType(type);
  }

  onSelectAverageTab(type: AverageType): void {
    this.averageFacade.setCurrentType(type);
  }

  onSelectDepositType(type: DepositType) {
    this.depositsFacade.changeCurrentType(type);
  }

  onSelectBetsProfitType(type: BetsByProductType) {
    this.betsByProductFacade.changeCurrentType(type);
  }

  onSelectPaymentPerformanceTab(tab: PaymentPerformanceTab) {
    this.paymentPerformanceFacade.changeCurrentTab(tab);
  }
}
