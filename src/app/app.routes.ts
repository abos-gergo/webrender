import { Routes } from '@angular/router';
import { PlaceholderComponent } from './auth/placeholder/placeholder.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    component: PlaceholderComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
