import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Application } from '../../models/application';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications implements OnInit {

  private campaignService = inject(CampaignService);

  protected applications: Application[] = [];
  protected loading = false;
  protected error: string | null = null;

  ngOnInit(): void {
    this.loadApplications();
  }

  protected loadApplications(): void {
    this.loading = true;
    this.error = null;

    this.campaignService.getMyApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load applications';
        console.error(err);
        this.loading = false;
      }
    });
  }

  protected getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-warning text-dark';
      case 'ACCEPTED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  protected getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bi-clock-history';
      case 'ACCEPTED':
        return 'bi-check-circle-fill';
      case 'REJECTED':
        return 'bi-x-circle-fill';
      default:
        return 'bi-question-circle';
    }
  }
}

