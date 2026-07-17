import { api } from './client';
import type { Bid, BoostEntry } from '../types';

export interface PlaceBidPayload {
  amount: number;
  coverLetter: string;
  boostConnects?: number;
}

export const placeBid = (jobId: string, data: PlaceBidPayload): Promise<Bid> =>
  api.post(`/jobs/${jobId}/bids`, data).then((r) => r.data);
export const jobBids = (jobId: string): Promise<Bid[]> => api.get(`/jobs/${jobId}/bids`).then((r) => r.data);
export const jobBoosts = (jobId: string): Promise<BoostEntry[]> =>
  api.get(`/jobs/${jobId}/bids/boosts`).then((r) => r.data);
export const myBids = (): Promise<Bid[]> => api.get('/bids/mine').then((r) => r.data);
