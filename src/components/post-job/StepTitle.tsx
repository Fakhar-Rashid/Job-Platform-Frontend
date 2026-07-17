import { useState } from 'react';
import { JOB_CATEGORIES } from './config';
import type { StepProps } from './PostJobWizard';

const EXAMPLE_TITLES = [
  'Build responsive WordPress site with booking/payment functionality',
  'Graphic designer needed to design ad creative for multiple campaigns',
  'Facebook ad specialist needed for product launches',
];

export default function StepTitle({ draft, update }: StepProps) {
  const [showAll, setShowAll] = useState(
    () => Boolean(draft.category && !JOB_CATEGORIES.slice(0, 3).includes(draft.category)),
  );
  const categories = showAll ? JOB_CATEGORIES : JOB_CATEGORIES.slice(0, 3);
  const showCategories = draft.title.trim().length >= 4;

  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <div className="md:w-2/5">
        <p className="text-sm text-muted">
          <span className="mr-3">1/5</span>Job post
        </p>
        <h2 className="mt-4 text-3xl font-semibold">Let's start with a strong title.</h2>
        <p className="mt-4 text-muted">
          This helps your job post stand out to the right candidates. It's the first thing they'll
          see, so make it count!
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Write a title for your job post
          <input
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="e.g. Build a responsive website for my business"
          />
        </label>
        <div>
          <p className="text-sm font-medium">Example titles</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted">
            {EXAMPLE_TITLES.map((title) => (
              <li key={title} className="mt-1">
                {title}
              </li>
            ))}
          </ul>
        </div>
        {showCategories && (
          <div>
            <p className="text-sm font-medium">Job category</p>
            <div className="mt-2 flex flex-col gap-2.5">
              {categories.map((category) => (
                <label key={category} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="radio"
                    name="job-category"
                    className="accent-brand"
                    checked={draft.category === category}
                    onChange={() => update({ category })}
                  />
                  {category}
                </label>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-brand hover:underline"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'See fewer categories' : 'See all categories'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
