import { Button } from '../../ui/button';
import { BiddingItem } from '../../../data/gameData';
import { getQuickBids } from '../utils/bidCalculations';

interface Props {
  item: BiddingItem;
  minBid: number;
  canBid: boolean;
  isPlacingBid: boolean;
  onQuickBid: (value: string) => void;
  onPlaceBid: () => void;
  onClose: () => void;
}

export function BidFooter({
  item,
  minBid,
  canBid,
  isPlacingBid,
  onQuickBid,
  onPlaceBid,
  onClose,
}: Props) {
  if (item.status !== 'live') {
    return (
      <div className="p-4">
        <Button className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 border-t border-slate-700/50">
      <div className="grid grid-cols-3 gap-2">
        {getQuickBids(minBid).map((bid) => (
          <Button
            key={bid}
            variant="outline"
            onClick={() => onQuickBid(String(bid))}
            disabled={!canBid}
          >
            ${bid}
          </Button>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={onPlaceBid}
        disabled={!canBid || isPlacingBid}
      >
        {isPlacingBid ? 'Placing Bid…' : 'Place Bid'}
      </Button>
    </div>
  );
}
