import { Card } from '../ui/card';
import { BiddingItem } from '../../data/gameData';

interface Props {
  item: BiddingItem;
  onSelect: (item: BiddingItem) => void;
}

export function BidCard({ item, onSelect }: Props) {
  return (
    <Card
      className="group overflow-hidden hover:shadow-2xl hover:shadow-red-500/70 transition-all cursor-pointer bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50"
      onClick={() => onSelect(item)}
    >
      {/* Put all your existing JSX for renderBidCard here unchanged */}
      {/* ... */}
    </Card>
  );
}
