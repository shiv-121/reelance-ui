import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { Campaign } from '../../models/campaign';
import { CreateCampaignRequest } from '../../models/create-campaign-request';
import { CampaignWorkspaceResponse } from '../../models/campaign-page-response';
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
  protected searchTerm = '';
  protected statusFilter = '';
  protected nicheFilter = '';
  protected sortValue = 'createdAt,desc';
  protected page = 0;
  protected pageSize = 5;
  protected totalPages = 0;
  protected totalElements = 0;
  protected currentPageLabel = 1;
  protected summary = {
    totalCampaigns: 0,
    openCampaigns: 0,
    closedCampaigns: 0,
    completedCampaigns: 0,
    totalBudget: 0
  };

  private searchSubject = new Subject<string>();

  protected createForm: CreateCampaignRequest = {
    title: '',
    description: '',
    budget: 0,
    niche: '',
    deadline: ''
  };

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.searchTerm = value;
      this.page = 0;
      this.loadCampaigns();
    });

    this.loadCampaigns();
  }

  protected loadCampaigns(): void {
    this.loading = true;
    this.error = null;

    this.campaignService.getBrandCampaignsPage(
      this.page,
      this.pageSize,
      this.searchTerm || undefined,
      this.statusFilter || undefined,
      this.nicheFilter || undefined,
      this.sortValue || undefined
    ).subscribe({
      next: (data: CampaignWorkspaceResponse) => {
        this.campaigns = data.campaigns as Campaign[];
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.pageSize = data.pageSize;
        this.page = data.currentPage;
        this.currentPageLabel = data.currentPage + 1;
        this.summary = {
          totalCampaigns: data.totalCampaigns,
          openCampaigns: data.openCampaigns,
          closedCampaigns: data.closedCampaigns,
          completedCampaigns: data.completedCampaigns,
          totalBudget: data.totalBudget
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Unable to load campaigns.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  protected onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  protected onStatusChange(value: string): void {
    this.statusFilter = value === 'All' ? '' : value;
    this.page = 0;
    this.loadCampaigns();
  }

  protected onNicheChange(value: string): void {
    this.nicheFilter = value;
    this.page = 0;
    this.loadCampaigns();
  }

  protected onSortChange(value: string): void {
    this.sortValue = value;
    this.page = 0;
    this.loadCampaigns();
  }

  protected nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page += 1;
      this.loadCampaigns();
    }
  }

  protected previousPage(): void {
    if (this.page > 0) {
      this.page -= 1;
      this.loadCampaigns();
    }
  }

  protected toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  protected retry(): void {
    this.loadCampaigns();
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

