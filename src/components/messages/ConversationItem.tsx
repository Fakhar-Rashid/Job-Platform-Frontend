import { Link } from 'react-router-dom';
import { avatarFor } from '../../utils/avatar';
import { useAuth } from '../../hooks/useAuth';
import type { Conversation } from '../../types';

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
}

function previewText(conversation: Conversation): string {
  if (!conversation.lastMessage) return '';
  if (conversation.lastMessage.type === 'OFFER') return 'Sent an offer';
  return conversation.lastMessage.body;
}

export default function ConversationItem({ conversation, active }: ConversationItemProps) {
  const { user } = useAuth();
  const { otherParty, jobTitle, unread } = conversation;
  const firstWord = otherParty.title?.split(' ')[0];
  const heading = firstWord ? `${otherParty.name}, ${firstWord}` : otherParty.name;
  const date = new Date(conversation.lastMessageAt).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });
  const mine = conversation.lastMessage?.senderId === user?.id;

  return (
    <Link
      to={`/messages/${conversation.id}`}
      className={`block border-b border-hair px-4 py-3 no-underline hover:bg-soft hover:no-underline ${active ? 'bg-soft' : ''}`}
    >
      <div className="flex gap-3">
        <img src={avatarFor(otherParty, 80)} alt={otherParty.name} className="h-11 w-11 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="min-w-0 flex-1 truncate font-semibold text-ink">{heading}</span>
            <span className="shrink-0 text-xs text-muted">{date}</span>
          </div>
          <p className="truncate text-[13px] text-muted">{jobTitle}</p>
          <div className="flex items-center gap-2">
            <p className={`min-w-0 flex-1 truncate text-[13px] ${unread ? 'font-medium text-ink' : 'text-muted'}`}>
              {mine ? 'You: ' : ''}
              {previewText(conversation)}
            </p>
            {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />}
          </div>
        </div>
      </div>
    </Link>
  );
}
