import type {
  ContractStatus,
  ExperienceLevel,
  HoursPerWeek,
  Job,
  JobDuration,
  LanguageProficiency,
  MilestoneStatus,
  ProjectTerm,
  ScopeSize,
} from '../types';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} minutes ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hours ago`;
  const days = Math.floor(diff / DAY);
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function proposalRange(count = 0): string {
  if (count < 5) return 'Fewer than 5';
  const lower = Math.floor(count / 5) * 5;
  return `${lower} to ${lower + 5}`;
}

export function money(amount = 0): string {
  if (amount >= 1000) return `$${Math.floor(amount / 1000)}K+`;
  return `$${amount}`;
}

export function experienceLabel(level: ExperienceLevel): string {
  const map: Record<ExperienceLevel, string> = {
    ENTRY: 'Entry level',
    INTERMEDIATE: 'Intermediate',
    EXPERT: 'Expert',
  };
  return map[level] ?? 'Entry level';
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function monthLabel(value: string | null | undefined): string {
  if (!value) return '';
  const [year, month] = value.split('-');
  return `${MONTHS[Number(month) - 1] ?? ''} ${year}`.trim();
}

export const HOURS_LABEL: Record<HoursPerWeek, string> = {
  AS_NEEDED: 'As needed - open to offers',
  LESS_THAN_30: 'Less than 30 hrs/week',
  MORE_THAN_30: 'More than 30 hrs/week',
};

export const PROFICIENCY_LABEL: Record<LanguageProficiency, string> = {
  BASIC: 'Basic',
  CONVERSATIONAL: 'Conversational',
  FLUENT: 'Fluent',
  NATIVE_OR_BILINGUAL: 'Native or Bilingual',
};

export const SCOPE_LABEL: Record<ScopeSize, string> = {
  LARGE: 'Large',
  MEDIUM: 'Medium',
  SMALL: 'Small',
};

export const DURATION_LABEL: Record<JobDuration, string> = {
  MORE_THAN_6_MONTHS: 'More than 6 months',
  THREE_TO_SIX_MONTHS: '3 to 6 months',
  ONE_TO_THREE_MONTHS: '1 to 3 months',
};

export const TERM_LABEL: Record<ProjectTerm, string> = {
  LONG_TERM: 'More than 30 hrs/week',
  SHORT_TERM: 'Less than 30 hrs/week',
};

export function jobRateLabel(job: Pick<Job, 'jobType' | 'budget' | 'hourlyRateMin' | 'hourlyRateMax'>): string {
  if (job.jobType === 'HOURLY' && job.hourlyRateMin != null && job.hourlyRateMax != null) {
    return `$${job.hourlyRateMin.toFixed(2)} - $${job.hourlyRateMax.toFixed(2)}`;
  }
  return job.budget != null ? `$${job.budget}` : 'Budget not set';
}

export function serviceFee(amount: number): { fee: number; receives: number } {
  const fee = Math.round(amount * 0.1 * 100) / 100;
  return { fee, receives: Math.round((amount - fee) * 100) / 100 };
}

export function payoutAfterFee(amount: number): number {
  return amount - Math.round(amount * 0.1);
}

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  OFFERED: 'Offer pending',
  ACTIVE: 'Active',
  DECLINED: 'Declined',
  WITHDRAWN: 'Withdrawn',
  ENDED: 'Ended',
};

export const MILESTONE_STATUS_LABEL: Record<MilestoneStatus, string> = {
  PENDING: 'Not funded',
  FUNDED: 'In escrow',
  SUBMITTED: 'Work submitted',
  CHANGES_REQUESTED: 'Changes requested',
  APPROVED: 'Paid',
  CANCELLED: 'Cancelled',
};

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
