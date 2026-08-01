import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BrandDashboardResponse } from '../models/brand-dashboard-response';

@Injectable({
  providedIn: 'root'
})
export class BrandDashboardService {
  private http = inject(HttpClient);

  private readonly API = 'http://localhost:8080/api/brand/dashboard';

  getDashboard(): Observable<BrandDashboardResponse> {
    return this.http.get<BrandDashboardResponse>(this.API);
  }
}
