import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Campaign } from '../models/campaign';
import { CampaignWorkspaceResponse } from '../models/campaign-page-response';
import { CreateCampaignRequest } from '../models/create-campaign-request';
import { Application } from '../models/application';
import { Participant } from '../models/participant';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private http = inject(HttpClient);

  private readonly API = 'http://localhost:8080/api/campaigns';

  getMyCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.API}/brand`);
  }

  getBrandCampaignsPage(
    page: number,
    size: number,
    search?: string,
    status?: string,
    niche?: string,
    sort?: string
  ): Observable<CampaignWorkspaceResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (status) {
      params = params.set('status', status);
    }

    if (niche) {
      params = params.set('niche', niche);
    }

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<CampaignWorkspaceResponse>(`${this.API}/brand/workspace`, { params });
  }

  createCampaign(request: CreateCampaignRequest): Observable<Campaign> {
    return this.http.post<Campaign>(this.API, request);
  }

  closeCampaign(id: number): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.API}/${id}/close`, {});
  }

  completeCampaign(id: number): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.API}/${id}/complete`, {});
  }

  getCampaignApplications(campaignId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`http://localhost:8080/api/campaign-applications/campaign/${campaignId}`);
  }

  acceptApplication(applicationId: number): Observable<any> {
    return this.http.patch(`http://localhost:8080/api/campaign-applications/${applicationId}?status=ACCEPTED`, {});
  }

  rejectApplication(applicationId: number): Observable<any> {
    return this.http.patch(`http://localhost:8080/api/campaign-applications/${applicationId}?status=REJECTED`, {});
  }

  getCampaignParticipants(campaignId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(`http://localhost:8080/api/campaigns/${campaignId}/participants`);
  }
}

