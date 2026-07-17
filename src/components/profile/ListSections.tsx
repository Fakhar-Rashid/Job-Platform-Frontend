import EditableList from './EditableList';
import { PROFICIENCY_LABEL, monthLabel } from '../../utils/format';
import type { Profile } from '../../types';

interface SectionProps {
  profile: Profile;
  editable: boolean;
}

const PROFICIENCY_OPTIONS = Object.entries(PROFICIENCY_LABEL) as [string, string][];

export function LanguagesSection({ profile, editable }: SectionProps) {
  return (
    <EditableList
      title="Languages"
      path="languages"
      items={profile.languages}
      editable={editable}
      emptyText="No languages added yet."
      fields={[
        { name: 'name', label: 'Language' },
        { name: 'proficiency', label: 'Proficiency', type: 'select', options: PROFICIENCY_OPTIONS },
      ]}
      renderItem={(l) => (
        <span>
          <b>{l.name}:</b> {PROFICIENCY_LABEL[l.proficiency as keyof typeof PROFICIENCY_LABEL]}
        </span>
      )}
    />
  );
}

export function EducationSection({ profile, editable }: SectionProps) {
  return (
    <EditableList
      title="Education"
      path="educations"
      items={profile.educations}
      editable={editable}
      emptyText="No education added yet."
      fields={[
        { name: 'school', label: 'School' },
        { name: 'degree', label: 'Degree' },
        { name: 'fieldOfStudy', label: 'Field of study' },
        { name: 'startYear', label: 'Start year', type: 'number' },
        { name: 'endYear', label: 'End year', type: 'number' },
      ]}
      renderItem={(e) => (
        <div>
          <b>{e.school}</b>
          <div className="text-muted">{[e.degree, e.fieldOfStudy].filter(Boolean).join(', ')}</div>
          {(e.startYear || e.endYear) && (
            <div className="text-muted">
              {e.startYear}–{e.endYear}
            </div>
          )}
        </div>
      )}
    />
  );
}

export function EmploymentSection({ profile, editable }: SectionProps) {
  return (
    <EditableList
      title="Employment history"
      path="employments"
      items={profile.employments}
      editable={editable}
      emptyText="No employment history yet."
      fields={[
        { name: 'company', label: 'Company' },
        { name: 'title', label: 'Job title' },
        { name: 'startDate', label: 'Start', type: 'month' },
        { name: 'endDate', label: 'End', type: 'month' },
        { name: 'current', label: 'I currently work here', type: 'checkbox' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
      renderItem={(e) => (
        <div>
          <b>{e.title}</b> · {e.company}
          <div className="text-muted">
            {monthLabel(e.startDate)} – {e.current ? 'Present' : monthLabel(e.endDate)}
          </div>
          {e.description && <p className="mt-1 text-[13px]">{e.description}</p>}
        </div>
      )}
    />
  );
}

export function PortfolioListSection({ profile, editable }: SectionProps) {
  return (
    <EditableList
      title="Portfolio"
      path="portfolio"
      items={profile.portfolioItems}
      editable={editable}
      emptyText="No portfolio projects yet."
      fields={[
        { name: 'title', label: 'Project title' },
        { name: 'category', label: 'Category' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'imageUrl', label: 'Image URL' },
        { name: 'projectUrl', label: 'Project URL' },
      ]}
      renderItem={(p) => (
        <div className="flex gap-3">
          {p.imageUrl && (
            <img src={p.imageUrl} alt="" className="h-20 w-[120px] shrink-0 rounded-lg object-cover" />
          )}
          <div>
            <b>{p.title}</b>
            {p.category && <div className="text-muted">{p.category}</div>}
            {p.description && <p className="mt-1 text-[13px]">{p.description}</p>}
          </div>
        </div>
      )}
    />
  );
}

export function CertificationsSection({ profile, editable }: SectionProps) {
  return (
    <EditableList
      title="Certifications"
      path="certifications"
      items={profile.certifications}
      editable={editable}
      emptyText="Listing your certifications can help prove your knowledge."
      fields={[
        { name: 'name', label: 'Certification' },
        { name: 'issuer', label: 'Issuer' },
        { name: 'year', label: 'Year', type: 'number' },
      ]}
      renderItem={(c) => (
        <div>
          <b>{c.name}</b>
          <div className="text-muted">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
        </div>
      )}
    />
  );
}

export function LicensesSection({ profile, editable }: SectionProps) {
  return (
    <EditableList
      title="Licenses"
      path="licenses"
      items={profile.licenses}
      editable={editable}
      emptyText="No licenses added yet."
      fields={[
        { name: 'name', label: 'License' },
        { name: 'issuer', label: 'Issuer' },
        { name: 'year', label: 'Year', type: 'number' },
      ]}
      renderItem={(c) => (
        <div>
          <b>{c.name}</b>
          <div className="text-muted">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
        </div>
      )}
    />
  );
}

export function LinkedAccountsSection({ profile, editable }: SectionProps) {
  return (
    <EditableList
      title="Linked accounts"
      path="linked-accounts"
      items={profile.linkedAccounts}
      editable={editable}
      emptyText="No linked accounts yet."
      fields={[
        { name: 'provider', label: 'Provider' },
        { name: 'username', label: 'Username' },
        { name: 'url', label: 'Profile URL' },
      ]}
      renderItem={(a) => (
        <div>
          <b>{a.provider}</b>
          <div className="text-muted">
            {a.url ? (
              <a href={a.url} target="_blank" rel="noreferrer">
                {a.username}
              </a>
            ) : (
              a.username
            )}
          </div>
        </div>
      )}
    />
  );
}

export function OtherExperiencesSection({ profile, editable }: SectionProps) {
  return (
    <EditableList
      title="Other experiences"
      path="other-experiences"
      items={profile.otherExperiences}
      editable={editable}
      emptyText="Add other experiences to stand out."
      fields={[
        { name: 'subject', label: 'Subject' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
      renderItem={(o) => (
        <div>
          <b>{o.subject}</b>
          {o.description && <p className="mt-1 text-[13px]">{o.description}</p>}
        </div>
      )}
    />
  );
}
