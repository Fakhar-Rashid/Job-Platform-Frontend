import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as messagesApi from '../../api/messages';
import type { StartConversationPayload } from '../../api/messages';
import { queryKeys } from '../../lib/queryKeys';
import type { ConversationFilter } from '../../types';

export function useConversations(filter: ConversationFilter) {
  return useQuery({
    queryKey: queryKeys.conversations(filter),
    queryFn: () => messagesApi.listConversations(filter),
    refetchInterval: 8000,
  });
}

export function useUnreadCount(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.unreadCount(),
    queryFn: messagesApi.unreadCount,
    refetchInterval: 15000,
    enabled,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.conversation(id),
    queryFn: () => messagesApi.getConversation(id),
    enabled: Boolean(id),
    refetchInterval: 10000,
  });
}

export function useMessages(id: string, search: string) {
  return useQuery({
    queryKey: queryKeys.messages(id, search),
    queryFn: () => messagesApi.listMessages(id, search || undefined),
    enabled: Boolean(id),
    refetchInterval: search ? false : 5000,
  });
}

export function useStartConversation() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: StartConversationPayload) => messagesApi.startConversation(data),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
      qc.invalidateQueries({ queryKey: ['bids'] });
      navigate(`/messages/${result.id}`);
    },
  });
}

export function useSendMessage(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => messagesApi.sendMessage(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useSetNote(id: string) {
  return useMutation({ mutationFn: (note: string) => messagesApi.setNote(id, note) });
}

export function useToggleFavorite(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => messagesApi.toggleFavorite(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  });
}
