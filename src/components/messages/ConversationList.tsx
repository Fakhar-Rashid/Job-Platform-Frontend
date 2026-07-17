import { useState } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import { useConversations } from '../../hooks/queries/useMessages';
import { getErrorMessage } from '../../api/client';
import type { ConversationFilter } from '../../types';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  selectedId?: string;
}

const EMPTY_TEXT: Record<ConversationFilter, string> = {
  all: 'No conversations yet.',
  unread: 'No unread messages.',
  favorites: 'No favorites yet.',
};

export default function ConversationList({ selectedId }: ConversationListProps) {
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const { data: conversations = [], error, isLoading } = useConversations(filter);

  const toggle = (value: ConversationFilter) =>
    setFilter((prev) => (prev === value ? 'all' : value));

  const chip = (value: ConversationFilter, label: string) => (
    <button
      type="button"
      onClick={() => toggle(value)}
      className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
        filter === value ? 'bg-ink text-white' : 'border border-line text-ink'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="flex items-center gap-1">
            <button type="button" className="rounded-full p-2 text-muted hover:bg-chip hover:text-ink">
              <Search className="h-5 w-5" />
            </button>
            <button type="button" className="rounded-full p-2 text-muted hover:bg-chip hover:text-ink">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-2 pb-3">
          {chip('unread', 'Unread')}
          {chip('favorites', 'Favorites')}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-hair">
        {error && <p className="px-4 py-3 text-sm text-danger">{getErrorMessage(error)}</p>}
        {isLoading ? (
          <p className="px-4 py-3 text-muted">Loading…</p>
        ) : conversations.length === 0 ? (
          <p className="px-4 py-3 text-muted">{EMPTY_TEXT[filter]}</p>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === selectedId}
            />
          ))
        )}
      </div>
    </div>
  );
}
