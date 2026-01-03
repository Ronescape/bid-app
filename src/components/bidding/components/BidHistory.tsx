import { BiddingItem } from '../../../data/gameData';
import { formatTime } from '../utils/dateFormatters';

interface Props {
  item: BiddingItem;
}

export function BidHistory({ item }: Props) {
  if (!item.bids || item.bids.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">
        No bids yet. Be the first to bid!
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4 max-h-40 overflow-y-auto">
      {item.bids.map((bid, index) => (
        <div
          key={index}
          className="flex justify-between bg-slate-800/50 p-3 rounded-lg"
        >
          <div>
            <div className="text-sm text-white">
              {bid.bidder || 'Anonymous'}
            </div>
            <div className="text-xs text-slate-400">
              {formatTime(bid.time)}
            </div>
          </div>
          <div className="text-purple-400">${bid.amount}</div>
        </div>
      ))}
    </div>
  );
}
