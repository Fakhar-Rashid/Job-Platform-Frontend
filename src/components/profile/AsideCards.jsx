import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import CoreSection from './CoreSection.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import * as connectsApi from '../../api/connects.js';
import { HOURS_LABEL } from '../../utils/format.js';

const HOURS_OPTIONS = Object.entries(HOURS_LABEL);

export function StatsCard({ profile }) {
  return (
    <section className="card stats-card">
      <div><b>${profile.stats.totalEarnings}</b><div className="muted">Total earnings</div></div>
      <div><b>{profile.stats.totalJobs}</b><div className="muted">Total jobs</div></div>
    </section>
  );
}

export function PromoteCard({ profile, editable, onChanged }) {
  return (
    <CoreSection
      title="Promote with ads" editable={editable} onChanged={onChanged}
      values={{ availabilityBadge: profile.availabilityBadge, boostProfile: profile.boostProfile }}
      fields={[
        { name: 'availabilityBadge', label: 'Availability badge', type: 'checkbox' },
        { name: 'boostProfile', label: 'Boost your profile', type: 'checkbox' },
      ]}
    >
      <div className="mini-row"><span>Availability badge</span><span className="muted">{profile.availabilityBadge ? 'On' : 'Off'}</span></div>
      <div className="mini-row"><span>Boost your profile</span><span className="muted">{profile.boostProfile ? 'On' : 'Off'}</span></div>
    </CoreSection>
  );
}

export function VerificationsCard({ profile, editable, onChanged }) {
  const rows = [['ID', profile.idVerified], ['Phone number', profile.phoneVerified], ['Military veteran', profile.militaryVeteran]];
  return (
    <CoreSection
      title="Verifications" editable={editable} onChanged={onChanged}
      values={{ idVerified: profile.idVerified, phoneVerified: profile.phoneVerified, militaryVeteran: profile.militaryVeteran }}
      fields={[
        { name: 'idVerified', label: 'ID verified', type: 'checkbox' },
        { name: 'phoneVerified', label: 'Phone number verified', type: 'checkbox' },
        { name: 'militaryVeteran', label: 'Military veteran', type: 'checkbox' },
      ]}
    >
      {rows.map(([label, on]) => (
        <div className="mini-row" key={label}>
          <span>{label}</span>
          {on ? <span className="verified-text"><BadgeCheck size={15} /> Verified</span> : <span className="muted">—</span>}
        </div>
      ))}
    </CoreSection>
  );
}

export function HoursCard({ profile, editable, onChanged }) {
  return (
    <CoreSection
      title="Hours per week" editable={editable} onChanged={onChanged}
      values={{ hoursPerWeek: profile.hoursPerWeek ?? '', openToContractToHire: profile.openToContractToHire }}
      fields={[
        { name: 'hoursPerWeek', label: 'Availability', type: 'select', options: HOURS_OPTIONS },
        { name: 'openToContractToHire', label: 'Open to contract to hire', type: 'checkbox' },
      ]}
    >
      <p>{HOURS_LABEL[profile.hoursPerWeek] ?? 'Not set'}</p>
      {profile.openToContractToHire && <p className="muted">Open to contract to hire</p>}
    </CoreSection>
  );
}

export function ResponseCard({ profile, editable, onChanged }) {
  return (
    <CoreSection
      title="Avg. response" editable={editable} onChanged={onChanged}
      values={{ responseTime: profile.responseTime ?? '' }}
      fields={[{ name: 'responseTime', label: 'Average response time' }]}
    >
      <p>{profile.responseTime || 'Not set'}</p>
    </CoreSection>
  );
}

export function VideoCard({ profile, editable, onChanged }) {
  return (
    <CoreSection
      title="Video introduction" editable={editable} onChanged={onChanged}
      values={{ videoIntroUrl: profile.videoIntroUrl ?? '' }}
      fields={[{ name: 'videoIntroUrl', label: 'Video URL' }]}
    >
      {profile.videoIntroUrl
        ? <a href={profile.videoIntroUrl} target="_blank" rel="noreferrer">Watch introduction</a>
        : <p className="muted">Add a video introduction</p>}
    </CoreSection>
  );
}

export function ConnectsCard({ profile, onChanged }) {
  const { refreshUser } = useAuth();
  const [busy, setBusy] = useState(false);

  async function buy() {
    setBusy(true);
    try {
      await connectsApi.topUp();
      await refreshUser();
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <div className="section-head"><h3>Connects: {profile.connectBalance}</h3></div>
      <button className="outline" style={{ width: '100%' }} onClick={buy} disabled={busy}>
        {busy ? 'Adding…' : 'Buy Connects'}
      </button>
    </section>
  );
}
