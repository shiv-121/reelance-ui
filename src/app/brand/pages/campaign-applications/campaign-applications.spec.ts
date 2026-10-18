import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { Application } from '../../models/application';
import { CampaignService } from '../../services/campaign.service';
import { CampaignApplications } from './campaign-applications';

describe('CampaignApplications', () => {
  let component: CampaignApplications;
  let fixture: ComponentFixture<CampaignApplications>;
  let campaignService: jasmine.SpyObj<CampaignService>;

  const applications: Application[] = [
    {
      applicationId: 1,
      campaignId: 11,
      campaignTitle: 'Summer launch',
      influencerUsername: 'creator_one',
      proposal: 'I would love to collaborate.',
      expectedPrice: 5000,
      status: 'PENDING'
    },
    {
      applicationId: 2,
      campaignId: 11,
      campaignTitle: 'Summer launch',
      influencerUsername: 'creator_two',
      proposal: 'Campaign proposal.',
      expectedPrice: 7000,
      status: 'ACCEPTED'
    }
  ];

  beforeEach(async () => {
    campaignService = jasmine.createSpyObj<CampaignService>(
      'CampaignService',
      ['getCampaignApplications', 'updateApplicationStatus']
    );
    campaignService.getCampaignApplications.and.returnValue(of(applications));
    campaignService.updateApplicationStatus.and.callFake((applicationId, status) => of({
      ...applications.find((application) => application.applicationId === applicationId)!,
      status
    }));

    await TestBed.configureTestingModule({
      imports: [CampaignApplications],
      providers: [
        { provide: CampaignService, useValue: campaignService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '11' }) } } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignApplications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter by status and creator search while counting loaded applications', () => {
    component.selectedStatus = 'PENDING';
    component.searchTerm = 'creator_one';

    expect(component.filteredApplications.map((application) => application.applicationId)).toEqual([1]);
    expect(component.countForStatus('ALL')).toBe(2);
    expect(component.countForStatus('PENDING')).toBe(1);
    expect(component.countForStatus('SHORTLISTED')).toBe(0);
  });

  it('should shortlist locally and update status counts without reloading', () => {
    component.shortlistApplication(1);

    expect(campaignService.updateApplicationStatus).toHaveBeenCalledWith(1, 'SHORTLISTED');
    expect(component.applications[0].status).toBe('SHORTLISTED');
    expect(component.countForStatus('PENDING')).toBe(0);
    expect(component.countForStatus('SHORTLISTED')).toBe(1);
    expect(campaignService.getCampaignApplications).toHaveBeenCalledTimes(1);
  });

  it('should not allow actions for terminal applications', () => {
    component.rejectApplication(2);

    expect(campaignService.updateApplicationStatus).not.toHaveBeenCalled();
  });
});
