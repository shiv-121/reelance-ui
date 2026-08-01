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
  isSubmitting = false;
  errorMessage = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  register(): void {
    if (this.isSubmitting) {
      return;
    }

    const username = this.username.trim();
    const email = this.email.trim();

    if (!username || !email || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const request: RegisterRequest = {
      username,
      email,
      password: this.password,
      role: this.role
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.register(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err: unknown) => {
        this.isSubmitting = false;
        console.error('Registration failed', err);
        this.errorMessage = this.getErrorMessage(err);
        alert(this.errorMessage);
      }
    });
  }

  private getErrorMessage(err: unknown): string {
    const error = err as { error?: { message?: string }; message?: string; status?: number };

    if (error?.status === 409) {
      return 'An account with this email or username already exists. Please try logging in instead.';
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Registration failed';
  }
}
