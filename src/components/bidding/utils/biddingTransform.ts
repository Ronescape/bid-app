import { ApiBiddingItem, BiddingItem } from "../../../data/gameData";
import { categories } from "../data/biddingCategories";

export const transformApiItem = (apiItem: ApiBiddingItem): BiddingItem => {
  const startDate = new Date(apiItem.opens_at);
  const endDate = new Date(apiItem.closes_at);
  const now = new Date();

  let status: "live" | "upcoming" | "ended" = "upcoming";

  if (apiItem.status === "ended" || now > endDate) {
    status = "ended";
  } else if (now >= startDate) {
    status = "live";
  }

  return {
    id: apiItem.id.toString(),
    title: apiItem.name,
    description: `Valued at $${apiItem.usd_value} | Bid Increment: $${apiItem.bid_incremental}`,
    image: apiItem.photo.url,
    currentBid: apiItem.current_bid,
    startingBid: apiItem.starting_bid,
    bidders: apiItem.total_bidders,
    startDate,
    endDate,
    status,
    category: categories[apiItem.category_id] ?? "General",
    seller: "Auction House",
    pointsCost: 10,
    bid_incremental: apiItem.bid_incremental,
    usd_value: apiItem.usd_value,
    is_featured: apiItem.is_featured,
    bids: [],
  };
};
