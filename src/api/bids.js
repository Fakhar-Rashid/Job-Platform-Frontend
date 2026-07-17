import { api } from './client.js';

export const placeBid = (jobId, data) => api.post(`/jobs/${jobId}/bids`, data).then((r) => r.data);
export const jobBids = (jobId) => api.get(`/jobs/${jobId}/bids`).then((r) => r.data);
export const myBids = () => api.get('/bids/mine').then((r) => r.data);
export const acceptBid = (bidId) => api.post(`/bids/${bidId}/accept`).then((r) => r.data);
