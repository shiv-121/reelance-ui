import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerDetail } from './influencer-detail';

describe('InfluencerDetail', () => {
  let component: InfluencerDetail;
  let fixture: ComponentFixture<InfluencerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfluencerDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
