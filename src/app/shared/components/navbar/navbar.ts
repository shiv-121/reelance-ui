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

  protected role = this.tokenService.getRole();

  protected get dashboardRoute(): string {
    return this.role === 'BRAND' ? '/brand' : '/influencer';
  }

  protected logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}
