import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobsApi from '../../api/jobs.js';
import { queryKeys } from '../../lib/queryKeys.js';

export function useInfiniteJobs(filters) {
  return useInfiniteQuery({
    queryKey: queryKeys.jobs(filters),
    queryFn: ({ pageParam }) => jobsApi.listJobs({ ...filters, cursor: pageParam, limit: 20 }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useJob(id) {
  return useQuery({
    queryKey: queryKeys.job(id),
    queryFn: () => jobsApi.getJob(id),
    enabled: Boolean(id),
  });
}

export function useMyJobs() {
  return useQuery({ queryKey: queryKeys.myJobs(), queryFn: jobsApi.myJobs });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
}
