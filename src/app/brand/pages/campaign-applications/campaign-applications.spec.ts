import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignApplications } from './campaign-applications';

describe('CampaignApplications', () => {
  let component: CampaignApplications;
  let fixture: ComponentFixture<CampaignApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignApplications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignApplications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
