import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as walletApi from '../../api/wallet';
import { queryKeys } from '../../lib/queryKeys';
import { useAuth } from '../useAuth';

export function useWallet() {
  return useQuery({ queryKey: queryKeys.wallet(), queryFn: walletApi.getWallet });
}

export function useTopUpWallet() {
  const qc = useQueryClient();
  const { refreshUser } = useAuth();
  return useMutation({
    mutationFn: walletApi.topUpWallet,
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: queryKeys.wallet() });
      await refreshUser();
    },
  });
}
