import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Clock, Users, Flame, Coins } from 'lucide-react';
import { BidModal } from './BidModal';

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
  bids: Array<{
    bidder: string;
    amount: number;
    time: Date;
  }>;
}

interface BiddingsViewProps {
  username: string;
  userPoints: number;
  onPointsUsed: (points: number) => void;
}

export function BiddingsView({ username, userPoints, onPointsUsed }: BiddingsViewProps) {
  const [selectedItem, setSelectedItem] = useState<BiddingItem | null>(null);
  const [items, setItems] = useState<BiddingItem[]>([]);

  useEffect(() => {
    const mockItems: BiddingItem[] = [
      {
        id: '1',
        title: 'iPhone 15 Pro Max',
        description: '256GB, Titanium Blue, Brand New Sealed',
        image: 'https://images.unsplash.com/photo-1695639509828-d4260075e370?w=400',
        currentBid: 850,
        startingBid: 500,
        bidders: 24,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
        status: 'live',
        category: 'Electronics',
        seller: '@techdeals',
        pointsCost: 10,
        bids: [
          { bidder: '@john_doe', amount: 850, time: new Date(Date.now() - 5 * 60 * 1000) },
          { bidder: '@jane_smith', amount: 820, time: new Date(Date.now() - 15 * 60 * 1000) },
        ]
      },
      {
        id: '2',
        title: 'Luxury Watch Collection',
        description: 'Premium Swiss Movement, Gold Plated',
        image: 'https://images.unsplash.com/photo-1670177257750-9b47927f68eb?w=400',
        currentBid: 1200,
        startingBid: 800,
        bidders: 45,
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'live',
        category: 'Luxury',
        seller: '@luxuryitems',
        pointsCost: 15,
        bids: [
          { bidder: '@watch_collector', amount: 1200, time: new Date(Date.now() - 10 * 60 * 1000) },
        ]
      },
      {
        id: '3',
        title: 'Gaming Laptop RTX 4090',
        description: 'i9 Processor, 64GB RAM, 2TB SSD',
        image: 'https://images.unsplash.com/photo-1640955014216-75201056c829?w=400',
        currentBid: 1850,
        startingBid: 1200,
        bidders: 38,
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
        status: 'live',
        category: 'Gaming',
        seller: '@gamingdeals',
        pointsCost: 20,
        bids: [
          { bidder: '@gamer_pro', amount: 1850, time: new Date(Date.now() - 8 * 60 * 1000) },
        ]
      },
      {
        id: '4',
        title: 'Designer Sneakers Limited',
        description: 'Exclusive Colorway, Size 10, Brand New',
        image: 'https://images.unsplash.com/photo-1686783695684-7b8351fdebbd?w=400',
        currentBid: 320,
        startingBid: 200,
        bidders: 67,
        startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 1 * 60 * 60 * 1000),
        status: 'live',
        category: 'Fashion',
        seller: '@sneakerhead',
        pointsCost: 8,
        bids: [
          { bidder: '@sneaker_fan', amount: 320, time: new Date(Date.now() - 3 * 60 * 1000) },
        ]
      },
      {
        id: '5',
        title: 'Professional Drone 4K',
        description: 'Camera Drone, GPS, 40min Flight Time',
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
        currentBid: 580,
        startingBid: 350,
        bidders: 29,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
        status: 'live',
        category: 'Electronics',
        seller: '@dronedeals',
        pointsCost: 12,
        bids: []
      },
      {
        id: '6',
        title: 'Smart TV 75" 8K',
        description: 'OLED Display, Smart Features, HDR',
        image: 'https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?w=400',
        currentBid: 1650,
        startingBid: 1000,
        bidders: 52,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
        status: 'live',
        category: 'Electronics',
        seller: '@techstore',
        pointsCost: 18,
        bids: []
      },
      {
        id: '7',
        title: 'iPad Pro 12.9" M2',
        description: '512GB, WiFi + Cellular, Space Gray',
        image: 'https://images.unsplash.com/photo-1714071803623-9594e3b77862?w=400',
        currentBid: 920,
        startingBid: 650,
        bidders: 41,
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
        status: 'live',
        category: 'Electronics',
        seller: '@applestore',
        pointsCost: 15,
        bids: []
      },
      {
        id: '8',
        title: 'Camera Lens 85mm f/1.4',
        description: 'Professional Portrait Lens, Like New',
        image: 'https://images.unsplash.com/photo-1608186336271-53313eeaf864?w=400',
        currentBid: 780,
        startingBid: 500,
        bidders: 33,
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'live',
        category: 'Photography',
        seller: '@camerashop',
        pointsCost: 13,
        bids: []
      },
      {
        id: '9',
        title: 'Wireless Earbuds Pro',
        description: 'Active Noise Cancellation, 30h Battery',
        image: 'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=400',
        currentBid: 145,
        startingBid: 80,
        bidders: 78,
        startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
        status: 'live',
        category: 'Audio',
        seller: '@audiotech',
        pointsCost: 5,
        bids: []
      },
      {
        id: '10',
        title: 'Electric Guitar Custom',
        description: 'Handcrafted, Vintage Tone, Premium Woods',
        image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400',
        currentBid: 1250,
        startingBid: 800,
        bidders: 26,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
        status: 'live',
        category: 'Music',
        seller: '@musicstore',
        pointsCost: 16,
        bids: []
      },
      {
        id: '11',
        title: 'Designer Handbag',
        description: 'Leather, Limited Edition, Authentic',
        image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=400',
        currentBid: 680,
        startingBid: 400,
        bidders: 54,
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
        status: 'live',
        category: 'Fashion',
        seller: '@luxurybags',
        pointsCost: 12,
        bids: []
      },
      {
        id: '12',
        title: 'Smart Watch Ultra',
        description: 'Fitness Tracking, GPS, Waterproof',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
        currentBid: 385,
        startingBid: 250,
        bidders: 92,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'live',
        category: 'Wearables',
        seller: '@techgadgets',
        pointsCost: 9,
        bids: []
      },
      {
        id: '13',
        title: 'Vintage Vinyl Records',
        description: 'Classic Rock Collection, Mint Condition',
        image: 'https://images.unsplash.com/photo-1635135449992-c3438898371b?w=400',
        currentBid: 220,
        startingBid: 120,
        bidders: 35,
        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
        status: 'live',
        category: 'Collectibles',
        seller: '@vintagemusic',
        pointsCost: 6,
        bids: []
      },
      {
        id: '14',
        title: 'Designer Sunglasses',
        description: 'Polarized Lenses, UV Protection',
        image: 'https://images.unsplash.com/photo-1663585703603-9be01a72a62a?w=400',
        currentBid: 165,
        startingBid: 100,
        bidders: 48,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
        status: 'live',
        category: 'Fashion',
        seller: '@eyewear',
        pointsCost: 5,
        bids: []
      },
      {
        id: '15',
        title: 'Mountain Bike Carbon',
        description: 'Full Suspension, 29er, Shimano XT',
        image: 'https://images.unsplash.com/photo-1613935352040-74a5e90199dd?w=400',
        currentBid: 1450,
        startingBid: 900,
        bidders: 31,
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
        status: 'live',
        category: 'Sports',
        seller: '@bikeshop',
        pointsCost: 17,
        bids: []
      },
      {
        id: '16',
        title: 'Espresso Machine Pro',
        description: 'Commercial Grade, Dual Boiler, Stainless',
        image: 'https://images.unsplash.com/photo-1620807773206-49c1f2957417?w=400',
        currentBid: 520,
        startingBid: 300,
        bidders: 44,
        startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
        status: 'live',
        category: 'Home',
        seller: '@coffeelovers',
        pointsCost: 11,
        bids: []
      },
      // Upcoming items
      {
        id: '17',
        title: 'PlayStation 5 Pro',
        description: 'Next Gen Console, 2TB, Extra Controller',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
        currentBid: 0,
        startingBid: 400,
        bidders: 0,
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'upcoming',
        category: 'Gaming',
        seller: '@gamingdeals',
        pointsCost: 10,
        bids: []
      },
      {
        id: '18',
        title: 'MacBook Air M3',
        description: '16GB RAM, 512GB SSD, Midnight',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        currentBid: 0,
        startingBid: 900,
        bidders: 0,
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: 'upcoming',
        category: 'Electronics',
        seller: '@applestore',
        pointsCost: 15,
        bids: []
      },
      {
        id: '19',
        title: 'Canon EOS R5',
        description: 'Mirrorless Camera, 45MP, 8K Video',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        currentBid: 0,
        startingBid: 2000,
        bidders: 0,
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        status: 'upcoming',
        category: 'Photography',
        seller: '@camerashop',
        pointsCost: 25,
        bids: []
      },
      {
        id: '20',
        title: 'Rolex Submariner',
        description: 'Authentic, Box & Papers, 2023',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
        currentBid: 0,
        startingBid: 5000,
        bidders: 0,
        startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'upcoming',
        category: 'Luxury',
        seller: '@luxurywatches',
        pointsCost: 50,
        bids: []
      },
      // Ended items
      {
        id: '21',
        title: 'Sony WH-1000XM5',
        description: 'Noise Cancelling Headphones',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
        currentBid: 280,
        startingBid: 180,
        bidders: 65,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'ended',
        category: 'Audio',
        seller: '@audiotech',
        pointsCost: 7,
        bids: [
          { bidder: '@winner123', amount: 280, time: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        ]
      },
      {
        id: '22',
        title: 'AirPods Pro 2nd Gen',
        description: 'USB-C, Spatial Audio',
        image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400',
        currentBid: 195,
        startingBid: 120,
        bidders: 88,
        startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'ended',
        category: 'Audio',
        seller: '@applestore',
        pointsCost: 6,
        bids: []
      },
    ];
    setItems(mockItems);
  }, []);

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
        {item.pointsCost && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-purple-600 text-white border-0 shadow-xl shadow-purple-500/50">
              <Coins className="w-3 h-3 mr-1" />
              {item.pointsCost} Points
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="line-clamp-1 text-white">{item.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
        </div>

        {item.status !== 'upcoming' && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-slate-400">Current Bid:</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">${item.currentBid}</span>
          </div>
        )}

        {item.status === 'upcoming' && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-slate-400">Starting Bid:</span>
            <span className="text-white">${item.startingBid}</span>
          </div>
        )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveItems.map(renderBidCard)}
          </div>
          {liveItems.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No live auctions at the moment
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingItems.map(renderBidCard)}
          </div>
          {upcomingItems.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No upcoming auctions
            </div>
          )}
        </TabsContent>

        <TabsContent value="ended" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {endedItems.map(renderBidCard)}
          </div>
          {endedItems.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No ended auctions
            </div>
          )}
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
          onBidPlaced={(amount) => {
            setItems(prev => prev.map(item => 
              item.id === selectedItem.id 
                ? {
                    ...item,
                    currentBid: amount,
                    bidders: item.bidders + 1,
                    bids: [
                      { bidder: `@${username}`, amount, time: new Date() },
                      ...item.bids
                    ]
                  }
                : item
            ));
          }}
          onPointsUsed={onPointsUsed}
        />
      )}
    </div>
  );
}
