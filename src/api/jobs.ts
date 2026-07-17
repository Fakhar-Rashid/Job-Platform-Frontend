import { api } from './client';
import type {
  ExperienceLevel,
  Job,
  JobDetail,
  JobDuration,
  JobsFilters,
  JobsPage,
  JobType,
  ProjectTerm,
  ScopeSize,
} from '../types';

export interface CreateJobPayload {
  title: string;
  description: string;
  jobType: JobType;
  budget?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  category?: string;
  projectTerm?: ProjectTerm;
  scopeSize?: ScopeSize;
  duration?: JobDuration;
  experienceLevel: ExperienceLevel;
  contractToHire: boolean;
  skills: string[];
}

export const listJobs = (params: JobsFilters): Promise<JobsPage> =>
  api.get('/jobs', { params }).then((r) => r.data);
export const getJob = (id: string): Promise<JobDetail> => api.get(`/jobs/${id}`).then((r) => r.data);
export const myJobs = (): Promise<Job[]> => api.get('/jobs/mine').then((r) => r.data);
export const createJob = (data: CreateJobPayload): Promise<Job> =>
  api.post('/jobs', data).then((r) => r.data);
export const updateJob = (id: string, data: Partial<Job>): Promise<Job> =>
  api.patch(`/jobs/${id}`, data).then((r) => r.data);
export const deleteJob = (id: string): Promise<void> => api.delete(`/jobs/${id}`).then((r) => r.data);
export const savedJobs = (): Promise<Job[]> => api.get('/jobs/saved').then((r) => r.data);
export const saveJob = (id: string): Promise<void> => api.post(`/jobs/${id}/save`).then((r) => r.data);
export const unsaveJob = (id: string): Promise<void> => api.delete(`/jobs/${id}/save`).then((r) => r.data);
