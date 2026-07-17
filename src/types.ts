export type JobStatus = 'OPEN' | 'CLOSED';
export type JobType = 'FIXED' | 'HOURLY';
export type ExperienceLevel = 'ENTRY' | 'INTERMEDIATE' | 'EXPERT';
export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type HoursPerWeek = 'AS_NEEDED' | 'LESS_THAN_30' | 'MORE_THAN_30';
export type LanguageProficiency = 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE_OR_BILINGUAL';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  connectBalance: number;
  title?: string | null;
  avatarUrl?: string | null;
}

export interface JobOwner {
  id: string;
  name: string;
  paymentVerified?: boolean;
  rating?: number | null;
  totalSpent?: number;
  country?: string | null;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  durationLabel?: string | null;
  skills: string[];
  status: JobStatus;
  createdAt: string;
  ownerId: string;
  owner?: JobOwner;
  bidCount?: number;
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
  status: BidStatus;
  createdAt: string;
  jobId: string;
  freelancerId: string;
  freelancer?: { id: string; name: string };
  job?: { id: string; title: string; status?: JobStatus };
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
