export type JobStatus = 'OPEN' | 'CLOSED';
export type JobType = 'FIXED' | 'HOURLY';
export type ExperienceLevel = 'ENTRY' | 'INTERMEDIATE' | 'EXPERT';
export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type HoursPerWeek = 'AS_NEEDED' | 'LESS_THAN_30' | 'MORE_THAN_30';
export type LanguageProficiency = 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE_OR_BILINGUAL';
export type Role = 'FREELANCER' | 'CLIENT';
export type ScopeSize = 'LARGE' | 'MEDIUM' | 'SMALL';
export type ProjectTerm = 'LONG_TERM' | 'SHORT_TERM';
export type JobDuration = 'MORE_THAN_6_MONTHS' | 'THREE_TO_SIX_MONTHS' | 'ONE_TO_THREE_MONTHS';

import type { ContractStatus } from './contracts';
export * from './contracts';
export * from './messages';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  connectBalance: number;
  walletBalance: number;
  title?: string | null;
  avatarUrl?: string | null;
  hourlyRate?: number | null;
  activeRole: Role;
  onlineForMessages: boolean;
}

export interface JobOwner {
  id: string;
  name: string;
  paymentVerified?: boolean;
  phoneVerified?: boolean;
  rating?: number | null;
  totalSpent?: number;
  country?: string | null;
  createdAt?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  category?: string | null;
  projectTerm?: ProjectTerm | null;
  scopeSize?: ScopeSize | null;
  duration?: JobDuration | null;
  contractToHire: boolean;
  hourlyRateMin?: number | null;
  hourlyRateMax?: number | null;
  connectsRequired: number;
  lastViewedAt?: string | null;
  skills: string[];
  status: JobStatus;
  createdAt: string;
  ownerId: string;
  owner?: JobOwner;
  bidCount?: number;
}

export interface JobActivity {
  proposalCount: number;
  interviewing: number;
  lastViewedAt: string | null;
  bidRange: { high: number; avg: number; low: number } | null;
}

export interface JobClient {
  paymentVerified: boolean;
  phoneVerified: boolean;
  country: string | null;
  memberSince: string;
  openJobs: number;
  hireRate: number;
}

export type JobDetail = Job & { activity: JobActivity; client: JobClient };

export interface TalentUser {
  id: string;
  name: string;
  title: string | null;
  hourlyRate: number | null;
  skills: string[];
  country: string | null;
  avatarUrl: string | null;
}

export interface BoostEntry {
  boostConnects: number;
  createdAt: string;
}

export interface JobsPage {
  items: Job[];
  nextCursor: string | null;
}

export interface JobsFilters {
  status?: JobStatus;
  search?: string;
  cursor?: string;
  limit?: number;
}

export interface Bid {
  id: string;
  amount: number;
  coverLetter: string;
  connectsSpent: number;
  boostConnects: number;
  status: BidStatus;
  interviewing: boolean;
  createdAt: string;
  jobId: string;
  freelancerId: string;
  freelancer?: { id: string; name: string };
  job?: { id: string; title: string; status?: JobStatus };
  contracts?: { id: string; status: ContractStatus }[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  endorsements: string[];
  amount: number;
  priceType: JobType;
  createdAt: string;
  jobId: string;
  author?: { id: string; name: string } | null;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}
export interface Education {
  id: string;
  school: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startYear?: number | null;
  endYear?: number | null;
}
export interface Employment {
  id: string;
  company: string;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
}
export interface PortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  projectUrl?: string | null;
  published: boolean;
}
export interface Certification {
  id: string;
  name: string;
  issuer?: string | null;
  year?: number | null;
}
export interface License {
  id: string;
  name: string;
  issuer?: string | null;
  year?: number | null;
}
export interface LinkedAccount {
  id: string;
  provider: string;
  username: string;
  url?: string | null;
}
export interface OtherExperience {
  id: string;
  subject: string;
  description?: string | null;
}

export interface ProfileStats {
  totalEarnings: number;
  totalJobs: number;
  reviewCount: number;
  rating: number | null;
}
export interface Insight {
  label: string;
  count: number;
}
export interface CompletedJob {
  id: string;
  title: string;
  jobType: JobType;
  amount: number;
  review: (Review & { endorsements: string[] }) | null;
}

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
  connectBalance: number;
  title?: string | null;
  overview?: string | null;
  hourlyRate?: number | null;
  city?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
  videoIntroUrl?: string | null;
  responseTime?: string | null;
  skills: string[];
  hoursPerWeek?: HoursPerWeek | null;
  openToContractToHire: boolean;
  idVerified: boolean;
  phoneVerified: boolean;
  militaryVeteran: boolean;
  availabilityBadge: boolean;
  boostProfile: boolean;
  showWorkHistory: boolean;
  activeRole: Role;
  onlineForMessages: boolean;
  rating?: number | null;
  languages: Language[];
  educations: Education[];
  employments: Employment[];
  portfolioItems: PortfolioItem[];
  certifications: Certification[];
  licenses: License[];
  linkedAccounts: LinkedAccount[];
  otherExperiences: OtherExperience[];
  stats: ProfileStats;
  insights: Insight[];
  completedJobs: CompletedJob[];
}
