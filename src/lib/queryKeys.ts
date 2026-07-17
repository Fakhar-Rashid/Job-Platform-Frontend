import type { JobsFilters } from '../types';

export const queryKeys = {
  jobs: (filters: JobsFilters) => ['jobs', filters] as const,
  job: (id: string) => ['job', id] as const,
  myJobs: () => ['jobs', 'mine'] as const,
  jobBids: (jobId: string) => ['bids', 'job', jobId] as const,
  myBids: () => ['bids', 'mine'] as const,
  review: (jobId: string) => ['review', jobId] as const,
  profile: (id: string) => ['profile', id] as const,
  connects: () => ['connects'] as const,
};
