import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Campaign } from '../models/campaign';
import { CreateCampaignRequest } from '../models/create-campaign-request';

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
}
