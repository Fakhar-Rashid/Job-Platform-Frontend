import { api } from './client';
import type { Bid } from '../types';

export const placeBid = (jobId: string, data: Partial<Bid>): Promise<Bid> =>
  api.post(`/jobs/${jobId}/bids`, data).then((r) => r.data);
export const jobBids = (jobId: string): Promise<Bid[]> => api.get(`/jobs/${jobId}/bids`).then((r) => r.data);
export const myBids = (): Promise<Bid[]> => api.get('/bids/mine').then((r) => r.data);
export const acceptBid = (bidId: string): Promise<Bid> =>
  api.post(`/bids/${bidId}/accept`).then((r) => r.data);
