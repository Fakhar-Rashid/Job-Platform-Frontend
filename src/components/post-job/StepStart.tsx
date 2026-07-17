import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button';
import { useMyJobs } from '../../hooks/queries/useJobs';
import type { Job, ProjectTerm } from '../../types';
import type { StepProps } from './PostJobWizard';

interface StepStartProps extends StepProps {
  onContinue: () => void;
}

interface TermOption {
  value: ProjectTerm;
  label: string;
  hint: string;
}

const TERM_OPTIONS: TermOption[] = [
  { value: 'LONG_TERM', label: 'Long term project', hint: 'More than thirty hours a week and/or longer than three months' },
  { value: 'SHORT_TERM', label: 'Short term project', hint: 'Less than thirty hours a week and/or shorter than three months' },
];

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-ink' : 'border-line'}`}>
      {selected && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
    </span>
  );
}

export default function StepStart({ draft, update, onContinue }: StepStartProps) {
  const [open, setOpen] = useState<'new' | 'rework'>('new');
  const [reworkId, setReworkId] = useState('');
  const { data: jobs } = useMyJobs();

  function pickTerm(term: ProjectTerm) {
    setReworkId('');
    update({ projectTerm: term });
  }

  function pickRework(job: Job) {
    setReworkId(job.id);
    update({
      projectTerm: job.projectTerm ?? 'SHORT_TERM',
      title: job.title,
      category: job.category ?? undefined,
      skills: job.skills,
      scopeSize: job.scopeSize ?? undefined,
      duration: job.duration ?? undefined,
      experienceLevel: job.experienceLevel,
      contractToHire: job.contractToHire,
      jobType: job.jobType,
      budget: job.budget != null ? String(job.budget) : '',
      hourlyRateMin: job.hourlyRateMin != null ? String(job.hourlyRateMin) : '',
      hourlyRateMax: job.hourlyRateMax != null ? String(job.hourlyRateMax) : '',
    });
  }

  return (
    <div className="flex flex-col gap-10 md:flex-row md:items-center">
      <div className="md:w-2/5">
        <h2 className="text-3xl font-semibold">How can we help you get started?</h2>
      </div>
      <div className="flex-1">
        <div className="rounded-xl border border-hair">
          <div className="border-b border-hair p-5">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left font-semibold"
              onClick={() => setOpen('new')}
            >
              I want to create a new job post
              {open === 'new' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {open === 'new' && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {TERM_OPTIONS.map((option) => {
                  const selected = !reworkId && draft.projectTerm === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => pickTerm(option.value)}
                      className={`rounded-xl border p-4 text-left transition-colors hover:border-ink ${selected ? 'border-ink' : 'border-line'}`}
                    >
                      <RadioDot selected={selected} />
                      <span className="mt-3 block font-semibold">{option.label}</span>
                      <span className="mt-1 block text-sm text-muted">{option.hint}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="p-5">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left font-semibold"
              onClick={() => setOpen('rework')}
            >
              I want to rework a previous job post
              {open === 'rework' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {open === 'rework' && (
              <div className="mt-4">
                {jobs && jobs.length > 0 ? (
                  jobs.map((job) => (
                    <label
                      key={job.id}
                      className="flex cursor-pointer items-center gap-3 border-t border-hair py-3"
                    >
                      <input
                        type="radio"
                        name="rework-job"
                        className="accent-brand"
                        checked={reworkId === job.id}
                        onChange={() => pickRework(job)}
                      />
                      <span>
                        <span className="block font-medium">{job.title}</span>
                        <span className="block text-sm text-muted">
                          Created {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-muted">You haven't posted any jobs yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onContinue} disabled={!draft.projectTerm}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
