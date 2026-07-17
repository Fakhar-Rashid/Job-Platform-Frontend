import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as bidsApi from '../../api/bids.js';
import { queryKeys } from '../../lib/queryKeys.js';

export function useJobBids(jobId, enabled) {
  return useQuery({
    queryKey: queryKeys.jobBids(jobId),
    queryFn: () => bidsApi.jobBids(jobId),
    enabled: Boolean(jobId) && enabled,
  });
}

export function useMyBids() {
  return useQuery({ queryKey: queryKeys.myBids(), queryFn: bidsApi.myBids });
}

export function usePlaceBid(jobId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => bidsApi.placeBid(jobId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.job(jobId) });
      qc.invalidateQueries({ queryKey: queryKeys.myBids() });
      qc.invalidateQueries({ queryKey: queryKeys.connects() });
    },
  });
}

export function useAcceptBid(jobId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bidId) => bidsApi.acceptBid(bidId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.job(jobId) });
      qc.invalidateQueries({ queryKey: queryKeys.jobBids(jobId) });
    },
  });
}
