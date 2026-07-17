import { api } from './client.js';

export const getProfile = (id) => api.get(`/profile/${id}`).then((r) => r.data);
export const updateCore = (data) => api.patch('/profile', data).then((r) => r.data);
export const updateSkills = (skills) => api.put('/profile/skills', { skills }).then((r) => r.data);
export const createChild = (path, data) => api.post(`/profile/${path}`, data).then((r) => r.data);
export const updateChild = (path, id, data) => api.patch(`/profile/${path}/${id}`, data).then((r) => r.data);
export const deleteChild = (path, id) => api.delete(`/profile/${path}/${id}`).then((r) => r.data);
