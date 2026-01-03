import { BiddingItem } from "../../../data/gameData";

export function getMinBid(item: BiddingItem) {
  return item.currentBid > 0 ? item.currentBid + 10 : item.startingBid;
}

export function getQuickBids(minBid: number) {
  return [minBid, minBid + 50, minBid + 100];
}
