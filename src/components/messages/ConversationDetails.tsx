import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2 } from 'lucide-react';
import { useConversation, useMessages, useSetNote } from '../../hooks/queries/useMessages';
import { avatarFor } from '../../utils/avatar';
import { timeAgo } from '../../utils/format';
import Badge from '../ui/Badge';
import Section from './Section';

interface ConversationDetailsProps {
  id: string;
  onClose: () => void;
}

export default function ConversationDetails({ id, onClose }: ConversationDetailsProps) {
  const { data: detail } = useConversation(id);
  const setNote = useSetNote(id);
  const [query, setQuery] = useState('');
  const [note, setLocalNote] = useState('');
  const [noteLoaded, setNoteLoaded] = useState(false);
  const savedNote = useRef('');
  const { data: results = [] } = useMessages(id, query);

  useEffect(() => {
    setNoteLoaded(false);
    savedNote.current = '';
  }, [id]);

  useEffect(() => {
    if (detail && !noteLoaded) {
      setLocalNote(detail.note);
      savedNote.current = detail.note;
      setNoteLoaded(true);
    }
  }, [detail, noteLoaded]);

  useEffect(() => {
    if (!noteLoaded || note === savedNote.current) return;
    const timer = setTimeout(() => {
      savedNote.current = note;
      setNote.mutate(note);
    }, 600);
    return () => clearTimeout(timer);
  }, [note, noteLoaded, setNote]);

  if (!detail) return <div className="overflow-y-auto" />;

  const { otherParty, contractId, role, activity } = detail;
  const profileTitle = role === 'client' ? 'Freelancer' : 'Client';

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="flex justify-end px-4 pt-3">
        <button type="button" onClick={onClose} className="rounded-full p-2 text-muted hover:bg-chip hover:text-ink">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col items-center px-5 pb-5 text-center">
        <img src={avatarFor(otherParty, 128)} alt={otherParty.name} className="h-16 w-16 rounded-full" />
        <p className="mt-2 font-semibold text-ink">{otherParty.name}</p>
        {otherParty.title && <p className="text-[13px] text-muted">{otherParty.title}</p>}
        {contractId && (
          <Link to={`/contracts/${contractId}`} className="mt-2 font-semibold text-brand hover:text-brand-dark">
            View contract
          </Link>
        )}
      </div>

      <Section title="Activity timeline" defaultOpen>
        {activity.length === 0 ? (
          <p className="text-[13px] text-muted">No contract activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((event, index) => (
              <li key={index} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <div className="min-w-0">
                  <p className="font-medium text-ink">{event.title}</p>
                  {event.detail && (
                    <p className="text-[13px] text-muted">
                      {event.detail}
                      {event.badge && <Badge className="ml-2">{event.badge}</Badge>}
                    </p>
                  )}
                  <p className="text-xs text-muted">{timeAgo(event.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Search messages">
        <input
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          placeholder="Search messages"
          className="w-full"
        />
        {query.trim() && (
          <div className="mt-3 space-y-3">
            {results.length === 0 ? (
              <p className="text-[13px] text-muted">No messages match.</p>
            ) : (
              results.map((message) => (
                <div key={message.id}>
                  <p className="text-[13px] font-medium text-ink">{message.sender.name}</p>
                  <p className="truncate text-[13px] text-muted">{message.body}</p>
                </div>
              ))
            )}
          </div>
        )}
      </Section>

      <Section title={`${profileTitle} profile`}>
        <Link to={`/users/${otherParty.id}`} className="font-semibold text-brand hover:text-brand-dark">
          View profile
        </Link>
      </Section>

      <Section title="Personal notepad">
        <textarea
          value={note}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setLocalNote(event.target.value)}
          rows={4}
          placeholder="Add a note"
          className="w-full resize-none"
        />
        <p className="mt-2 text-xs text-muted">Only you can see this.</p>
      </Section>
    </div>
  );
}
