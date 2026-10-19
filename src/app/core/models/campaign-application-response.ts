export type NegotiationStatus =
  | 'NOT_STARTED'
  | 'PENDING_INFLUENCER_RESPONSE'
  | 'PENDING_BRAND_RESPONSE'
  | 'AGREED'
  | 'DECLINED';
export type NegotiationParty = 'BRAND' | 'INFLUENCER';
export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

/** Fields present on the campaign-application list response. */
export interface CampaignApplicationResponse {
  applicationId: number;
  expectedPrice?: number | null;
  currentOfferPrice?: number | null;
  finalAgreedPrice?: number | null;
  negotiationStatus?: NegotiationStatus | null;
  nextResponseParty?: NegotiationParty | null;
  status?: ApplicationStatus | null;
}

/** Fields returned by the negotiation action endpoints. */
export interface NegotiationResponse {
  applicationId: number;
  originalExpectedPrice?: number | null;
  currentOfferPrice?: number | null;
  finalAgreedPrice?: number | null;
  negotiationStatus?: NegotiationStatus | null;
  nextResponseParty?: NegotiationParty | null;
  applicationStatus?: ApplicationStatus | null;
}

export type ApplicationNegotiationState =
  Pick<CampaignApplicationResponse,
    'currentOfferPrice' | 'finalAgreedPrice' | 'negotiationStatus' | 'nextResponseParty' | 'status'> &
  Pick<NegotiationResponse, 'applicationStatus'>;

export interface NegotiationActions {
  canStart: boolean;
  canBrandRespond: boolean;
  canInfluencerRespond: boolean;
  waitingForBrand: boolean;
  waitingForInfluencer: boolean;
  isTerminal: boolean;
  negotiationComplete: boolean;
}

export function getNegotiationActions(application: ApplicationNegotiationState): NegotiationActions {
  const negotiationStatus = application.negotiationStatus ?? 'NOT_STARTED';
  const nextParty = application.nextResponseParty ?? null;
  const applicationStatus = application.applicationStatus ?? application.status ?? null;
  const isTerminal = negotiationStatus === 'AGREED' || negotiationStatus === 'DECLINED' ||
    applicationStatus === 'ACCEPTED' || applicationStatus === 'REJECTED';
  const negotiationComplete = negotiationStatus === 'AGREED' || negotiationStatus === 'DECLINED';
  const hasNoOffer = application.currentOfferPrice == null && application.finalAgreedPrice == null;

  return {
    canStart: !isTerminal && negotiationStatus === 'NOT_STARTED' &&
      (nextParty === null || nextParty === 'BRAND') && hasNoOffer,
    canBrandRespond: !isTerminal && negotiationStatus === 'PENDING_BRAND_RESPONSE' && nextParty === 'BRAND',
    canInfluencerRespond: !isTerminal &&
      negotiationStatus === 'PENDING_INFLUENCER_RESPONSE' && nextParty === 'INFLUENCER',
    waitingForBrand: !isTerminal && negotiationStatus === 'PENDING_BRAND_RESPONSE',
    waitingForInfluencer: !isTerminal && negotiationStatus === 'PENDING_INFLUENCER_RESPONSE',
    isTerminal,
    negotiationComplete
  };
}