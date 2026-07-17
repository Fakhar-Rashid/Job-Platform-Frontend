import { Pencil } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Pill from '../ui/Pill';
import { DURATION_LABEL, SCOPE_LABEL, experienceLabel } from '../../utils/format';
import type { ReactNode } from 'react';
import type { JobDraft } from './PostJobWizard';

interface ReviewPostProps {
  draft: JobDraft;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string;
}

function Row({
  label,
  step,
  onEdit,
  children,
}: {
  label: string;
  step: number;
  onEdit: (step: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-hair p-5 first:border-t-0">
      <div className="min-w-0 flex-1">{children}</div>
      <button
        type="button"
        onClick={() => onEdit(step)}
        aria-label={`Edit ${label}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line"
      >
        <Pencil size={15} />
      </button>
    </div>
  );
}

export default function ReviewPost({ draft, onEdit, onSubmit, submitting, error }: ReviewPostProps) {
  const scopeLine = [
    draft.scopeSize && SCOPE_LABEL[draft.scopeSize],
    draft.duration && DURATION_LABEL[draft.duration],
    experienceLabel(draft.experienceLevel),
    draft.contractToHire ? 'Open to contract-to-hire' : 'Not planning to hire full time',
  ]
    .filter(Boolean)
    .join(', ');
  const budgetLine =
    draft.jobType === 'HOURLY'
      ? `$${Number(draft.hourlyRateMin).toFixed(2)}/hr - $${Number(draft.hourlyRateMax).toFixed(2)}/hr`
      : `$${Number(draft.budget).toFixed(2)}`;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">Job details</p>
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Posting…' : 'Next: Finalize job post'}
        </Button>
      </div>
      <Card className="mt-6 p-0">
        <Row label="title" step={1} onEdit={onEdit}>
          <h2 className="text-2xl">{draft.title}</h2>
        </Row>
        <Row label="description" step={5} onEdit={onEdit}>
          <p className="whitespace-pre-wrap text-muted">{draft.description}</p>
        </Row>
        <Row label="category" step={1} onEdit={onEdit}>
          <p className="text-sm font-medium">Category</p>
          <p className="mt-1 text-muted">{draft.category}</p>
        </Row>
        <Row label="skills" step={2} onEdit={onEdit}>
          <p className="text-sm font-medium">Skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {draft.skills.map((skill) => (
              <Pill key={skill}>{skill}</Pill>
            ))}
          </div>
        </Row>
        <Row label="scope" step={3} onEdit={onEdit}>
          <p className="text-sm font-medium">Scope</p>
          <p className="mt-1 text-muted">{scopeLine}</p>
        </Row>
        <Row label="budget" step={4} onEdit={onEdit}>
          <p className="text-sm font-medium">Budget</p>
          <p className="mt-1 text-muted">{budgetLine}</p>
        </Row>
      </Card>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
