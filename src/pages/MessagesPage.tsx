import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ConversationList from '../components/messages/ConversationList';
import ConversationThread from '../components/messages/ConversationThread';
import ConversationDetails from '../components/messages/ConversationDetails';

export default function MessagesPage() {
  const { id } = useParams<{ id: string }>();
  useAuth();
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    if (id) setDetailsOpen(true);
  }, [id]);

  const showDetails = Boolean(id) && detailsOpen;
  const columns = showDetails
    ? 'grid-cols-[340px_minmax(0,1fr)_360px]'
    : 'grid-cols-[340px_minmax(0,1fr)]';

  return (
    <div className={`grid h-screen ${columns}`}>
      <div className="min-h-0 border-r border-hair">
        <ConversationList selectedId={id} />
      </div>
      <div className="min-h-0 border-r border-hair">
        {id ? (
          <ConversationThread id={id} onToggleDetails={() => setDetailsOpen((prev) => !prev)} />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-muted">
            Select a conversation to start messaging.
          </div>
        )}
      </div>
      {showDetails && id && (
        <div className="min-h-0">
          <ConversationDetails id={id} onClose={() => setDetailsOpen(false)} />
        </div>
      )}
    </div>
  );
}
