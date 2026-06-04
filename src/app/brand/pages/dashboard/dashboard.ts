import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaborationService }
from '../../../core/services/collaboration.service';

import { Collaboration }
from '../../../core/models/collaboration';

@Component({
  selector: 'app-brand-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  collaborations: Collaboration[] = [];

  private collaborationService =
    inject(CollaborationService);

  ngOnInit(): void {

    this.loadCollaborations();
  }

  loadCollaborations(): void {

    this.collaborationService
      .getBrandCollaborations()
      .subscribe({

        next: (data) => {

          this.collaborations = data;
        },

        error: (err) => {

          console.error(err);
        }
      });
  }

  get pendingCount(): number {

    return this.collaborations.filter(
      c => c.status === 'PENDING'
    ).length;
  }

  get acceptedCount(): number {

    return this.collaborations.filter(
      c => c.status === 'ACCEPTED'
    ).length;
  }

  get completedCount(): number {

    return this.collaborations.filter(
      c => c.status === 'COMPLETED'
    ).length;
  }
}
