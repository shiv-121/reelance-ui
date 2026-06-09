import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

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
