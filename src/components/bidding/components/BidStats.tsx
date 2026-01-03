import { Clock, Users, TrendingUp } from 'lucide-react';
import { BiddingItem } from '../../../data/gameData';
import { getTimeRemaining } from '../utils/dateFormatters';

interface Props {
  item: BiddingItem;
}

export function BidStats({ item }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      <Stat icon={<Clock />} label="Time Left" value={getTimeRemaining(item.endDate)} />
      <Stat icon={<Users />} label="Bidders" value={item.bidders} />
      <Stat
        icon={<TrendingUp />}
        label="Current Bid"
        value={`$${item.currentBid || item.startingBid}`}
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 p-3 rounded-lg">
      <div className="text-purple-400">{icon}</div>
      <div>
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-sm text-white">{value}</div>
      </div>
    </div>
  );
}
