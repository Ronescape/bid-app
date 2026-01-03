import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { BiddingItem } from "../../data/gameData";
import { useBidModal } from "./hooks/useBidModal";
import { BidHeader } from './components/BidHeader';
import { BidStats } from './components/BidStats';
import { BidHistory } from './components/BidHistory';
import { PlaceBidSection } from './components/PlaceBidSection';
import { BidFooter } from './components/BidFooter';

interface Props {
  item: BiddingItem;
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onBidPlaced: (amount: number) => void;
  userPoints: number;
  onPointsUsed: (points: number) => void;
}

export function BidModal(props: Props) {
  const {
    bidAmount,
    setBidAmount,
    isPlacingBid,
    minBid,
    canBid,
    placeBid,
  } = useBidModal(
    props.item,
    props.userPoints,
    props.onBidPlaced,
    props.onPointsUsed,
    props.onClose
  );

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent>
        <BidHeader item={props.item} onClose={props.onClose} />
        <BidStats item={props.item} />
        <BidHistory item={props.item} />
        <PlaceBidSection
          item={props.item}
          bidAmount={bidAmount}
          minBid={minBid}
          canBid={canBid}
          onChange={setBidAmount}
        />
        <BidFooter
          item={props.item}
          minBid={minBid}
          canBid={canBid}
          isPlacingBid={isPlacingBid}
          onQuickBid={setBidAmount}
          onPlaceBid={placeBid}
          onClose={props.onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
