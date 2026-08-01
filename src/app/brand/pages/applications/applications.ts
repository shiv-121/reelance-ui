import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Application } from '../../models/application';

@Component({
  selector: 'app-brand-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  applications: Application[] = [];
  filteredApplications: Application[] = [];
  statusFilter = 'ALL';
  isLoading = false;

  ngOnInit(): void {
    this.loadApplications();
    this.route.queryParamMap.subscribe((params) => {
      const status = params.get('status')?.toUpperCase() ?? 'ALL';
      this.statusFilter = ['PENDING', 'ACCEPTED', 'REJECTED'].includes(status) ? status : 'ALL';
      this.applyFilter();
    });
  }

  loadApplications(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.applications = [
        {
          applicationId: 1,
          campaignId: 101,
          campaignTitle: 'Summer Glow Campaign',
          influencerUsername: 'maya.creates',
          proposal: 'I would love to create a short-form series for your brand.',
          expectedPrice: 5000,
          status: 'PENDING'
        },
        {
          applicationId: 2,
          campaignId: 102,
          campaignTitle: 'Urban Fit Launch',
          influencerUsername: 'arjun.vibes',
          proposal: 'My audience aligns closely with your product audience.',
          expectedPrice: 7000,
          status: 'ACCEPTED'
        },
        {
          applicationId: 3,
          campaignId: 103,
          campaignTitle: 'Wellness Weekend',
          influencerUsername: 'nina.style',
          proposal: 'I can create polished content tailored to your brand voice.',
          expectedPrice: 4500,
          status: 'REJECTED'
        }
      ];

      this.applyFilter();
      this.isLoading = false;
    }, 300);
  }

  applyFilter(): void {
    if (this.statusFilter === 'ALL') {
      this.filteredApplications = this.applications;
      return;
    }

    this.filteredApplications = this.applications.filter(
      (application) => application.status === this.statusFilter
    );
  }

  get pendingCount(): number {
    return this.applications.filter((application) => application.status === 'PENDING').length;
  }

  get acceptedCount(): number {
    return this.applications.filter((application) => application.status === 'ACCEPTED').length;
  }

  get rejectedCount(): number {
    return this.applications.filter((application) => application.status === 'REJECTED').length;
  }

  viewProfile(creatorId: number): void {
    this.router.navigate([`/brand/influencers/${creatorId}`]);
  }

  acceptApplication(applicationId: number): void {
    console.log('Accept application', applicationId);
  }

  rejectApplication(applicationId: number): void {
    console.log('Reject application', applicationId);
  }
}
