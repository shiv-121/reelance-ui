import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { LoginRequest } from '../../../core/models/login-request';
import { LoginResponse } from '../../../core/models/login-response';
import { InfluencerProfileService }
from '../../../influencer/services/influencer-profile.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private profileService =
    inject(InfluencerProfileService);

  login(): void {
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: LoginResponse) => {
        this.tokenService.setToken(response.token);
        this.tokenService.setRole(response.role);

        if (response.role === 'BRAND') {
          this.router.navigate([
            '/brand'
          ]);

          return;
        }

        this.profileService
          .getMyProfile()
          .subscribe({

            next: () => {

              this.router.navigate([
                '/influencer'
              ]);
            },

            error: (err) => {

              if (
                err.status === 404
              ) {

                this.router.navigate([
                  '/profile/setup'
                ]);

              } else {

                alert(
                  'Unable to load profile'
                );
              }
            }
          });
      },
      error: (err: unknown) => {
        alert('Invalid credentials');
        console.error(err);
      }
    });
  }
}
