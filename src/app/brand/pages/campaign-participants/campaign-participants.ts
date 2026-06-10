import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CampaignService } from '../../services/campaign.service';
import { Participant } from '../../models/participant';

@Component({
  selector: 'app-campaign-participants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-participants.html',
  styleUrl: './campaign-participants.css'
})
export class CampaignParticipants implements OnInit {

  private service = inject(CampaignService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  participants: Participant[] = [];
  campaignId = 0;
  loading = false;

  ngOnInit(): void {
    this.campaignId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.loading = true;
    this.service.getCampaignParticipants(this.campaignId).subscribe({
      next: (data) => {
        this.participants = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/brand/campaigns']);
  }
}
