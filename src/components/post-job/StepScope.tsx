import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { DURATION_LABEL, experienceLabel } from '../../utils/format';
import type { ExperienceLevel, JobDuration, ScopeSize } from '../../types';
import type { StepProps } from './PostJobWizard';

const SCOPES: { value: ScopeSize; label: string; hint: string }[] = [
  { value: 'LARGE', label: 'Large', hint: 'Longer term or complex initiatives (ex. design and build a full website)' },
  { value: 'MEDIUM', label: 'Medium', hint: 'Well-defined projects (ex. a landing page)' },
  { value: 'SMALL', label: 'Small', hint: 'Quick and straightforward tasks (ex. update text and images on a webpage)' },
];

const DURATIONS: JobDuration[] = ['MORE_THAN_6_MONTHS', 'THREE_TO_SIX_MONTHS', 'ONE_TO_THREE_MONTHS'];
const LEVELS: ExperienceLevel[] = ['ENTRY', 'INTERMEDIATE', 'EXPERT'];

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line"
    >
      <Pencil size={15} />
    </button>
  );
}

export default function StepScope({ draft, update }: StepProps) {
  const [editingLevel, setEditingLevel] = useState(false);
  const [editingHire, setEditingHire] = useState(false);

  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <div className="md:w-2/5">
        <p className="text-sm text-muted">
          <span className="mr-3">3/5</span>Job post
        </p>
        <h2 className="mt-4 text-3xl font-semibold">Next, estimate the scope of your work.</h2>
        <p className="mt-4 text-muted">
          Consider the size of your project and the time it will take.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-3">
          {SCOPES.map((scope) => (
            <label key={scope.value} className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="scope-size"
                className="mt-1 accent-brand"
                checked={draft.scopeSize === scope.value}
                onChange={() => update({ scopeSize: scope.value })}
              />
              <span>
                <span className="block font-semibold">{scope.label}</span>
                <span className="block text-sm text-muted">{scope.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <div>
          <p className="font-medium">How long will your work take?</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {DURATIONS.map((duration) => (
              <label key={duration} className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="radio"
                  name="job-duration"
                  className="accent-brand"
                  checked={draft.duration === duration}
                  onChange={() => update({ duration })}
                />
                {DURATION_LABEL[duration]}
              </label>
            ))}
          </div>
        </div>
        <div className="border-t border-hair pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">{experienceLabel(draft.experienceLevel)}</span>
            <EditButton label="Edit experience level" onClick={() => setEditingLevel(!editingLevel)} />
          </div>
          {editingLevel && (
            <div className="mt-3 flex flex-col gap-2.5">
              {LEVELS.map((level) => (
                <label key={level} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="experience-level"
                    className="accent-brand"
                    checked={draft.experienceLevel === level}
                    onChange={() => update({ experienceLevel: level })}
                  />
                  {experienceLabel(level)}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-hair pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium">
              {draft.contractToHire ? 'Open to contract-to-hire' : 'Not planning to hire full time'}
            </span>
            <EditButton label="Edit contract-to-hire" onClick={() => setEditingHire(!editingHire)} />
          </div>
          {editingHire && (
            <div className="mt-3 flex flex-col gap-2.5">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="radio"
                  name="contract-to-hire"
                  className="accent-brand"
                  checked={draft.contractToHire}
                  onChange={() => update({ contractToHire: true })}
                />
                Yes, open to contract-to-hire
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="radio"
                  name="contract-to-hire"
                  className="accent-brand"
                  checked={!draft.contractToHire}
                  onChange={() => update({ contractToHire: false })}
                />
                No, not at this time
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
