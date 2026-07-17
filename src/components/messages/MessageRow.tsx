import { avatarFor } from '../../utils/avatar';
import type { Message } from '../../types';
import OfferMessageCard from './OfferMessageCard';

interface MessageRowProps {
  message: Message;
  mine: boolean;
}

export default function MessageRow({ message }: MessageRowProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return (
    <div className="flex gap-3">
      <img
        src={avatarFor(message.sender, 72)}
        alt={message.sender.name}
        className="h-9 w-9 shrink-0 rounded-full"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{message.sender.name}</span>
          <span className="text-xs text-muted">{time}</span>
        </div>
        {message.type === 'OFFER' && message.offer ? (
          <OfferMessageCard offer={message.offer} body={message.body} />
        ) : (
          <p className="mt-0.5 whitespace-pre-wrap text-ink">{message.body}</p>
        )}
      </div>
    </div>
  );
}
