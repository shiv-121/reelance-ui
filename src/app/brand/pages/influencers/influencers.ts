import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink
} from '@angular/router';

import {
  Influencer
} from '../../models/influencer';

import {
  InfluencerService
} from '../../services/influencer.service';

@Component({
  selector: 'app-influencers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './influencers.html',
  styleUrl: './influencers.css'
})
export class Influencers
implements OnInit {

  influencers:
    Influencer[] = [];

  minPrice?: number;

  maxPrice?: number;

  sort =
    'pricePerPost,asc';

  private service =
    inject(InfluencerService);

  ngOnInit(): void {

    this.loadInfluencers();
  }

  loadInfluencers(): void {

    this.service
      .getInfluencers(
        this.minPrice,
        this.maxPrice,
        this.sort
      )
      .subscribe(response => {

        console.log(
          'Influencers Response:',
          response
        );

        this.influencers =
          response.content;
      });
  }
}
