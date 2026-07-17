import { api } from './client';

export interface ConnectBalance {
  balance: number;
}

export interface ConnectTransaction {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export const getBalance = (): Promise<ConnectBalance> =>
  api.get('/connects/balance').then((r) => r.data);
export const topUp = (): Promise<ConnectBalance> =>
  api.post('/connects/topup').then((r) => r.data);
export const transactions = (): Promise<ConnectTransaction[]> =>
  api.get('/connects/transactions').then((r) => r.data);
