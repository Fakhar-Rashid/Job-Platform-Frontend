import { api } from './client';
import type { Wallet } from '../types';

export const getWallet = (): Promise<Wallet> => api.get('/wallet').then((r) => r.data);
export const topUpWallet = (): Promise<{ balance: number; added: number }> =>
  api.post('/wallet/topup').then((r) => r.data);
