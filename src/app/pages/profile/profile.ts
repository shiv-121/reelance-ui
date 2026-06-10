import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InfluencerProfileService } from '../../influencer/services/influencer-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private profileService =
    inject(
      InfluencerProfileService
    );

  profile = {
    instagramHandle: '',
    followers: 0,
    niche: '',
    pricePerPost: 0
  };

  loading = true;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.profileService
      .getMyProfile()
      .subscribe({
        next: profile => {
          this.profile = {
            instagramHandle:
              profile.instagramHandle,
            followers:
              profile.followers,
            niche:
              profile.niche,
            pricePerPost:
              profile.pricePerPost
          };
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  saveProfile(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.profileService
      .updateProfile(
        this.profile
      )
      .subscribe({
        next: () => {
          this.successMessage =
            'Profile updated successfully';
        },
        error: () => {
          this.errorMessage =
            'Failed to update profile';
        }
      });
  }
}
