import { useState } from "react";
import { BiddingItem } from "../../../data/gameData";
import { getMinBid } from "../utils/bidCalculations";

export function useBidModal(
  item: BiddingItem,
  userPoints: number,
  onBidPlaced: (amount: number) => void,
  onPointsUsed: (points: number) => void,
  onClose: () => void
) {
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const minBid = getMinBid(item);

  const canBid = userPoints >= item.pointsCost;

  const placeBid = () => {
    const amount = Number(bidAmount);

    if (!amount || amount < minBid) return;
    if (!canBid) return;

    setIsPlacingBid(true);

    setTimeout(() => {
      onBidPlaced(amount);
      onPointsUsed(item.pointsCost);
      setBidAmount("");
      setIsPlacingBid(false);
      onClose();
    }, 500);
  };

  return {
    bidAmount,
    setBidAmount,
    isPlacingBid,
    minBid,
    canBid,
    placeBid,
  };
}
