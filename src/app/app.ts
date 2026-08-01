import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Navbar } from './shared/components/navbar/navbar';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);
  protected readonly title = signal('reelance-ui');

  protected get showNavbar(): boolean {

    return ![
      '/login',
      '/register'
    ].includes(
      this.router.url
    );
  }
}
