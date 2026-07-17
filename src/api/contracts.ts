import { api } from './client';
import type { Contract, ContractDetail, Milestone, TimeEntry, ClientFeedback, Review } from '../types';

export interface HirePayload {
  bidId: string;
  hourlyRate?: number;
  milestones?: { description: string; amount: number }[];
  message?: string;
}

export interface FeedbackPayload {
  rating: number;
  comment: string;
  endorsements?: string[];
}

export const hire = (data: HirePayload): Promise<Contract> =>
  api.post('/contracts', data).then((r) => r.data);
export const listContracts = (): Promise<Contract[]> => api.get('/contracts').then((r) => r.data);
export const getContract = (id: string): Promise<ContractDetail> =>
  api.get(`/contracts/${id}`).then((r) => r.data);
export const acceptContract = (id: string): Promise<Contract> =>
  api.post(`/contracts/${id}/accept`).then((r) => r.data);
export const declineContract = (id: string): Promise<Contract> =>
  api.post(`/contracts/${id}/decline`).then((r) => r.data);
export const withdrawContract = (id: string): Promise<Contract> =>
  api.post(`/contracts/${id}/withdraw`).then((r) => r.data);
export const endContract = (id: string): Promise<Contract> =>
  api.post(`/contracts/${id}/end`).then((r) => r.data);
export const leaveFeedback = (id: string, data: FeedbackPayload): Promise<Review | ClientFeedback> =>
  api.post(`/contracts/${id}/feedback`, data).then((r) => r.data);

export const addMilestone = (contractId: string, data: { description: string; amount: number }): Promise<Milestone> =>
  api.post(`/contracts/${contractId}/milestones`, data).then((r) => r.data);
export const updateMilestone = (id: string, data: { description: string; amount: number }): Promise<Milestone> =>
  api.patch(`/milestones/${id}`, data).then((r) => r.data);
export const deleteMilestone = (id: string): Promise<void> =>
  api.delete(`/milestones/${id}`).then((r) => r.data);
export const fundMilestone = (id: string): Promise<Milestone> =>
  api.post(`/milestones/${id}/fund`).then((r) => r.data);
export const submitMilestone = (id: string, message: string): Promise<Milestone> =>
  api.post(`/milestones/${id}/submit`, { message }).then((r) => r.data);
export const requestChanges = (id: string, note: string): Promise<Milestone> =>
  api.post(`/milestones/${id}/request-changes`, { note }).then((r) => r.data);
export const approveMilestone = (id: string): Promise<Milestone> =>
  api.post(`/milestones/${id}/approve`).then((r) => r.data);

export const logHours = (
  contractId: string,
  data: { date: string; hours: number; memo: string },
): Promise<TimeEntry> => api.post(`/contracts/${contractId}/hours`, data).then((r) => r.data);
export const removeHours = (entryId: string): Promise<void> =>
  api.delete(`/hours/${entryId}`).then((r) => r.data);
export const payHours = (contractId: string): Promise<{ paid: number; entries: number }> =>
  api.post(`/contracts/${contractId}/pay-hours`).then((r) => r.data);
