export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  MATCHING = 'MATCHING',
  OUTREACH = 'OUTREACH',
}

export interface PitchAnalysis {
  companyName: string;
  industry: string;
  stage: string;
  askAmount: string;
  valueProposition: string;
  idealInvestorProfile: string;
  summary: string;
}

export interface Investor {
  id: string;
  name: string;
  firm: string;
  focus: string;
  aum: string; // Assets Under Management
  pastDeals: string[];
  website: string;
  matchScore?: number; // 0-100
  matchReason?: string;
  status: 'New' | 'Contacted' | 'Meeting Booked' | 'Passed';
}

export interface OutreachDraft {
  subject: string;
  body: string;
  recipient: Investor;
}
