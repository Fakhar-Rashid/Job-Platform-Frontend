import { Clock, Tag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StepProps } from './PostJobWizard';

function TypeCard({
  icon: Icon,
  label,
  selected,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative rounded-xl border p-5 text-left transition-colors hover:border-ink ${selected ? 'border-ink' : 'border-line'}`}
    >
      <span
        className={`absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full border ${selected ? 'border-ink' : 'border-line'}`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
      </span>
      <Icon size={22} />
      <span className="mt-3 block font-semibold">{label}</span>
    </button>
  );
}

export default function StepBudget({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <div className="md:w-2/5">
        <p className="text-sm text-muted">
          <span className="mr-3">4/5</span>Job post
        </p>
        <h2 className="mt-4 text-3xl font-semibold">Tell us about your budget.</h2>
        <p className="mt-4 text-muted">This will help us match you to talent within your range.</p>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TypeCard
            icon={Clock}
            label="Hourly rate"
            selected={draft.jobType === 'HOURLY'}
            onSelect={() => update({ jobType: 'HOURLY' })}
          />
          <TypeCard
            icon={Tag}
            label="Fixed price"
            selected={draft.jobType === 'FIXED'}
            onSelect={() => update({ jobType: 'FIXED' })}
          />
        </div>
        {draft.jobType === 'HOURLY' ? (
          <div className="flex flex-wrap gap-6">
            <label className="flex flex-col gap-2 text-sm font-medium">
              From
              <span className="flex items-center gap-2">
                <span className="text-muted">$</span>
                <input
                  inputMode="decimal"
                  className="w-28"
                  value={draft.hourlyRateMin}
                  onChange={(e) => update({ hourlyRateMin: e.target.value })}
                />
                <span className="text-muted">/hr</span>
              </span>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              To
              <span className="flex items-center gap-2">
                <span className="text-muted">$</span>
                <input
                  inputMode="decimal"
                  className="w-28"
                  value={draft.hourlyRateMax}
                  onChange={(e) => update({ hourlyRateMax: e.target.value })}
                />
                <span className="text-muted">/hr</span>
              </span>
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted">Set a price for the project and pay at the end.</p>
            <label className="flex flex-col gap-2 text-sm font-medium">
              What is the best cost estimate for your project?
              <span className="flex items-center gap-2">
                <span className="text-muted">$</span>
                <input
                  inputMode="decimal"
                  className="w-40"
                  value={draft.budget}
                  onChange={(e) => update({ budget: e.target.value })}
                />
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
