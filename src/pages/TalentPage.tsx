import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Card from '../components/ui/Card';
import Pill from '../components/ui/Pill';
import { useTalent } from '../hooks/queries/useTalent';
import { getErrorMessage } from '../api/client';
import { avatarFor } from '../utils/avatar';
import type { TalentUser } from '../types';

export default function TalentPage() {
  const { data: talent = [], error, isLoading } = useTalent();

  return (
    <>
      <div>
        <h1>Find talent</h1>
        <p className="text-muted">Browse freelancers and view their full profiles.</p>
      </div>
      {isLoading ? (
        <p className="text-muted">Loading…</p>
      ) : error ? (
        <p className="text-sm text-danger">{getErrorMessage(error)}</p>
      ) : talent.length === 0 ? (
        <p className="text-muted">No freelancers to show yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {talent.map((t: TalentUser) => (
            <Card key={t.id}>
              <Link to={`/users/${t.id}`} className="block hover:no-underline">
                <div className="flex items-start gap-3">
                  <img
                    src={avatarFor(t, 104)}
                    alt={t.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{t.name}</p>
                    {t.title && <p className="truncate text-sm text-muted">{t.title}</p>}
                  </div>
                  {t.hourlyRate != null && (
                    <span className="font-bold">${t.hourlyRate.toFixed(2)}/hr</span>
                  )}
                </div>
                {t.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {t.skills.slice(0, 6).map((skill) => (
                      <Pill key={skill}>{skill}</Pill>
                    ))}
                    {t.skills.length > 6 && <Pill>+{t.skills.length - 6}</Pill>}
                  </div>
                )}
                {t.country && (
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                    <MapPin size={14} /> {t.country}
                  </p>
                )}
              </Link>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
