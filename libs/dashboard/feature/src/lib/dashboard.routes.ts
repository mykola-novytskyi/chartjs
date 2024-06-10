import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./dashboard-page.component'),
  },
] as Route[];
