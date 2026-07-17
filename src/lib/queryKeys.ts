import type { JobsFilters } from '../types';

export const queryKeys = {
  jobs: (filters: JobsFilters) => ['jobs', filters] as const,
  job: (id: string) => ['job', id] as const,
  myJobs: () => ['jobs', 'mine'] as const,
  savedJobs: () => ['jobs', 'saved'] as const,
  jobBids: (jobId: string) => ['bids', 'job', jobId] as const,
  jobBoosts: (jobId: string) => ['bids', 'boosts', jobId] as const,
  myBids: () => ['bids', 'mine'] as const,
  review: (jobId: string) => ['review', jobId] as const,
  profile: (id: string) => ['profile', id] as const,
  connects: () => ['connects'] as const,
  talent: () => ['talent'] as const,
  contracts: () => ['contracts'] as const,
  contract: (id: string) => ['contracts', id] as const,
  wallet: () => ['wallet'] as const,
};
