import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { NegotiationResponse } from '../models/campaign-application-response';

@Injectable({ providedIn: 'root' })
export class CampaignApplicationNegotiationService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/campaign-applications';

  brandCounterOffer(applicationId: number, amount: number): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(
      `${this.API}/${applicationId}/brand-counter-offer`,
      { amount }
    );
  }

  brandAcceptInfluencerCounter(applicationId: number): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(
      `${this.API}/${applicationId}/brand-accept-influencer-counter`,
      null
    );
  }

  brandRejectInfluencerCounter(applicationId: number): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(
      `${this.API}/${applicationId}/brand-reject-influencer-counter`,
      null
    );
  }

  brandCounterOfferAfterInfluencerCounter(
    applicationId: number,
    amount: number
  ): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(
      `${this.API}/${applicationId}/brand-counter-offer-after-influencer-counter`,
      { amount }
    );
  }

  influencerAcceptBrandOffer(applicationId: number): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(
      `${this.API}/${applicationId}/influencer-accept-brand-offer`,
      null
    );
  }

  influencerRejectBrandOffer(applicationId: number): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(
      `${this.API}/${applicationId}/influencer-reject-brand-offer`,
      null
    );
  }

  influencerCounterOffer(applicationId: number, amount: number): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(
      `${this.API}/${applicationId}/influencer-counter-offer`,
      { amount }
    );
  }
}

export function negotiationErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const body: unknown = error.error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object') {
      const problem = body as {
        message?: unknown;
        detail?: unknown;
        title?: unknown;
        error?: unknown;
      };
      for (const value of [problem.message, problem.detail, problem.title, problem.error]) {
        if (typeof value === 'string' && value.trim()) {
          return value;
        }
      }
      const validationErrors = (body as { errors?: unknown }).errors;
      if (validationErrors && typeof validationErrors === 'object') {
        const messages = Object.values(validationErrors as Record<string, unknown>)
          .flatMap((value) => Array.isArray(value) ? value : [value])
          .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
        if (messages.length) {
          return messages.join(' ');
        }
      }
    }

    switch (error.status) {
      case 400:
      case 422:
        return 'The backend rejected this offer. Check the amount and negotiation state.';
      case 401:
        return 'Your session has expired. Sign in again to continue.';
      case 403:
        return 'You are not authorized to respond to this negotiation.';
      case 404:
        return 'This application could not be found.';
      case 409:
        return 'This negotiation has changed. Refresh the application list and try again.';
    }
  }
  return fallback;
}