import { api } from './client';
import type { Review } from '../types';

export const getReview = (jobId: string): Promise<Review | null> =>
  api.get(`/jobs/${jobId}/review`).then((r) => r.data);
export const createReview = (jobId: string, data: Partial<Review>): Promise<Review> =>
  api.post(`/jobs/${jobId}/review`, data).then((r) => r.data);
