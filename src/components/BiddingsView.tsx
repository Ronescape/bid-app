import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, Users, Flame, Coins, Loader2 } from 'lucide-react';
import { BidModal } from './BidModal';
import { toast } from 'sonner';
import { apiGet } from '../utils/apiUtility';
import { ApiBiddingItem, BiddingItem } from '../data/gameData';


interface BiddingsViewProps {
  username: string;
  userPoints: number;
  onPointsUsed: (points: number, itemName?: string) => Promise<boolean>;
  onAuctionWon?: (auctionId: string) => void;
  apiUrl: string;
  totalBids?: number;
  wonAuctions?: number;
}

const categories: Record<number, string> = {
  1: 'Electronics',
  2: 'Gadgets',
  3: 'Home & Kitchen',
  4: 'Fashion',
  5: 'Sports',
  6: 'Collectibles',
  7: 'Luxury',
  8: 'Automotive'
};

export function BiddingsView({ 
  username, 
  userPoints, 
  onPointsUsed,
  apiUrl 
}: BiddingsViewProps) {
  const [selectedItem, setSelectedItem] = useState<BiddingItem | null>(null);
  const [items, setItems] = useState<BiddingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('bidwin_token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      await apiGet(
        `${apiUrl}/items`,
        headers,
        (responseData) => {
          console.log('Fetched items:', responseData);
          if (responseData.success && responseData.data) {
            const transformedItems = responseData.data.map(transformApiItem);
            console.log('Transformed items:', transformedItems);
            setItems(transformedItems);
          } else {
            throw new Error(responseData.message || 'Failed to fetch items');
          }
        },
        (error) => {
          setError(error.message || 'Failed to load auctions');
          toast.error('Failed to load auctions');
        }
      );
    } catch (error) {
      setError('Unexpected error occurred');
      toast.error('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  const transformApiItem = (apiItem: ApiBiddingItem): BiddingItem => {
    const startDate = new Date(apiItem.opens_at);
    const endDate = new Date(apiItem.closes_at);
    const now = new Date();
    
    let status: 'live' | 'upcoming' | 'ended' = 'upcoming';
    
    if (apiItem.status === 'ended') {
      status = 'ended';
    } else if (now >= startDate && now <= endDate) {
      status = 'live';
    } else if (now > endDate) {
      status = 'ended';
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
      category: categories[apiItem.category_id] || 'General',
      seller: 'Auction House',
      pointsCost: 10, // Default points cost
      bid_incremental: apiItem.bid_incremental,
      usd_value: apiItem.usd_value,
      is_featured: apiItem.is_featured
    };
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const getTimeUntilStart = (startDate: Date) => {
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Starting soon';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `Starts in ${days}d ${hours}h`;
    }
    
    return `Starts in ${hours}h`;
  };

  const liveItems = items.filter(item => item.status === 'live');
  const upcomingItems = items.filter(item => item.status === 'upcoming');
  const endedItems = items.filter(item => item.status === 'ended');

  const renderBidCard = (item: BiddingItem) => (
    <Card 
      key={item.id}
      className="group overflow-hidden hover:shadow-2xl hover:shadow-red-500/70 transition-all cursor-pointer bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50"
      onClick={() => setSelectedItem(item)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute top-2 right-2">
          {item.status === 'live' && (
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 backdrop-blur-sm shadow-xl shadow-red-500/50 animate-pulse">
              <Flame className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
          )}
          {item.status === 'upcoming' && (
            <Badge className="bg-blue-500 text-white shadow-xl shadow-blue-500/50">UPCOMING</Badge>
          )}
          {item.status === 'ended' && (
            <Badge className="bg-slate-800/50 text-slate-400 backdrop-blur-sm border-slate-700/30">ENDED</Badge>
          )}
        </div>
        {item.is_featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-yellow-600 text-white border-0 shadow-xl shadow-yellow-500/50">
              ⭐ Featured
            </Badge>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <Badge className="bg-purple-600 text-white border-0 shadow-xl shadow-purple-500/50">
            <Coins className="w-3 h-3 mr-1" />
            {item.pointsCost} Points
          </Badge>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="line-clamp-1 text-white font-medium">{item.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-2 mt-1">{item.description}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-sm text-slate-400">
            {item.currentBid > 0 ? 'Current Bid:' : 'Starting Bid:'}
          </span>
          <span className={`font-medium ${
            item.currentBid > 0 
              ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent'
              : 'text-white'
          }`}>
            ${item.currentBid > 0 ? item.currentBid : item.startingBid}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-4 h-4" />
              {item.bidders}
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-4 h-4" />
              {item.status === 'upcoming' 
                ? getTimeUntilStart(item.startDate)
                : getTimeRemaining(item.endDate)
              }
            </div>
          </div>
          <Badge className="bg-slate-700/50 text-slate-300">
            {item.category}
          </Badge>
        </div>

        <Button 
          className={`w-full transition-all shadow-xl border-0 ${
            item.status === 'live' 
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-purple-500/70'
              : item.status === 'upcoming'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-purple-500/50'
              : 'bg-slate-800/50 text-slate-400'
          }`}
          onClick={(e : any) => {
            e.stopPropagation();
            setSelectedItem(item);
          }}
          disabled={item.status === 'ended'}
        >
          {item.status === 'live' && 'Place Bid'}
          {item.status === 'upcoming' && 'View Details'}
          {item.status === 'ended' && 'Auction Ended'}
        </Button>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <p className="text-slate-400">Loading auctions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load auctions: {error}</p>
        <Button 
          onClick={fetchItems}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          Retry
        </Button>
      </div>
    );
  }

  const renderTabContent = (items: BiddingItem[], emptyMessage: string) => (
    items.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(renderBidCard)}
      </div>
    ) : (
      <div className="text-center py-12 text-slate-500">
        {emptyMessage}
      </div>
    )
  );

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-1">
        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="text-lg text-white mb-1">{liveItems.length}</div>
          <div className="text-sm text-white/80">Live</div>
        </Card>
        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="text-lg text-white mb-1">{upcomingItems.length}</div>
          <div className="text-sm text-white/80">Upcoming</div>
        </Card>
        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="text-lg text-white mb-1">{endedItems.length}</div>
          <div className="text-sm text-slate-400">Ended</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="live" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
            Live ({liveItems.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Upcoming ({upcomingItems.length})
          </TabsTrigger>
          <TabsTrigger value="ended" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            Ended ({endedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          {renderTabContent(liveItems, 'No live auctions at the moment')}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {renderTabContent(upcomingItems, 'No upcoming auctions')}
        </TabsContent>

        <TabsContent value="ended" className="mt-6">
          {renderTabContent(endedItems, 'No ended auctions')}
        </TabsContent>
      </Tabs>

      {/* Bid Modal */}
      {selectedItem && (
        <BidModal
          item={selectedItem}
          username={username}
          userPoints={userPoints}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onBidPlaced={async (amount) => {
            const pointsUsed = await onPointsUsed(selectedItem.pointsCost, selectedItem.title);
            
            if (pointsUsed) {
              setItems(prev => prev.map(item => 
                item.id === selectedItem.id 
                  ? {
                      ...item,
                      currentBid: amount,
                      bidders: item.bidders + 1,
                    }
                  : item
              ));
              
              toast.success(`Bid placed: $${amount}`, {
                description: `Used ${selectedItem.pointsCost} points`
              });
            }
          }}
          onPointsUsed={onPointsUsed}
        />
      )}
    </div>
  );
}