export type ComboBoxOption = {
  value: string;
  label: string;
};

export interface UserData {
  username: string;
  points: number;
  telegramId?: string;
  avatar?: string;
  totalBids?: number;
  wonAuctions?: number;
  joinDate?: string;
}

export interface BiddingItem {
  id: string;
  title: string;
  description: string;
  image: string;
  currentBid: number;
  startingBid: number;
  bidders: number;
  startDate: Date;
  endDate: Date;
  status: 'live' | 'upcoming' | 'ended';
  category: string;
  seller: string;
  pointsCost: number;
  bid_incremental: number;
  usd_value: number;
  is_featured: boolean;
  bids?: Array<{
    bidder: string;
    amount: number;
    time: Date;
  }>;
}

export interface ApiBiddingItem {
  id: number;
  name: string;
  category_id: number;
  opens_at: string;
  closes_at: string;
  total_bidders: number;
  starting_bid: number;
  current_bid: number;
  bid_incremental: number;
  usd_value: number;
  status: string;
  is_featured: boolean;
  weight: number;
  photo: {
    url: string;
    thumbnail_url: string | null;
    type: string;
  };
}

export interface Package {
  id: string;
  name: string;
  points: number;
  price: number;
  bonus?: number;
  bonusPoints?: number;
  tag?: string;
  icon: 'coins' | 'sparkles' | 'zap' | 'crown';
  popular?: boolean;
  photo: string;
  weight: number;
}

export interface ApiPackage {
  id: number;
  name: string;
  tag: string | null;
  is_popular: boolean;
  amount: number;
  bonus: number;
  points: number;
  weight: number;
  photo: {
    url: string;
    thumbnail_url: string | null;
    type: string;
  };
}

export interface Bundle {
  id: string;
  code: string;
  name: string;
  pointsCost: number;
  dailyPoints: number;
  dailyUsdt: number;
  duration: number; // days
  totalValue: number;
  icon: 'coins' | 'sparkles' | 'zap' | 'crown';
  gradient: string;
  popular?: boolean;
  tag?: string;
  photo: string;
  weight: number;
}