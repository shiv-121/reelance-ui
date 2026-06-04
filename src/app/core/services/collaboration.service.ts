import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Collaboration }
  from '../models/collaboration';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  private http = inject(HttpClient);

  private readonly API =
    'http://localhost:8080/api/collaborations';

  getBrandCollaborations():
    Observable<Collaboration[]> {

    return this.http.get<
      Collaboration[]
    >(`${this.API}/brand`);
  }
}
