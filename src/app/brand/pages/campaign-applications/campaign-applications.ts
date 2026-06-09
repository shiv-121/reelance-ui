import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CampaignService } from '../../services/campaign.service';
import { Application } from '../../models/application';

@Component({
  selector: 'app-campaign-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-applications.html',
  styleUrl: './campaign-applications.css'
})
export class CampaignApplications implements OnInit {

  private service = inject(CampaignService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  applications: Application[] = [];
  loading = false;
  campaignId = 0;
  successMessage = '';

  ngOnInit(): void {
    this.campaignId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.service.getCampaignApplications(this.campaignId).subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  acceptApplication(applicationId: number): void {
    if (!confirm('Accept this application?')) {
      return;
    }

    this.service.acceptApplication(applicationId).subscribe(() => {
      this.successMessage = 'Application accepted';
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
      this.loadApplications();
    });
  }

  rejectApplication(applicationId: number): void {
    if (!confirm('Reject this application?')) {
      return;
    }

    this.service.rejectApplication(applicationId).subscribe(() => {
      this.successMessage = 'Application rejected';
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
      this.loadApplications();
    });
  }

  goBack(): void {
    this.router.navigate(['/brand/campaigns']);
  }
}
