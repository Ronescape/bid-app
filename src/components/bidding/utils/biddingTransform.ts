import { ApiBiddingItem, BiddingItem } from "../../../data/gameData";
import { categories } from "../data/biddingCategories";

const parseApiDate = (dateString: string): Date => {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  
  const parts = dateString.split(' ');
  if (parts.length >= 4) {
    const month = months[parts[0]];
    const day = parseInt(parts[1].replace(',', ''));
    const year = parseInt(parts[2]);
    const time = parts[3];
    
    const timeMatch = time.match(/(\d+):(\d+)(AM|PM)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const period = timeMatch[3].toUpperCase();
      
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return new Date(Date.UTC(year, month, day, hours, minutes));
    }
  }
  
  return new Date(dateString + ' UTC');
};

export const transformApiItem = (apiItem: ApiBiddingItem): BiddingItem => {
  const startDate = parseApiDate(apiItem.opens_at);
  const endDate = parseApiDate(apiItem.closes_at);
  const now = new Date();

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
    status_label: apiItem.status_label,
    category: categories[apiItem.category_id] ?? "General",
    seller: "Auction House",
    pointsCost: apiItem.starting_bid,
    bid_incremental: apiItem.bid_incremental,
    usd_value: apiItem.usd_value,
    is_featured: apiItem.is_featured,
    bids: []
  };
};