import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '../../api/reviews';
import { queryKeys } from '../../lib/queryKeys';
import type { Review } from '../../types';

export function useReview(jobId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.review(jobId),
    queryFn: () => reviewsApi.getReview(jobId),
    enabled: Boolean(jobId) && enabled,
  });
}

export function useCreateReview(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Review>) => reviewsApi.createReview(jobId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.review(jobId) });
      qc.invalidateQueries({ queryKey: queryKeys.job(jobId) });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
