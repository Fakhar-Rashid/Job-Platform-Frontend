import { api } from './client.js';

export const getReview = (jobId) => api.get(`/jobs/${jobId}/review`).then((r) => r.data);
export const createReview = (jobId, data) => api.post(`/jobs/${jobId}/review`, data).then((r) => r.data);
