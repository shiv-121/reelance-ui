import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Collaboration }
from '../../../core/models/collaboration';

import { InfluencerService }
from '../../../core/services/influencer.service';

@Component({
  selector: 'app-influencer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  requests: Collaboration[] = [];

  private influencerService =
    inject(InfluencerService);

  ngOnInit(): void {

    this.influencerService
      .getRequests()
      .subscribe(data => {

        this.requests = data;
      });
  }

  get pendingCount(): number {

    return this.requests.filter(
      r => r.status === 'PENDING'
    ).length;
  }

  get acceptedCount(): number {

    return this.requests.filter(
      r => r.status === 'ACCEPTED'
    ).length;
  }
}
