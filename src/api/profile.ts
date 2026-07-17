import { api } from './client';
import type { Profile } from '../types';

export const getProfile = (id: string): Promise<Profile> => api.get(`/profile/${id}`).then((r) => r.data);
export const updateCore = (data: Partial<Profile>): Promise<Profile> =>
  api.patch('/profile', data).then((r) => r.data);
export const updateSkills = (skills: string[]): Promise<Profile> =>
  api.put('/profile/skills', { skills }).then((r) => r.data);
export const createChild = (path: string, data: Record<string, unknown>): Promise<Profile> =>
  api.post(`/profile/${path}`, data).then((r) => r.data);
export const updateChild = (path: string, id: string, data: Record<string, unknown>): Promise<Profile> =>
  api.patch(`/profile/${path}/${id}`, data).then((r) => r.data);
export const deleteChild = (path: string, id: string): Promise<Profile> =>
  api.delete(`/profile/${path}/${id}`).then((r) => r.data);
