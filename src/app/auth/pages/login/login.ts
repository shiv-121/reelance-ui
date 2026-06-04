import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { LoginRequest } from '../../../core/models/login-request';
import { LoginResponse } from '../../../core/models/login-response';

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

  login(): void {
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: LoginResponse) => {
        this.tokenService.setToken(response.token);
        this.tokenService.setRole(response.role);

        if (response.role === 'BRAND') {
          this.router.navigate(['/brand']);
        } else {
          this.router.navigate(['/influencer']);
        }
      },
      error: (err: unknown) => {
        alert('Invalid credentials');
        console.error(err);
      }
    });
  }
}
