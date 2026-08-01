import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Influencer } from '../models/influencer';
import { PageResponse }
from '../models/page-response';

@Injectable({
  providedIn: 'root'
})
export class InfluencerService {

  private http = inject(HttpClient);

  private api =
    'http://localhost:8080/api/influencers';

  getInfluencers(
    minPrice?: number,
    maxPrice?: number,
    sort?: string
  ): Observable<PageResponse<Influencer>> {

    let url = this.api;

    const params: string[] = [];

    if (minPrice) {
      params.push(`minPrice=${minPrice}`);
    }

    if (maxPrice) {
      params.push(`maxPrice=${maxPrice}`);
    }

    if (sort) {
      params.push(`sort=${sort}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get<
      PageResponse<Influencer>
    >(url);
  }

  getInfluencerById(
    id: number
  ): Observable<Influencer> {

    return this.http.get<Influencer>(
      `${this.api}/${id}`
    );
  }
}
