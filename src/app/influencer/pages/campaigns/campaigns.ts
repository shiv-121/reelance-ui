import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Campaign } from '../../models/campaign';
import { CampaignApplicationRequest } from '../../models/campaign-application-request';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaigns.html',
  styleUrl: './campaigns.css',
})
export class Campaigns implements OnInit {

  private campaignService = inject(CampaignService);

  protected campaigns: Campaign[] = [];
  protected loading = false;
  protected error: string | null = null;
  protected successMessage: string | null = null;

  protected selectedCampaignId: number | null = null;
  protected showApplyForm = false;

  protected applicationForm: CampaignApplicationRequest = {
    campaignId: 0,
    proposal: '',
    expectedPrice: 0,
    portfolioLink: ''
  };

  ngOnInit(): void {
    this.loadCampaigns();
  }

  protected loadCampaigns(): void {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.campaignService.getOpenCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load campaigns';
        console.error(err);
        this.loading = false;
      }
    });
  }

  protected openApplyForm(campaignId: number): void {
    this.selectedCampaignId = campaignId;
    this.showApplyForm = true;
    this.applicationForm = {
      campaignId,
      proposal: '',
      expectedPrice: 0,
      portfolioLink: ''
    };
    this.error = null;
  }

  protected closeApplyForm(): void {
    this.showApplyForm = false;
    this.selectedCampaignId = null;
    this.applicationForm = {
      campaignId: 0,
      proposal: '',
      expectedPrice: 0,
      portfolioLink: ''
    };
  }

  protected submitApplication(): void {
    if (!this.isApplicationFormValid()) {
      this.error = 'Please fill all required fields';
      return;
    }

    this.loading = true;
    this.campaignService.applyToCampaign(this.applicationForm).subscribe({
      next: () => {
        this.successMessage = 'Application submitted successfully!';
        this.closeApplyForm();
        this.loading = false;
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
      },
      error: (err) => {
        this.error = 'Failed to submit application';
        console.error(err);
        this.loading = false;
      }
    });
  }

  protected isApplicationFormValid(): boolean {
    return !!(
      this.applicationForm.proposal &&
      this.applicationForm.expectedPrice > 0
    );
  }

  protected getCampaignStatusClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'bg-success';
      case 'CLOSED':
        return 'bg-secondary';
      case 'COMPLETED':
        return 'bg-info';
      default:
        return 'bg-dark';
    }
  }
}

