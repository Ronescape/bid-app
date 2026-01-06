import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BidModal } from './modal/BidModal';
import { useBiddings } from './hooks/useBiddings';
import { BidCard } from './BidCard';
import { BiddingItem } from '../../data/gameData'; // Adjust path if needed

interface Props {
  username: string;
  userPoints: number;
  onPointsUsed: (points: number, itemName?: string) => Promise<boolean>;
  onAuctionWon?: (auctionId: string) => void;
  apiUrl: string;
  totalBids?: number;
  wonAuctions?: number;
}


export function BiddingsView({ username, userPoints, apiUrl, onPointsUsed }: Props) {
  const { items, loading, error, fetchItems, setItems } = useBiddings(apiUrl);
  
  // <-- Explicitly typed to BiddingItem or null
  const [selectedItem, setSelectedItem] = useState<BiddingItem | null>(null);

  const liveItems = items.filter(item => item.status_label === "Live");
  const upcomingItems = items.filter(item => item.status_label === "Upcoming");
  const endedItems = items.filter(item => item.status_label === "Closed");

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
        <Button onClick={fetchItems} className="bg-gradient-to-r from-purple-600 to-pink-600">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats could be a separate component (optional) */}

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger
            value="live"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Live ({liveItems.length})
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            Upcoming ({upcomingItems.length})
          </TabsTrigger>
          <TabsTrigger
            value="ended"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
          >
            Ended ({endedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          {liveItems.length > 0 ? liveItems.map(item => (
            <BidCard key={item.id} item={item} onSelect={setSelectedItem} />
          )) : (
            <div className="text-center py-12 text-slate-500">No live auctions at the moment</div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingItems.length > 0 ? upcomingItems.map(item => (
            <BidCard key={item.id} item={item} onSelect={setSelectedItem} />
          )) : (
            <div className="text-center py-12 text-slate-500">No upcoming auctions</div>
          )}
        </TabsContent>

        <TabsContent value="ended" className="mt-6">
          {endedItems.length > 0 ? endedItems.map(item => (
            <BidCard key={item.id} item={item} onSelect={setSelectedItem} />
          )) : (
            <div className="text-center py-12 text-slate-500">No ended auctions</div>
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
          onBidPlaced={async (amount) => {
            const pointsUsed = await onPointsUsed(selectedItem.pointsCost, selectedItem.title);
            if (pointsUsed) {
              const newBid = {
                bidder: `@${username}`,
                amount,
                time: new Date(),
              };
              setItems(prev =>
                prev.map(item =>
                  item.id === selectedItem.id
                    ? {
                        ...item,
                        currentBid: amount,
                        bidders: item.bidders + 1,
                        bids: item.bids ? [...item.bids, newBid] : [newBid],
                      }
                    : item
                )
              );
            }
          }}
          onPointsUsed={onPointsUsed}
        />
      )}
    </div>
  );
}
