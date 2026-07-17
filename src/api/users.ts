import { api } from './client';
import type { TalentUser } from '../types';

export const listTalent = (): Promise<TalentUser[]> => api.get('/users').then((r) => r.data);
