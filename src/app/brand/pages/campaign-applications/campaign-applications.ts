import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CampaignService } from '../../services/campaign.service';
import { Application, ApplicationStatus } from '../../models/application';

@Component({
  selector: 'app-campaign-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-applications.html',
  styleUrl: './campaign-applications.css'
})
export class CampaignApplications implements OnInit, OnDestroy {

  private service = inject(CampaignService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  applications: Application[] = [];
  loading = false;
  campaignId = 0;
  successMessage = '';
  errorMessage = '';
  searchTerm = '';
  selectedStatus: ApplicationStatus | 'ALL' = 'ALL';
  readonly statusTabs: { label: string; status: ApplicationStatus | 'ALL' }[] = [
    { label: 'All', status: 'ALL' },
    { label: 'Pending', status: 'PENDING' },
    { label: 'Shortlisted', status: 'SHORTLISTED' },
    { label: 'Accepted', status: 'ACCEPTED' },
    { label: 'Rejected', status: 'REJECTED' }
  ];

  private updatingApplicationIds = new Set<number>();
  private noticeTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.campaignId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.errorMessage = '';
    this.service.getCampaignApplications(this.campaignId).subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load applications. Please try again.';
        this.loading = false;
      }
    });
  }

  acceptApplication(applicationId: number): void {
    this.updateApplicationStatus(applicationId, 'ACCEPTED');
  }

  shortlistApplication(applicationId: number): void {
    this.updateApplicationStatus(applicationId, 'SHORTLISTED');
  }

  rejectApplication(applicationId: number): void {
    this.updateApplicationStatus(applicationId, 'REJECTED');
  }

  get filteredApplications(): Application[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();

    return this.applications.filter((application) => {
      const matchesStatus = this.selectedStatus === 'ALL' || application.status === this.selectedStatus;
      const matchesSearch = !query ||
        application.influencerUsername.toLocaleLowerCase().includes(query) ||
        application.portfolioLink?.toLocaleLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }

  countForStatus(status: ApplicationStatus | 'ALL'): number {
    return status === 'ALL'
      ? this.applications.length
      : this.applications.filter((application) => application.status === status).length;
  }

  isUpdating(applicationId: number): boolean {
    return this.updatingApplicationIds.has(applicationId);
  }

  private updateApplicationStatus(applicationId: number, status: ApplicationStatus): void {
    const application = this.applications.find((item) => item.applicationId === applicationId);
    if (!application || this.isUpdating(applicationId) || !this.canTransition(application.status, status)) {
      return;
    }

    this.updatingApplicationIds = new Set(this.updatingApplicationIds).add(applicationId);
    this.successMessage = '';
    this.errorMessage = '';

    this.service.updateApplicationStatus(applicationId, status).subscribe({
      next: (updatedApplication) => {
        this.applications = this.applications.map((item) => item.applicationId === applicationId
          ? { ...item, ...updatedApplication, status: updatedApplication.status ?? status }
          : item);
        this.successMessage = `Application ${status.toLocaleLowerCase()}.`;
        this.startNoticeTimeout();
        this.finishUpdate(applicationId);
      },
      error: () => {
        this.errorMessage = 'Unable to update this application. Please try again.';
        this.finishUpdate(applicationId);
      }
    });
  }

  private canTransition(current: ApplicationStatus, next: ApplicationStatus): boolean {
    if (current === 'PENDING') {
      return next === 'SHORTLISTED' || next === 'ACCEPTED' || next === 'REJECTED';
    }

    return current === 'SHORTLISTED' && (next === 'ACCEPTED' || next === 'REJECTED');
  }

  private finishUpdate(applicationId: number): void {
    const updating = new Set(this.updatingApplicationIds);
    updating.delete(applicationId);
    this.updatingApplicationIds = updating;
  }

  private startNoticeTimeout(): void {
    if (this.noticeTimeout) {
      clearTimeout(this.noticeTimeout);
    }

    this.noticeTimeout = setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.noticeTimeout) {
      clearTimeout(this.noticeTimeout);
    }
  }

  goBack(): void {
    this.router.navigate(['/brand/campaigns']);
  }
}
