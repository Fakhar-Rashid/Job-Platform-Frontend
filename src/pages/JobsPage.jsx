import { useEffect, useState } from 'react';
import SearchBar from '../components/feed/SearchBar.jsx';
import SavedSearches from '../components/feed/SavedSearches.jsx';
import FeedTabs from '../components/feed/FeedTabs.jsx';
import JobFeedCard from '../components/feed/JobFeedCard.jsx';
import ProfileCard from '../components/sidebar/ProfileCard.jsx';
import ReachMoreClients from '../components/sidebar/ReachMoreClients.jsx';
import SidebarLinks from '../components/sidebar/SidebarLinks.jsx';
import * as jobsApi from '../api/jobs.js';
import { getErrorMessage } from '../api/client.js';

const INTRO = {
  'Best matches': "Browse jobs that match your experience to a client's hiring preferences. Ordered by most relevant.",
  'Most recent': 'The newest jobs posted on MiniWork, ordered by date.',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Best matches');
  const [dismissed, setDismissed] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = { status: 'OPEN' };
    if (search.trim()) params.search = search.trim();
    jobsApi.listJobs(params).then(setJobs).catch((err) => setError(getErrorMessage(err)));
  }, [search]);

  const hasFeed = tab === 'Best matches' || tab === 'Most recent';
  const visible = jobs.filter((job) => !dismissed.includes(job.id));

  return (
    <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="min-w-0">
        <SearchBar value={search} onChange={setSearch} />
        <SavedSearches onSelect={setSearch} />
        <FeedTabs active={tab} onSelect={setTab} onToggleFilters={() => {}} />
        <p className="mb-1 mt-4.5 text-muted">{INTRO[tab] ?? 'Nothing here yet — check back soon.'}</p>

        {error && <p className="text-sm text-danger">{error}</p>}
        {!hasFeed || visible.length === 0 ? (
          <p className="py-6 text-muted">No jobs to show right now.</p>
        ) : (
          visible.map((job) => (
            <JobFeedCard
              key={job.id}
              job={job}
              onDismiss={(id) => setDismissed((prev) => [...prev, id])}
            />
          ))
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
