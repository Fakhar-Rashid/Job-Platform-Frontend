import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/feed/SearchBar';
import SavedSearches from '../components/feed/SavedSearches';
import FeedTabs from '../components/feed/FeedTabs';
import JobFeedCard from '../components/feed/JobFeedCard';
import ProfileCard from '../components/sidebar/ProfileCard';
import ReachMoreClients from '../components/sidebar/ReachMoreClients';
import SidebarLinks from '../components/sidebar/SidebarLinks';
import Button from '../components/ui/Button';
import { useInfiniteJobs } from '../hooks/queries/useJobs';
import { getErrorMessage } from '../api/client';
import type { JobsFilters } from '../types';

const INTRO: Record<string, string> = {
  'Best matches':
    "Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.",
  'Most recent': 'The newest jobs posted on MiniWork, ordered by date.',
};

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [tab, setTab] = useState('Best matches');
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filters = useMemo<JobsFilters>(
    () => ({ status: 'OPEN', ...(debounced ? { search: debounced } : {}) }),
    [debounced],
  );
  const hasFeed = tab === 'Best matches' || tab === 'Most recent';
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteJobs(filters);

  const jobs = (data?.pages.flatMap((page) => page.items) ?? []).filter((job) => !dismissed.includes(job.id));

  return (
    <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="min-w-0">
        <SearchBar value={search} onChange={setSearch} />
        <SavedSearches onSelect={setSearch} />
        <FeedTabs active={tab} onSelect={setTab} onToggleFilters={() => {}} />
        <p className="mb-1 mt-4.5 text-muted">{INTRO[tab] ?? 'Nothing here yet — check back soon.'}</p>

        {error && <p className="text-sm text-danger">{getErrorMessage(error)}</p>}
        {!hasFeed ? (
          <p className="py-6 text-muted">Nothing here yet — check back soon.</p>
        ) : isLoading ? (
          <p className="py-6 text-muted">Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <p className="py-6 text-muted">No jobs to show right now.</p>
        ) : (
          <>
            {jobs.map((job) => (
              <JobFeedCard
                key={job.id}
                job={job}
                onDismiss={(id: string) => setDismissed((prev) => [...prev, id])}
              />
            ))}
            {hasNextPage && (
              <div className="py-6 text-center">
                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage ? 'Loading…' : 'Load more jobs'}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <aside className="sticky top-7 hidden flex-col gap-4.5 lg:flex">
        <ProfileCard />
        <ReachMoreClients />
        <SidebarLinks />
      </aside>
    </div>
  );
}
