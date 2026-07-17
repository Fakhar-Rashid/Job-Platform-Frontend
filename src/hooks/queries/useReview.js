import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '../../api/reviews.js';
import { queryKeys } from '../../lib/queryKeys.js';

export function useReview(jobId, enabled) {
  return useQuery({
    queryKey: queryKeys.review(jobId),
    queryFn: () => reviewsApi.getReview(jobId),
    enabled: Boolean(jobId) && enabled,
  });
}

export function useCreateReview(jobId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => reviewsApi.createReview(jobId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.review(jobId) });
      qc.invalidateQueries({ queryKey: queryKeys.job(jobId) });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
