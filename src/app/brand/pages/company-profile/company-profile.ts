import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css'
})
export class CompanyProfile {
  company = {
    companyName: 'Reelance Studios',
    industry: 'Fashion',
    website: 'https://reelance.io',
    location: 'Pune, India',
    description:
      'We partner with creators to build authentic influencer marketing campaigns.'
  };

  stats = [
    { label: 'Campaigns Created', value: '24' },
    { label: 'Creators Collaborated', value: '118' },
    { label: 'Active Campaigns', value: '7' },
    { label: 'Completed Campaigns', value: '17' }
  ];

  recentCampaigns = [
    { name: 'Spring Drop Launch', status: 'Active', budget: '$8.5K', deadline: 'Aug 15, 2026' },
    { name: 'Creator Meetup Series', status: 'Review', budget: '$4.2K', deadline: 'Sep 02, 2026' },
    { name: 'Product Awareness Push', status: 'Completed', budget: '$6.0K', deadline: 'Jul 28, 2026' }
  ];
}
