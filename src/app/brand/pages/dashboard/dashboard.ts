import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { BrandDashboardService } from '../../services/brand-dashboard.service';
import { BrandDashboardResponse } from '../../models/brand-dashboard-response';

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

  private dashboardService = inject(BrandDashboardService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.hasError = false;

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.isLoading = false;
      },
      error: () => {
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

  get recentCampaigns() {
    return this.dashboard?.recentCampaigns ?? [];
  }

  get recentApplications() {
    return this.dashboard?.recentApplications ?? [];
  }

  navigateToCard(route: string, queryParams?: Record<string, string>): void {
    this.router.navigate([route], { queryParams });
  }
}