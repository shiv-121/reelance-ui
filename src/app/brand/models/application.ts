import {
  ApplicationStatus,
  CampaignApplicationResponse,
  NegotiationParty,
  NegotiationStatus
} from '../../core/models/campaign-application-response';

export type { ApplicationStatus } from '../../core/models/campaign-application-response';

export interface Application extends Pick<CampaignApplicationResponse,
  'currentOfferPrice' | 'finalAgreedPrice' | 'negotiationStatus' | 'nextResponseParty'> {
  applicationId: number;
  campaignId: number;
  campaignTitle: string;
  influencerUsername: string;
  proposal: string;
  expectedPrice: number;
  portfolioLink?: string;
  status: ApplicationStatus;
  applicationStatus?: ApplicationStatus | null;
  nextResponseParty?: NegotiationParty | null;
  negotiationStatus?: NegotiationStatus | null;
  originalExpectedPrice?: number | null;
  currentOfferPrice?: number | null;
  finalAgreedPrice?: number | null;
}
