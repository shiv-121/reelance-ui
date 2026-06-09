import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Campaign } from '../models/campaign';
import { CreateCampaignRequest } from '../models/create-campaign-request';
import { Application } from '../models/application';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private http = inject(HttpClient);

  private readonly API = 'http://localhost:8080/api/campaigns';

  getMyCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.API}/brand`);
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
}

