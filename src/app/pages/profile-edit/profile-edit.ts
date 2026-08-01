import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { InfluencerProfileService }
from '../../influencer/services/influencer-profile.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.css'
})
export class ProfileEdit implements OnInit {

  private profileService =
    inject(InfluencerProfileService);

  private router =
    inject(Router);

  profile = {

    instagramHandle: '',

    followers: 0,

    niche: '',

    pricePerPost: 0
  };

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
        }
      });
  }

  saveProfile(): void {

    this.profileService
      .updateProfile(
        this.profile
      )
      .subscribe({

        next: () => {

          this.router.navigate(
            ['/profile']
          );
        },

        error: () => {

          this.errorMessage =
            'Failed to update profile';
        }
      });
  }
}