import { api } from './client';
import type { Conversation, ConversationDetail, ConversationFilter, Message } from '../types';

export interface StartConversationPayload {
  jobId: string;
  freelancerId: string;
  body: string;
}

export const startConversation = (data: StartConversationPayload): Promise<{ id: string }> =>
  api.post('/conversations', data).then((r) => r.data);
export const listConversations = (filter: ConversationFilter): Promise<Conversation[]> =>
  api.get('/conversations', { params: filter === 'all' ? {} : { filter } }).then((r) => r.data);
export const unreadCount = (): Promise<{ count: number }> =>
  api.get('/conversations/unread-count').then((r) => r.data);
export const getConversation = (id: string): Promise<ConversationDetail> =>
  api.get(`/conversations/${id}`).then((r) => r.data);
export const listMessages = (id: string, search?: string): Promise<Message[]> =>
  api.get(`/conversations/${id}/messages`, { params: search ? { search } : {} }).then((r) => r.data);
export const sendMessage = (id: string, body: string): Promise<Message> =>
  api.post(`/conversations/${id}/messages`, { body }).then((r) => r.data);
export const setNote = (id: string, note: string): Promise<void> =>
  api.patch(`/conversations/${id}/note`, { note }).then((r) => r.data);
export const toggleFavorite = (id: string): Promise<void> =>
  api.post(`/conversations/${id}/favorite`).then((r) => r.data);
