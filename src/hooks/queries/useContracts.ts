import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contractsApi from '../../api/contracts';
import type { HirePayload, FeedbackPayload } from '../../api/contracts';
import { queryKeys } from '../../lib/queryKeys';
import { useAuth } from '../useAuth';

export function useContracts() {
  return useQuery({ queryKey: queryKeys.contracts(), queryFn: contractsApi.listContracts });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: queryKeys.contract(id),
    queryFn: () => contractsApi.getContract(id),
    enabled: Boolean(id),
  });
}

function useContractInvalidator(contractId?: string) {
  const qc = useQueryClient();
  const { refreshUser } = useAuth();
  return async () => {
    qc.invalidateQueries({ queryKey: queryKeys.contracts() });
    if (contractId) qc.invalidateQueries({ queryKey: queryKeys.contract(contractId) });
    qc.invalidateQueries({ queryKey: ['jobs'] });
    qc.invalidateQueries({ queryKey: ['bids'] });
    qc.invalidateQueries({ queryKey: queryKeys.wallet() });
    qc.invalidateQueries({ queryKey: ['profile'] });
    await refreshUser();
  };
}

export function useHire() {
  const invalidate = useContractInvalidator();
  return useMutation({ mutationFn: (data: HirePayload) => contractsApi.hire(data), onSuccess: invalidate });
}

export function useContractAction(contractId: string) {
  const invalidate = useContractInvalidator(contractId);
  return {
    accept: useMutation({ mutationFn: () => contractsApi.acceptContract(contractId), onSuccess: invalidate }),
    decline: useMutation({ mutationFn: () => contractsApi.declineContract(contractId), onSuccess: invalidate }),
    withdraw: useMutation({ mutationFn: () => contractsApi.withdrawContract(contractId), onSuccess: invalidate }),
    end: useMutation({ mutationFn: () => contractsApi.endContract(contractId), onSuccess: invalidate }),
    feedback: useMutation({
      mutationFn: (data: FeedbackPayload) => contractsApi.leaveFeedback(contractId, data),
      onSuccess: invalidate,
    }),
    payHours: useMutation({ mutationFn: () => contractsApi.payHours(contractId), onSuccess: invalidate }),
  };
}

export function useMilestoneActions(contractId: string) {
  const invalidate = useContractInvalidator(contractId);
  return {
    add: useMutation({
      mutationFn: (data: { description: string; amount: number }) => contractsApi.addMilestone(contractId, data),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, ...data }: { id: string; description: string; amount: number }) =>
        contractsApi.updateMilestone(id, data),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => contractsApi.deleteMilestone(id), onSuccess: invalidate }),
    fund: useMutation({ mutationFn: (id: string) => contractsApi.fundMilestone(id), onSuccess: invalidate }),
    submit: useMutation({
      mutationFn: ({ id, message }: { id: string; message: string }) => contractsApi.submitMilestone(id, message),
      onSuccess: invalidate,
    }),
    requestChanges: useMutation({
      mutationFn: ({ id, note }: { id: string; note: string }) => contractsApi.requestChanges(id, note),
      onSuccess: invalidate,
    }),
    approve: useMutation({ mutationFn: (id: string) => contractsApi.approveMilestone(id), onSuccess: invalidate }),
  };
}

export function useHoursActions(contractId: string) {
  const invalidate = useContractInvalidator(contractId);
  return {
    log: useMutation({
      mutationFn: (data: { date: string; hours: number; memo: string }) => contractsApi.logHours(contractId, data),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (entryId: string) => contractsApi.removeHours(entryId), onSuccess: invalidate }),
  };
}
