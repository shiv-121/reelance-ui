import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  email = '';
  password = '';
  role = 'BRAND';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  register(): void {
    const request: RegisterRequest = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.register(request).subscribe({
      next: () => {
        alert('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err: unknown) => {
        console.error('Registration failed', err);
        alert('Registration failed');
      }
    });
  }
}
