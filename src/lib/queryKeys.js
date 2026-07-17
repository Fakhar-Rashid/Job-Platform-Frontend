export const queryKeys = {
  jobs: (filters) => ['jobs', filters],
  job: (id) => ['job', id],
  myJobs: () => ['jobs', 'mine'],
  jobBids: (jobId) => ['bids', 'job', jobId],
  myBids: () => ['bids', 'mine'],
  review: (jobId) => ['review', jobId],
  profile: (id) => ['profile', id],
  connects: () => ['connects'],
};
