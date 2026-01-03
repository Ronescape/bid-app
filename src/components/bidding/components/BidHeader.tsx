import { X } from 'lucide-react';
import { Button } from '../../ui/button';
import { BiddingItem } from '../../../data/gameData';

interface Props {
  item: BiddingItem;
  onClose: () => void;
}

export function BidHeader({ item, onClose }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/50 p-4">
      <h2 className="text-white text-lg truncate">{item.title}</h2>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
}
