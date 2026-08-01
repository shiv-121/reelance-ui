import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { InfluencerProfile } from '../models/influencer-profile';

@Injectable({
  providedIn: 'root'
})
export class InfluencerProfileService {

  private http = inject(HttpClient);

  private api =
    'http://localhost:8080/api/influencer';

  createProfile(
    request: InfluencerProfile
  ): Observable<any> {

    return this.http.post(
      `${this.api}/profile`,
      request
    );
  }

  getMyProfile():
    Observable<InfluencerProfile> {

    return this.http.get<InfluencerProfile>(
      `${this.api}/profile`
    );
  }

  updateProfile(
    request: InfluencerProfile
  ): Observable<any> {

    return this.http.put(
      `${this.api}/profile`,
      request
    );
  }
}
