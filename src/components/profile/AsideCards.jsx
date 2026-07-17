import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import CoreSection from './CoreSection.jsx';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import * as connectsApi from '../../api/connects.js';
import { HOURS_LABEL } from '../../utils/format.js';

const HOURS_OPTIONS = Object.entries(HOURS_LABEL);

export function StatsCard({ profile }) {
  return (
    <Card className="flex gap-9">
      <div><b className="text-xl">${profile.stats.totalEarnings}</b><div className="text-muted">Total earnings</div></div>
      <div><b className="text-xl">{profile.stats.totalJobs}</b><div className="text-muted">Total jobs</div></div>
    </Card>
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
      <div className="flex items-center justify-between gap-3 border-t border-hair py-[9px]"><span>Availability badge</span><span className="text-muted">{profile.availabilityBadge ? 'On' : 'Off'}</span></div>
      <div className="flex items-center justify-between gap-3 border-t border-hair py-[9px]"><span>Boost your profile</span><span className="text-muted">{profile.boostProfile ? 'On' : 'Off'}</span></div>
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
        <div className="flex items-center justify-between gap-3 border-t border-hair py-[9px]" key={label}>
          <span>{label}</span>
          {on ? <span className="inline-flex items-center gap-1 text-[13px] text-verified"><BadgeCheck size={15} /> Verified</span> : <span className="text-muted">—</span>}
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
      {profile.openToContractToHire && <p className="text-muted">Open to contract to hire</p>}
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
        : <p className="text-muted">Add a video introduction</p>}
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
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3"><h3>Connects: {profile.connectBalance}</h3></div>
      <Button variant="outline" className="w-full" onClick={buy} disabled={busy}>
        {busy ? 'Adding…' : 'Buy Connects'}
      </Button>
    </Card>
  );
}
