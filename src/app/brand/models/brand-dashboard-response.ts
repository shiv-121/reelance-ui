export interface BrandDashboardResponse {
  activeCampaigns: number;
  pendingApplications: number;
  acceptedApplications: number;
  totalBudget: number;
  recentCampaigns: RecentCampaignSummary[];
  recentApplications: RecentApplicationSummary[];
}

export interface RecentCampaignSummary {
  campaignId: number;
  title: string;
  status: string;
  budget: number;
  deadline: string;
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
