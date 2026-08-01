import { Campaign } from './campaign';

export interface CampaignWorkspaceResponse {
  campaigns: Campaign[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  totalCampaigns: number;
  openCampaigns: number;
  closedCampaigns: number;
  completedCampaigns: number;
  totalBudget: number;
}
