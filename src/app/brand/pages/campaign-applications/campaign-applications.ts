import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CampaignService } from '../../services/campaign.service';
import { Application, ApplicationStatus } from '../../models/application';
import {
  NegotiationResponse,
  getNegotiationActions
} from '../../../core/models/campaign-application-response';
import {
  CampaignApplicationNegotiationService,
  negotiationErrorMessage
} from '../../../core/services/campaign-application-negotiation.service';

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
  private negotiationService = inject(CampaignApplicationNegotiationService);

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
  private negotiationBusyIds = new Set<number>();
  counterOfferAmounts: Record<number, string> = {};
  negotiationMessages: Record<number, string> = {};
  negotiationErrors: Record<number, string> = {};
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
        this.applications = data.map((application) => ({
          ...application,
          status: (application.applicationStatus ?? application.status) as ApplicationStatus
        }));
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

  negotiationActions(application: Application) {
    return getNegotiationActions(application);
  }

  isNegotiationBusy(applicationId: number): boolean {
    return this.negotiationBusyIds.has(applicationId);
  }

  submitBrandCounterOffer(application: Application): void {
    const amount = this.validCounterOfferAmount(application.applicationId);
    if (amount === null || this.isNegotiationBusy(application.applicationId) || this.isUpdating(application.applicationId)) {
      return;
    }

    const actions = this.negotiationActions(application);
    if (!actions.canStart && !actions.canBrandRespond) {
      return;
    }

    const request = actions.canStart
      ? this.negotiationService.brandCounterOffer(application.applicationId, amount)
      : this.negotiationService.brandCounterOfferAfterInfluencerCounter(application.applicationId, amount);
    this.submitNegotiationRequest(application, request, 'Counteroffer sent to influencer.');
  }

  acceptInfluencerCounter(application: Application): void {
    if (!this.negotiationActions(application).canBrandRespond || this.isNegotiationBusy(application.applicationId) || this.isUpdating(application.applicationId)) {
      return;
    }
    this.submitNegotiationRequest(
      application,
      this.negotiationService.brandAcceptInfluencerCounter(application.applicationId),
      'Influencer counteroffer accepted. The application still requires an explicit decision.'
    );
  }

  rejectInfluencerCounter(application: Application): void {
    if (!this.negotiationActions(application).canBrandRespond || this.isNegotiationBusy(application.applicationId) || this.isUpdating(application.applicationId)) {
      return;
    }
    this.submitNegotiationRequest(
      application,
      this.negotiationService.brandRejectInfluencerCounter(application.applicationId),
      'Influencer counteroffer rejected.'
    );
  }

  private validCounterOfferAmount(applicationId: number): number | null {
    const rawAmount = this.counterOfferAmounts[applicationId]?.trim() ?? '';
    const amount = Number(rawAmount);
    if (!rawAmount || !Number.isFinite(amount) || amount <= 0) {
      this.negotiationErrors = {
        ...this.negotiationErrors,
        [applicationId]: 'Enter a valid amount greater than zero.'
      };
      return null;
    }
    return amount;
  }

  private submitNegotiationRequest(
    application: Application,
    request: import('rxjs').Observable<NegotiationResponse>,
    success: string
  ): void {
    const applicationId = application.applicationId;
    this.negotiationBusyIds = new Set(this.negotiationBusyIds).add(applicationId);
    this.negotiationErrors = { ...this.negotiationErrors, [applicationId]: '' };
    this.negotiationMessages = { ...this.negotiationMessages, [applicationId]: '' };

    request.subscribe({
      next: (response) => {
        this.updateNegotiationApplication(applicationId, response);
        this.negotiationMessages = { ...this.negotiationMessages, [applicationId]: success };
        this.finishNegotiationRequest(applicationId);
      },
      error: (error: unknown) => {
        this.negotiationErrors = {
          ...this.negotiationErrors,
          [applicationId]: negotiationErrorMessage(error, 'Unable to update the negotiation. Please try again.')
        };
        this.finishNegotiationRequest(applicationId);
      }
    });
  }

  private updateNegotiationApplication(applicationId: number, response: NegotiationResponse): void {
    this.applications = this.applications.map((application) => application.applicationId === applicationId
      ? {
          ...application,
          ...response,
          applicationStatus: response.applicationStatus ?? application.applicationStatus ?? application.status,
          status: (response.applicationStatus ?? application.applicationStatus ?? application.status) as ApplicationStatus
        }
      : application);
  }

  private finishNegotiationRequest(applicationId: number): void {
    const busyIds = new Set(this.negotiationBusyIds);
    busyIds.delete(applicationId);
    this.negotiationBusyIds = busyIds;
  }

  private updateApplicationStatus(applicationId: number, status: ApplicationStatus): void {
    const application = this.applications.find((item) => item.applicationId === applicationId);
    if (!application || this.isUpdating(applicationId) || this.isNegotiationBusy(applicationId) ||
      !this.canTransition(application.status, status)) {
      return;
    }

    this.updatingApplicationIds = new Set(this.updatingApplicationIds).add(applicationId);
    this.successMessage = '';
    this.errorMessage = '';

    this.service.updateApplicationStatus(applicationId, status).subscribe({
      next: (updatedApplication) => {
        this.applications = this.applications.map((item) => item.applicationId === applicationId
          ? {
              ...item,
              ...updatedApplication,
              applicationStatus: updatedApplication.applicationStatus ?? updatedApplication.status ?? status,
              status: updatedApplication.status ?? updatedApplication.applicationStatus ?? status
            }
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
