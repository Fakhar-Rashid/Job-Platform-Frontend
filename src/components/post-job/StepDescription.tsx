import type { StepProps } from './PostJobWizard';

const MAX_LENGTH = 50000;

const LOOKING_FOR = [
  'Clear expectations about your task or deliverables',
  'The skills required for your work',
  'Good communication',
  'Details about how you or your team like to work',
];

export default function StepDescription({ draft, update }: StepProps) {
  const remaining = MAX_LENGTH - draft.description.length;

  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <div className="md:w-2/5">
        <p className="text-sm text-muted">
          <span className="mr-3">5/5</span>Job post
        </p>
        <h2 className="mt-4 text-3xl font-semibold">Start the conversation.</h2>
        <p className="mt-4 font-medium">Talent are looking for:</p>
        <ul className="mt-2 list-disc pl-5 text-muted">
          {LOOKING_FOR.map((item) => (
            <li key={item} className="mt-1">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Describe what you need
          <textarea
            rows={10}
            maxLength={MAX_LENGTH}
            value={draft.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Already have a description? Paste it here!"
          />
        </label>
        <p className="text-xs text-muted">{remaining} characters left</p>
      </div>
    </div>
  );
}
