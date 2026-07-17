import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobsApi from '../../api/jobs';
import { queryKeys } from '../../lib/queryKeys';
import type { JobsFilters } from '../../types';

export function useInfiniteJobs(filters: JobsFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.jobs(filters),
    queryFn: ({ pageParam }) => jobsApi.listJobs({ ...filters, cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage): string | undefined => lastPage.nextCursor ?? undefined,
  });
}

export function useJob(id: string) {
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

export function useSavedJobs(enabled = true) {
  return useQuery({ queryKey: queryKeys.savedJobs(), queryFn: jobsApi.savedJobs, enabled });
}

export function useToggleSaveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, saved }: { jobId: string; saved: boolean }) =>
      saved ? jobsApi.unsaveJob(jobId) : jobsApi.saveJob(jobId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.savedJobs() }),
  });
}
