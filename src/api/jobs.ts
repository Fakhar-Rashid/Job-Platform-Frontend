import { api } from './client';
import type { Job, JobsPage, JobsFilters } from '../types';

export const listJobs = (params: JobsFilters): Promise<JobsPage> =>
  api.get('/jobs', { params }).then((r) => r.data);
export const getJob = (id: string): Promise<Job> => api.get(`/jobs/${id}`).then((r) => r.data);
export const myJobs = (): Promise<Job[]> => api.get('/jobs/mine').then((r) => r.data);
export const createJob = (data: Partial<Job>): Promise<Job> =>
  api.post('/jobs', data).then((r) => r.data);
export const updateJob = (id: string, data: Partial<Job>): Promise<Job> =>
  api.patch(`/jobs/${id}`, data).then((r) => r.data);
export const deleteJob = (id: string): Promise<void> =>
  api.delete(`/jobs/${id}`).then((r) => r.data);
