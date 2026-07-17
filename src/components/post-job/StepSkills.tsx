import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Pill from '../ui/Pill';
import { DEFAULT_SKILLS, POPULAR_SKILLS } from './config';
import type { StepProps } from './PostJobWizard';

const MAX_SKILLS = 10;

export default function StepSkills({ draft, update }: StepProps) {
  const [value, setValue] = useState('');
  const popular = ((draft.category && POPULAR_SKILLS[draft.category]) || DEFAULT_SKILLS).filter(
    (skill) => !draft.skills.includes(skill),
  );

  function add(skill: string) {
    const next = skill.trim();
    if (!next || draft.skills.includes(next) || draft.skills.length >= MAX_SKILLS) return;
    update({ skills: [...draft.skills, next] });
  }

  function remove(skill: string) {
    update({ skills: draft.skills.filter((s) => s !== skill) });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      add(value);
      setValue('');
    }
  }

  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <div className="md:w-2/5">
        <p className="text-sm text-muted">
          <span className="mr-3">2/5</span>Job post
        </p>
        <h2 className="mt-4 text-3xl font-semibold">
          What are the main skills required for your work?
        </h2>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Search skills or add your own
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill and press Enter"
            />
          </label>
          <p className="mt-2 text-sm text-muted">For the best results, add 3-5 skills</p>
        </div>
        {draft.skills.length > 0 && (
          <div>
            <p className="text-sm font-medium">Selected skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {draft.skills.map((skill) => (
                <Pill key={skill}>
                  {skill}
                  <button
                    type="button"
                    className="inline-flex cursor-pointer border-none bg-transparent pl-1 text-inherit"
                    onClick={() => remove(skill)}
                    aria-label={`Remove ${skill}`}
                  >
                    <X size={13} />
                  </button>
                </Pill>
              ))}
            </div>
          </div>
        )}
        {popular.length > 0 && (
          <div>
            <p className="text-sm font-medium">Popular skills for {draft.category ?? 'your job'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {popular.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => add(skill)}
                  disabled={draft.skills.length >= MAX_SKILLS}
                  className="inline-flex items-center gap-1 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {skill}
                  <Plus size={13} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
