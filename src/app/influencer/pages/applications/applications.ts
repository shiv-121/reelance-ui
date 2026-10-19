import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Application } from '../../models/application';
import { CampaignService } from '../../services/campaign.service';
import {
  NegotiationResponse,
  getNegotiationActions
} from '../../../core/models/campaign-application-response';
import {
  CampaignApplicationNegotiationService,
  negotiationErrorMessage
} from '../../../core/services/campaign-application-negotiation.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './applications.html',
  styleUrl: './applications.css',
})
export class Applications implements OnInit {

  private campaignService = inject(CampaignService);
  private negotiationService = inject(CampaignApplicationNegotiationService);

  protected applications: Application[] = [];
  protected loading = false;
  protected error: string | null = null;
  protected counterOfferAmounts: Record<number, string> = {};
  protected negotiationMessages: Record<number, string> = {};
  protected negotiationErrors: Record<number, string> = {};
  private negotiationBusyIds = new Set<number>();

  ngOnInit(): void {
    this.loadApplications();
  }

  protected loadApplications(): void {
    this.loading = true;
    this.error = null;

    this.campaignService.getMyApplications().subscribe({
      next: (data) => {
        this.applications = data.map((application) => ({
          ...application,
          status: application.applicationStatus ?? application.status
        }));
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

  protected negotiationActions(application: Application) {
    return getNegotiationActions(application);
  }

  protected isNegotiationBusy(applicationId: number): boolean {
    return this.negotiationBusyIds.has(applicationId);
  }

  protected acceptBrandOffer(application: Application): void {
    if (!this.negotiationActions(application).canInfluencerRespond || this.isNegotiationBusy(application.applicationId)) {
      return;
    }
    this.submitNegotiationRequest(
      application,
      this.negotiationService.influencerAcceptBrandOffer(application.applicationId),
      'Brand offer accepted. Application status remains unchanged until the brand explicitly decides.'
    );
  }

  protected rejectBrandOffer(application: Application): void {
    if (!this.negotiationActions(application).canInfluencerRespond || this.isNegotiationBusy(application.applicationId)) {
      return;
    }
    this.submitNegotiationRequest(
      application,
      this.negotiationService.influencerRejectBrandOffer(application.applicationId),
      'Brand offer rejected.'
    );
  }

  protected submitCounterOffer(application: Application): void {
    const applicationId = application.applicationId;
    const rawAmount = this.counterOfferAmounts[applicationId]?.trim() ?? '';
    const amount = Number(rawAmount);
    if (!rawAmount || !Number.isFinite(amount) || amount <= 0) {
      this.negotiationErrors = {
        ...this.negotiationErrors,
        [applicationId]: 'Enter a valid amount greater than zero.'
      };
      return;
    }
    if (!this.negotiationActions(application).canInfluencerRespond || this.isNegotiationBusy(applicationId)) {
      return;
    }
    this.submitNegotiationRequest(
      application,
      this.negotiationService.influencerCounterOffer(applicationId, amount),
      'Counteroffer sent to the brand.'
    );
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
        this.applications = this.applications.map((item) => item.applicationId === applicationId
          ? {
              ...item,
              ...response,
              applicationStatus: response.applicationStatus ?? item.applicationStatus ?? item.status,
              status: response.applicationStatus ?? item.applicationStatus ?? item.status
            }
          : item);
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

  private finishNegotiationRequest(applicationId: number): void {
    const busyIds = new Set(this.negotiationBusyIds);
    busyIds.delete(applicationId);
    this.negotiationBusyIds = busyIds;
  }
}

