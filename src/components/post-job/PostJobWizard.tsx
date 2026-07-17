import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import StepStart from './StepStart';
import StepTitle from './StepTitle';
import StepSkills from './StepSkills';
import StepScope from './StepScope';
import StepBudget from './StepBudget';
import StepDescription from './StepDescription';
import ReviewPost from './ReviewPost';
import { useCreateJob } from '../../hooks/queries/useJobs';
import { getErrorMessage } from '../../api/client';
import type { CreateJobPayload } from '../../api/jobs';
import type { ExperienceLevel, JobDuration, JobType, ProjectTerm, ScopeSize } from '../../types';

export interface JobDraft {
  projectTerm?: ProjectTerm;
  title: string;
  category?: string;
  skills: string[];
  scopeSize?: ScopeSize;
  duration?: JobDuration;
  experienceLevel: ExperienceLevel;
  contractToHire: boolean;
  jobType: JobType;
  budget: string;
  hourlyRateMin: string;
  hourlyRateMax: string;
  description: string;
}

export interface StepProps {
  draft: JobDraft;
  update: (patch: Partial<JobDraft>) => void;
}

const STORAGE_KEY = 'mw_post_job_draft';
const LAST_STEP = 6;
const NEXT_LABEL = ['', 'Skills', 'Scope', 'Budget', 'Description', 'Review Job Post'];

const EMPTY_DRAFT: JobDraft = {
  title: '',
  skills: [],
  experienceLevel: 'INTERMEDIATE',
  contractToHire: false,
  jobType: 'HOURLY',
  budget: '',
  hourlyRateMin: '',
  hourlyRateMax: '',
  description: '',
};

function restore(): { draft: JobDraft; step: number } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as { draft?: Partial<JobDraft>; step?: number };
      return {
        draft: { ...EMPTY_DRAFT, ...saved.draft },
        step: Math.min(Math.max(saved.step ?? 0, 0), LAST_STEP),
      };
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }
  return { draft: EMPTY_DRAFT, step: 0 };
}

function isStepValid(step: number, d: JobDraft): boolean {
  switch (step) {
    case 0:
      return d.projectTerm != null;
    case 1:
      return d.title.trim().length >= 4 && Boolean(d.category);
    case 2:
      return d.skills.length >= 1;
    case 3:
      return Boolean(d.scopeSize && d.duration);
    case 4: {
      if (d.jobType === 'HOURLY') {
        const min = Number(d.hourlyRateMin);
        const max = Number(d.hourlyRateMax);
        return min > 0 && max > 0 && min <= max;
      }
      return Number(d.budget) > 0;
    }
    case 5:
      return d.description.trim().length >= 10;
    default:
      return true;
  }
}

export default function PostJobWizard() {
  const navigate = useNavigate();
  const createJob = useCreateJob();
  const [{ draft, step }, setState] = useState(restore);
  const [error, setError] = useState('');

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, step }));
  }, [draft, step]);

  function update(patch: Partial<JobDraft>) {
    setState((s) => ({ ...s, draft: { ...s.draft, ...patch } }));
  }

  function goTo(next: number) {
    setState((s) => ({ ...s, step: next }));
    window.scrollTo({ top: 0 });
  }

  function cancel() {
    sessionStorage.removeItem(STORAGE_KEY);
    navigate('/');
  }

  async function submit() {
    setError('');
    const payload: CreateJobPayload = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      jobType: draft.jobType,
      experienceLevel: draft.experienceLevel,
      contractToHire: draft.contractToHire,
      skills: draft.skills,
      category: draft.category,
      projectTerm: draft.projectTerm,
      scopeSize: draft.scopeSize,
      duration: draft.duration,
    };
    if (draft.jobType === 'HOURLY') {
      payload.hourlyRateMin = Number(draft.hourlyRateMin);
      payload.hourlyRateMax = Number(draft.hourlyRateMax);
    } else {
      payload.budget = Number(draft.budget);
    }
    try {
      const job = await createJob.mutateAsync(payload);
      sessionStorage.removeItem(STORAGE_KEY);
      navigate(`/jobs/${job.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col">
      <div className="flex-1">
        {step === 0 && <StepStart draft={draft} update={update} onContinue={() => goTo(1)} />}
        {step === 1 && <StepTitle draft={draft} update={update} />}
        {step === 2 && <StepSkills draft={draft} update={update} />}
        {step === 3 && <StepScope draft={draft} update={update} />}
        {step === 4 && <StepBudget draft={draft} update={update} />}
        {step === 5 && <StepDescription draft={draft} update={update} />}
        {step === 6 && (
          <ReviewPost
            draft={draft}
            onEdit={goTo}
            onSubmit={submit}
            submitting={createJob.isPending}
            error={error}
          />
        )}
      </div>
      <div className="mt-10">
        <div className="h-1 w-full bg-hair">
          <div className="h-full bg-ink transition-all" style={{ width: `${(step / LAST_STEP) * 100}%` }} />
        </div>
        <div className="flex items-center justify-between border-t border-hair pt-4">
          {step === 0 ? (
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" onClick={() => goTo(step - 1)}>
              Back
            </Button>
          )}
          {step >= 1 && step <= 5 && (
            <Button onClick={() => goTo(step + 1)} disabled={!isStepValid(step, draft)}>
              Next: {NEXT_LABEL[step]}
            </Button>
          )}
          {step === LAST_STEP && (
            <Button onClick={submit} disabled={createJob.isPending}>
              {createJob.isPending ? 'Posting…' : 'Next: Finalize job post'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
