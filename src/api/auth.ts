import { api } from './client';
import type { CurrentUser } from '../types';

interface AuthResponse {
  token: string;
  user: CurrentUser;
}

export const register = (data: { name: string; email: string; password: string }): Promise<AuthResponse> =>
  api.post('/auth/register', data).then((r) => r.data);
export const login = (data: { email: string; password: string }): Promise<AuthResponse> =>
  api.post('/auth/login', data).then((r) => r.data);
export const me = (): Promise<CurrentUser> => api.get('/auth/me').then((r) => r.data);
