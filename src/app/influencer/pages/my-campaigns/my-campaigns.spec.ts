import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCampaigns } from './my-campaigns';

describe('MyCampaigns', () => {
  let component: MyCampaigns;
  let fixture: ComponentFixture<MyCampaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCampaigns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCampaigns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
