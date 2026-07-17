import { api } from './client.js';

export const getBalance = () => api.get('/connects/balance').then((r) => r.data);
export const topUp = () => api.post('/connects/topup').then((r) => r.data);
export const transactions = () => api.get('/connects/transactions').then((r) => r.data);
