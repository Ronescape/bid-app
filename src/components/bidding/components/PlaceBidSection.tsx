import { Input } from '../../ui/input';
import { BiddingItem } from '../../../data/gameData';

interface Props {
  item: BiddingItem;
  bidAmount: string;
  minBid: number;
  canBid: boolean;
  onChange: (value: string) => void;
}

export function PlaceBidSection({
  item,
  bidAmount,
  minBid,
  canBid,
  onChange,
}: Props) {
  if (item.status !== 'live') return null;

  return (
    <div className="p-4 space-y-3 bg-slate-800/50 rounded-lg">
      <div className="text-white">Place Your Bid</div>

      <Input
        type="number"
        value={bidAmount}
        min={minBid}
        step="10"
        placeholder={`Min $${minBid}`}
        onChange={(e) => onChange(e.target.value)}
      />

      {!canBid && (
        <p className="text-sm text-red-400">
          Insufficient points to place a bid.
        </p>
      )}
    </div>
  );
}
