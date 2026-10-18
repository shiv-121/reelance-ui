export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  applicationId: number;
  campaignId: number;
  campaignTitle: string;
  influencerUsername: string;
  proposal: string;
  expectedPrice: number;
  portfolioLink?: string;
  status: ApplicationStatus;
}
