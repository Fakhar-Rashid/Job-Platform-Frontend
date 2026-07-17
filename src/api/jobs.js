import { api } from './client.js';

export const listJobs = (params) => api.get('/jobs', { params }).then((r) => r.data);
export const getJob = (id) => api.get(`/jobs/${id}`).then((r) => r.data);
export const myJobs = () => api.get('/jobs/mine').then((r) => r.data);
export const createJob = (data) => api.post('/jobs', data).then((r) => r.data);
export const updateJob = (id, data) => api.patch(`/jobs/${id}`, data).then((r) => r.data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`).then((r) => r.data);
