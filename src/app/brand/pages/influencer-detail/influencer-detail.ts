import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  Influencer
} from '../../models/influencer';

import {
  InfluencerService
} from '../../services/influencer.service';

@Component({
  selector: 'app-influencer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl:
    './influencer-detail.html',
  styleUrl:
    './influencer-detail.css'
})
export class InfluencerDetail
implements OnInit {

  influencer?: Influencer;

  loading = true;

  private route =
    inject(ActivatedRoute);

  private service =
    inject(InfluencerService);

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get(
          'id'
        )
      );

    this.service
      .getInfluencerById(id)
      .subscribe({

        next: data => {

          this.influencer = data;

          this.loading = false;
        },

        error: err => {

          console.error(err);

          this.loading = false;
        }
      });
  }
}
