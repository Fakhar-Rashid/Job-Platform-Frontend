import type { JobType } from './index';

export type ConversationFilter = 'all' | 'unread' | 'favorites';
export type MessageType = 'TEXT' | 'OFFER';

export interface ConversationParty {
  id: string;
  name: string;
  avatarUrl: string | null;
  title: string | null;
}

export interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  contractId: string | null;
  role: 'client' | 'freelancer';
  otherParty: ConversationParty;
  favorite: boolean;
  unread: boolean;
  lastMessageAt: string;
  lastMessage: { body: string; senderId: string; type: MessageType } | null;
}

export interface ActivityEvent {
  title: string;
  detail?: string;
  badge?: string;
  at: string;
}

export interface ConversationDetail extends Conversation {
  note: string;
  activity: ActivityEvent[];
}

export interface MessageOffer {
  contractId: string;
  type: JobType;
  hourlyRate: number | null;
  total: number;
  firstMilestone: string | null;
}

export interface Message {
  id: string;
  type: MessageType;
  body: string;
  createdAt: string;
  sender: { id: string; name: string; avatarUrl: string | null };
  offer: MessageOffer | null;
}
