import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TokenService } from '../../../core/services/token.service';
import { InfluencerProfileService }
from '../../../influencer/services/influencer-profile.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly profileService =
    inject(InfluencerProfileService);

  protected profileComplete = true;

  ngOnInit(): void {

    if (
      this.role === 'INFLUENCER'
    ) {

      this.profileService
        .getMyProfile()
        .subscribe({

          next: () => {

            this.profileComplete =
              true;
          },

          error: (err) => {

            if (
              err.status === 404
            ) {

              this.profileComplete =
                false;
            }
          }
        });
    }
  }

  protected get isLoggedIn():
  boolean {

    return this.tokenService
      .isLoggedIn();
  }

  protected get isGuest():
  boolean {

    return !this.isLoggedIn;
  }

  protected get needsProfileSetup():
  boolean {

    return this.role ===
      'INFLUENCER'
      &&
      !this.profileComplete;
  }

  protected get isInfluencerReady():
  boolean {

    return this.role ===
      'INFLUENCER'
      &&
      this.profileComplete;
  }

  protected goToProfileSetup():
  void {

    this.router.navigate([
      '/profile/setup'
    ]);
  }

  protected get role(): string | null {
    return this.tokenService.getRole();
  }

  protected get dashboardRoute(): string {
    return this.role === 'BRAND' ? '/brand/dashboard' : '/influencer/dashboard';
  }

  protected get isBrand(): boolean {
    return this.role === 'BRAND';
  }

  protected get isInfluencer(): boolean {
    return this.role === 'INFLUENCER';
  }

  protected logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}
