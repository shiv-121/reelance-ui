import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Campaign } from '../../models/campaign';
import { CreateCampaignRequest } from '../../models/create-campaign-request';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './campaigns.html',
  styleUrl: './campaigns.css',
})
export class Campaigns implements OnInit {

  private campaignService = inject(CampaignService);

  protected campaigns: Campaign[] = [];
  protected showCreateForm = false;
  protected loading = false;
  protected error: string | null = null;

  protected createForm: CreateCampaignRequest = {
    title: '',
    description: '',
    budget: 0,
    niche: '',
    deadline: ''
  };

  ngOnInit(): void {
    this.loadCampaigns();
  }

  protected loadCampaigns(): void {
    this.loading = true;
    this.error = null;

    this.campaignService.getMyCampaigns().subscribe({
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

  protected toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  protected submitCreateCampaign(): void {
    if (!this.isFormValid()) {
      this.error = 'Please fill all fields';
      return;
    }

    this.loading = true;
    this.campaignService.createCampaign(this.createForm).subscribe({
      next: (newCampaign) => {
        this.campaigns.push(newCampaign);
        this.resetForm();
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create campaign';
        console.error(err);
        this.loading = false;
      }
    });
  }

  protected closeCampaign(id: number): void {
    if (confirm('Are you sure you want to close this campaign?')) {
      this.loading = true;
      this.campaignService.closeCampaign(id).subscribe({
        next: (updatedCampaign) => {
          const index = this.campaigns.findIndex(c => c.campaignId === id);
          if (index > -1) {
            this.campaigns[index] = updatedCampaign;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to close campaign';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  protected completeCampaign(id: number): void {
    if (confirm('Are you sure you want to complete this campaign?')) {
      this.loading = true;
      this.campaignService.completeCampaign(id).subscribe({
        next: (updatedCampaign) => {
          const index = this.campaigns.findIndex(c => c.campaignId === id);
          if (index > -1) {
            this.campaigns[index] = updatedCampaign;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to complete campaign';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  protected isFormValid(): boolean {
    return !!(
      this.createForm.title &&
      this.createForm.description &&
      this.createForm.budget > 0 &&
      this.createForm.niche &&
      this.createForm.deadline
    );
  }

  private resetForm(): void {
    this.createForm = {
      title: '',
      description: '',
      budget: 0,
      niche: '',
      deadline: ''
    };
    this.error = null;
  }
}

