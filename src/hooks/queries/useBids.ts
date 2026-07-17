import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as bidsApi from '../../api/bids';
import type { PlaceBidPayload } from '../../api/bids';
import { queryKeys } from '../../lib/queryKeys';

export function useJobBids(jobId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.jobBids(jobId),
    queryFn: () => bidsApi.jobBids(jobId),
    enabled: Boolean(jobId) && enabled,
  });
}

export function useJobBoosts(jobId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.jobBoosts(jobId),
    queryFn: () => bidsApi.jobBoosts(jobId),
    enabled: Boolean(jobId) && enabled,
  });
}

export function useMyBids() {
  return useQuery({ queryKey: queryKeys.myBids(), queryFn: bidsApi.myBids });
}

export function usePlaceBid(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PlaceBidPayload) => bidsApi.placeBid(jobId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.job(jobId) });
      qc.invalidateQueries({ queryKey: queryKeys.myBids() });
      qc.invalidateQueries({ queryKey: queryKeys.jobBoosts(jobId) });
      qc.invalidateQueries({ queryKey: queryKeys.connects() });
    },
  });
}
