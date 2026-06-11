import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

    {
  path: 'profile/edit',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./pages/profile-edit/profile-edit')
      .then(m => m.ProfileEdit)
},

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
    redirectTo: 'brand/dashboard',
    pathMatch: 'full'
  },

  {
    path: 'brand/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./brand/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'brand/campaigns',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./brand/pages/campaigns/campaigns')
        .then(m => m.Campaigns)
  },

  {
    path: 'brand/campaigns/:id/applications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./brand/pages/campaign-applications/campaign-applications')
        .then(m => m.CampaignApplications)
  },

  {
    path: 'brand/campaigns/:id/participants',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./brand/pages/campaign-participants/campaign-participants')
        .then(m => m.CampaignParticipants)
  },

  {
    path: 'influencer',
    redirectTo: 'influencer/dashboard',
    pathMatch: 'full'
  },

  {
    path: 'influencer/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./influencer/pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'influencer/campaigns',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./influencer/pages/campaigns/campaigns')
        .then(m => m.Campaigns)
  },

  {
    path: 'influencer/applications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./influencer/pages/applications/applications')
        .then(m => m.Applications)
  },

  {
    path: 'influencer/my-campaigns',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./influencer/pages/my-campaigns/my-campaigns')
        .then(m => m.MyCampaigns)
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile')
        .then(m => m.Profile)
  },

  {
    path: 'profile/setup',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './influencer/pages/profile-setup/profile-setup'
      ).then(
        m => m.ProfileSetup
      )
  },

  {
    path: 'brand/influencers',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './brand/pages/influencers/influencers'
      ).then(
        m => m.Influencers
      )
  },

  {
    path: 'brand/influencers/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './brand/pages/influencer-detail/influencer-detail'
      ).then(
        m => m.InfluencerDetail
      )
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];