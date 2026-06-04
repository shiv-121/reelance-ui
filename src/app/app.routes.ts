import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login/login')
        .then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/pages/register/register')
        .then(m => m.Register)
  },

  {
    path: 'brand',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./brand/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'influencer',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./influencer/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];