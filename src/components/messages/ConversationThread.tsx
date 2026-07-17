import { useEffect, useRef, useState } from 'react';
import { Star, PanelRightOpen, Send, Briefcase } from 'lucide-react';
import {
  useConversation,
  useMessages,
  useSendMessage,
  useToggleFavorite,
} from '../../hooks/queries/useMessages';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../api/client';
import Button from '../ui/Button';
import type { Message } from '../../types';
import MessageRow from './MessageRow';
import DateSeparator from './DateSeparator';

interface ConversationThreadProps {
  id: string;
  onToggleDetails: () => void;
}

function dayKey(iso: string): string {
  return new Date(iso).toDateString();
}

function dayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function ConversationThread({ id, onToggleDetails }: ConversationThreadProps) {
  const { user } = useAuth();
  const { data: detail } = useConversation(id);
  const { data: messages = [] } = useMessages(id, '');
  const sendMessage = useSendMessage(id);
  const toggleFavorite = useToggleFavorite(id);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const submit = () => {
    const body = draft.trim();
    if (!body || sendMessage.isPending) return;
    setError('');
    sendMessage.mutate(body, {
      onSuccess: () => setDraft(''),
      onError: (err) => setError(getErrorMessage(err)),
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  let lastDay = '';

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-hair px-6 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{detail?.otherParty.name ?? ''}</p>
          {detail && (
            <span className="mt-0.5 inline-flex max-w-full items-center gap-1.5 truncate text-[13px] text-muted">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{detail.jobTitle}</span>
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => toggleFavorite.mutate()}
            className="rounded-full p-2 text-muted hover:bg-chip hover:text-ink"
          >
            <Star className={`h-5 w-5 ${detail?.favorite ? 'fill-star text-star' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onToggleDetails}
            className="rounded-full p-2 text-muted hover:bg-chip hover:text-ink"
          >
            <PanelRightOpen className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
        {messages.map((message: Message) => {
          const key = dayKey(message.createdAt);
          const showDay = key !== lastDay;
          lastDay = key;
          return (
            <div key={message.id} className="flex flex-col gap-4">
              {showDay && <DateSeparator label={dayLabel(message.createdAt)} />}
              <MessageRow message={message} mine={message.sender.id === user?.id} />
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="border-t border-hair p-4">
        {error && <p className="mb-2 text-sm text-danger">{error}</p>}
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Send a message..."
            className="flex-1 resize-none rounded-xl border border-line"
          />
          <Button
            type="button"
            onClick={submit}
            disabled={sendMessage.isPending || !draft.trim()}
            size="icon"
            className="h-11 w-11"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
