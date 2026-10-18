import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BrandDashboardService } from '../../services/brand-dashboard.service';
import { BrandDashboardResponse } from '../../models/brand-dashboard-response';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let dashboardService: jasmine.SpyObj<BrandDashboardService>;

  beforeEach(async () => {
    dashboardService = jasmine.createSpyObj('BrandDashboardService', ['getDashboard']);

    const mockResponse: BrandDashboardResponse = {
      totalCampaigns: 3,
      activeCampaigns: 3,
      completedCampaigns: 0,
      closedCampaigns: 0,
      totalApplications: 6,
      pendingApplications: 4,
      acceptedApplications: 2,
      rejectedApplications: 0,
      totalBudget: 125000,
      acceptanceRate: 0,
      completionRate: 0,
      recentCampaigns: [],
      recentApplications: []
    };

    dashboardService.getDashboard.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [{ provide: BrandDashboardService, useValue: dashboardService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data from the API', () => {
    expect(dashboardService.getDashboard).toHaveBeenCalled();
    expect(component.dashboard?.activeCampaigns).toBe(3);
    expect(component.isLoading).toBeFalse();
  });
});
