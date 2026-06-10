import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InfluencerProfileService }
from '../../services/influencer-profile.service';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile-setup.html',
  styleUrl: './profile-setup.css'
})
export class ProfileSetup {

  instagramHandle = '';

  followers = 0;

  niche = '';

  pricePerPost = 0;

  loading = false;

  error = '';

  private service =
    inject(InfluencerProfileService);

  private router =
    inject(Router);

  saveProfile(): void {

    this.loading = true;

    this.error = '';

    this.service.createProfile({

      instagramHandle:
        this.instagramHandle,

      followers:
        this.followers,

      niche:
        this.niche,

      pricePerPost:
        this.pricePerPost

    }).subscribe({

      next: () => {

        this.router.navigate([
          '/influencer'
        ]);
      },

      error: () => {

        this.loading = false;

        this.error =
          'Failed to create profile';
      }
    });
  }
}
