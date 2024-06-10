import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import DashboardPageComponent from '../../../../libs/dashboard/feature/src/lib/dashboard-page.component';
import { TimePeriodFacade } from '@chartjs/da';

@Component({
  standalone: true,
  imports: [DashboardPageComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chartjs';
}
