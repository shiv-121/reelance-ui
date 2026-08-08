export interface BrandDashboardResponse {

  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  closedCampaigns: number;


  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;


  totalBudget: number;
  acceptanceRate: number;
  completionRate: number;


  recentCampaigns:
    RecentCampaignSummary[];

  recentApplications:
    RecentApplicationSummary[];
}


export interface RecentCampaignSummary {

  campaignId: number;
  title: string;
  status: string;
  budget: number;
  deadline: string;
  applicationCount: number;
  pendingApplicationCount: number;
  acceptedApplicationCount: number;
}


export interface RecentApplicationSummary {

  applicationId: number;
  campaignId: number;
  creatorId: number;
  campaignTitle: string;
  creatorName: string;
  status: string;
  appliedOn: string;
}