import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { BrandDashboardService } from '../../services/brand-dashboard.service';
import {
  BrandDashboardResponse,
  RecentCampaignSummary
} from '../../models/brand-dashboard-response';

@Component({
  selector: 'app-brand-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  dashboard: BrandDashboardResponse | null = null;

  isLoading = true;
  hasError = false;

  private dashboardService =
    inject(BrandDashboardService);

  private router =
    inject(Router);


  ngOnInit(): void {
    this.loadDashboard();
  }

  openCampaignApplications(campaignId: number): void {
  this.router.navigate([
    '/brand/campaigns',
    campaignId,
    'applications'
  ]);
}


  loadDashboard(): void {

    this.isLoading = true;
    this.hasError = false;

    this.dashboardService
      .getDashboard()
      .subscribe({

        next: (data) => {

          this.dashboard = data;

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'Failed to load brand dashboard:',
            error
          );

          this.hasError = true;
          this.isLoading = false;
        }

      });
  }


  get totalBudget(): number {
    return this.dashboard?.totalBudget ?? 0;
  }


  get pendingCount(): number {
    return this.dashboard?.pendingApplications ?? 0;
  }


  get acceptedCount(): number {
    return this.dashboard?.acceptedApplications ?? 0;
  }


  get totalCampaigns(): number {
    return this.dashboard?.totalCampaigns ?? 0;
  }


  get activeCampaigns(): number {
    return this.dashboard?.activeCampaigns ?? 0;
  }


  get completedCampaigns(): number {
    return this.dashboard?.completedCampaigns ?? 0;
  }


  get closedCampaigns(): number {
    return this.dashboard?.closedCampaigns ?? 0;
  }


  get totalApplications(): number {
    return this.dashboard?.totalApplications ?? 0;
  }


  get rejectedApplications(): number {
    return this.dashboard?.rejectedApplications ?? 0;
  }


  get acceptanceRate(): number {
    return this.dashboard?.acceptanceRate ?? 0;
  }


  get completionRate(): number {
    return this.dashboard?.completionRate ?? 0;
  }


  get recentCampaigns() {
    return this.dashboard?.recentCampaigns ?? [];
  }


  get recentApplications() {
    return this.dashboard?.recentApplications ?? [];
  }


  navigateToCard(
    route: string,
    queryParams?: Record<string, string>
  ): void {

    this.router.navigate(
      [route],
      { queryParams }
    );
  }


  openCampaign(
    campaignId: number
  ): void {

    this.router.navigate([
      '/brand/campaigns',
      campaignId
    ]);
  }


  openApplication(
    applicationId: number
  ): void {

    this.router.navigate([
      '/brand/applications',
      applicationId
    ]);
  }


  openCreator(
    creatorId: number
  ): void {

    this.router.navigate([
      '/brand/influencers',
      creatorId
    ]);
  }


  isOverdue(
    campaign: RecentCampaignSummary
  ): boolean {

    if (!campaign.deadline) {
      return false;
    }

    const deadline =
      new Date(
        `${campaign.deadline}T23:59:59`
      );

    return deadline.getTime() <
      Date.now();
  }


  getDaysRemaining(
    campaign: RecentCampaignSummary
  ): number | null {

    if (!campaign.deadline) {
      return null;
    }

    const deadline =
      new Date(
        `${campaign.deadline}T23:59:59`
      );

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    deadline.setHours(
      0,
      0,
      0,
      0
    );

    const difference =
      deadline.getTime() -
      today.getTime();

    return Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );
  }


  formatDate(
    value: string
  ): string {

    if (!value) {
      return '';
    }

    return new Intl.DateTimeFormat(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(
      new Date(value)
    );
  }


  formatDateTime(
    value: string
  ): string {

    if (!value) {
      return '';
    }

    return new Intl.DateTimeFormat(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(
      new Date(value)
    );
  }

}