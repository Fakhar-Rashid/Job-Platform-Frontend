import { Minus, Plus } from 'lucide-react';
import Card from '../ui/Card';
import { useJobBoosts } from '../../hooks/queries/useBids';
import { timeAgo } from '../../utils/format';

const RANKS = ['1st place', '2nd place', '3rd place', '4th place'];

interface BoostSectionProps {
  jobId: string;
  baseCost: number;
  boost: number;
  onChange: (value: number) => void;
}

export default function BoostSection({ jobId, baseCost, boost, onChange }: BoostSectionProps) {
  const { data: boosts = [] } = useJobBoosts(jobId);
  const top = boosts.slice(0, 4);

  return (
    <Card>
      <h3 className="mb-1.5">Boost your proposal</h3>
      <p className="text-sm text-muted">Bid with Connects to be shown earlier on the client's list.</p>

      {top.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No boosted proposals yet — be the first.</p>
      ) : (
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-hair text-left text-muted">
              <th className="py-1.5 font-medium">Rank</th>
              <th className="py-1.5 font-medium">Bid</th>
            </tr>
          </thead>
          <tbody>
            {top.map((entry, index) => (
              <tr key={index} className="border-b border-hair">
                <td className="py-1.5">{RANKS[index]}</td>
                <td className="py-1.5">
                  {entry.boostConnects} Connects <span className="text-muted">{timeAgo(entry.createdAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-medium">Your bid</span>
        <button
          type="button"
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line text-muted hover:border-ink hover:text-ink"
          onClick={() => onChange(Math.max(0, boost - 1))}
        >
          <Minus size={14} />
        </button>
        <span className="min-w-6 text-center font-semibold">{boost}</span>
        <button
          type="button"
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line text-muted hover:border-ink hover:text-ink"
          onClick={() => onChange(boost + 1)}
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1 text-sm">
        <div>Bid to boost: {boost} Connects</div>
        <div>Required for proposal: {baseCost} Connects</div>
        <div className="font-semibold">Total: {baseCost + boost} Connects</div>
      </div>
    </Card>
  );
}
