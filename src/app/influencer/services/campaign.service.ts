import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Campaign } from '../models/campaign';
import { CampaignApplicationRequest } from '../models/campaign-application-request';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private http = inject(HttpClient);

  private readonly CAMPAIGNS_API = 'http://localhost:8080/api/campaigns';
  private readonly APPLICATIONS_API = 'http://localhost:8080/api/campaign-applications';

  getOpenCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(this.CAMPAIGNS_API);
  }

  applyToCampaign(request: CampaignApplicationRequest): Observable<any> {
    return this.http.post(this.APPLICATIONS_API, request);
  }
}
