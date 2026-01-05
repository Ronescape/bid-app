import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Clock, Users, TrendingUp, Flame, Tag, User, Calendar, Coins, X } from 'lucide-react';
import { BiddingItem } from '../../../data/gameData';

interface BidModalProps {
  item: BiddingItem;
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onBidPlaced: (amount: number) => void;
  userPoints: number;
  onPointsUsed: (points: number) => void;
}

export function BidModal({
  item,
  username,
  isOpen,
  onClose,
  onBidPlaced,
  userPoints,
  onPointsUsed,
}: BidModalProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const minBid = item.currentBid > 0 ? item.currentBid + 10 : item.startingBid;

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);

    if (!amount || amount < minBid) {
      console.error(`Minimum bid is $${minBid}`);
      return;
    }

    if (userPoints < item.pointsCost) {
      console.error(`Insufficient points! You need ${item.pointsCost} points to bid.`);
      return;
    }

    setIsPlacingBid(true);

    setTimeout(() => {
      onBidPlaced(amount);
      onPointsUsed(item.pointsCost);
      setBidAmount('');
      setIsPlacingBid(false);
      onClose();
    }, 500);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickBids = [minBid, minBid + 50, minBid + 100];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full h-[90vh] max-h-[90vh] p-0 bg-slate-900 border-slate-700/50 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 p-4 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg truncate">{item.title}</DialogTitle>
            <Button
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white"
              onClick={onClose}
              aria-label="Close bid modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Image and Status */}
          <div className="relative rounded-xl overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-48 sm:h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            <div className="absolute top-4 right-4 space-y-1">
              {item.status === 'live' && (
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 backdrop-blur-sm shadow-xl shadow-red-500/50 animate-pulse flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  LIVE
                </Badge>
              )}
              {item.status === 'upcoming' && (
                <Badge className="bg-blue-500 text-white shadow-xl">UPCOMING</Badge>
              )}
              {item.status === 'ended' && (
                <Badge className="bg-slate-700/50 text-slate-300 backdrop-blur-sm">ENDED</Badge>
              )}
            </div>
            {item.pointsCost && (
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl shadow-purple-500/50 flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  {item.pointsCost} Points
                </Badge>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm sm:text-base">{item.description}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/30">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xs text-slate-400">Time Left</div>
                <div className="text-sm text-white">{getTimeRemaining(item.endDate)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/30">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-xs text-slate-400">Bidders</div>
                <div className="text-sm text-white">{item.bidders}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/30">
              <Tag className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-xs text-slate-400">Starting Bid</div>
                <div className="text-sm text-white">${item.startingBid}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/30">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-xs text-slate-400">Current Bid</div>
                <div className="text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ${item.currentBid || item.startingBid}
                </div>
              </div>
            </div>
          </div>

          {/* Auction Details */}
          <div className="space-y-2 p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/30">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">Seller:</span>
              <span className="text-white">{item.seller}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">Category:</span>
              <span className="text-white">{item.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">Ends:</span>
              <span className="text-white">{formatDate(item.endDate)}</span>
            </div>
          </div>

          {/* Bid History */}
          <div>
            <h3 className="mb-3 text-white">Bid History</h3>
            {item.bids && item.bids.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {item.bids.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg">
                        {bid.bidder?.charAt(1)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-sm text-white">{bid.bidder || 'Anonymous'}</div>
                        <div className="text-xs text-slate-400">{formatTime(bid.time)}</div>
                      </div>
                    </div>
                    <div className="text-purple-400">${bid.amount}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 bg-slate-800/50 rounded-lg border border-slate-700/30">
                No bids yet. Be the first to bid!
              </div>
            )}
          </div>

          {/* Place Bid Section */}
          {item.status === 'live' && (
            <div className="space-y-3 p-4 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-blue-900/50 rounded-lg border-2 border-purple-500/30 backdrop-blur-sm">
              <h4 className="text-white">Place Your Bid</h4>
              <div className="flex items-center justify-between text-sm p-3 bg-black/60 rounded border border-slate-700/30">
                <span className="text-slate-400">Your Points:</span>
                <span className={userPoints >= item.pointsCost ? 'text-green-400' : 'text-red-400'}>
                  {userPoints} Points
                </span>
              </div>
              <p className="text-sm text-slate-400">Minimum bid: ${minBid}</p>
              <Input
                type="number"
                placeholder={`Min $${minBid}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={minBid}
                step="10"
                className="bg-black/60 border-slate-700/50 text-white placeholder:text-slate-500"
                aria-label="Bid amount"
              />
              {userPoints < item.pointsCost && (
                <p className="text-sm text-red-400 text-center">
                  Insufficient points! Buy more points to place a bid.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/50 bg-slate-900/90 backdrop-blur-sm flex-shrink-0 p-4 space-y-2">
          {item.status === 'live' ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                {quickBids.map((bid, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setBidAmount(bid.toString())}
                    disabled={userPoints < item.pointsCost}
                    className="bg-black/60 border-slate-700/50 text-white hover:bg-purple-600/50 hover:text-white hover:border-purple-500/50 py-2"
                    aria-label={`Bid $${bid}`}
                  >
                    ${bid}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handlePlaceBid}
                disabled={isPlacingBid || !bidAmount || userPoints < item.pointsCost}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl border-0 py-3 text-base"
                aria-label={`Place bid for ${item.pointsCost} points`}
              >
                {isPlacingBid ? 'Placing Bid...' : `Place Bid (${item.pointsCost} Points)`}
              </Button>
            </>
          ) : (
            <Button
              onClick={onClose}
              className="w-full bg-slate-800/50 hover:bg-slate-700/50 text-white border-slate-700/50 py-3"
              aria-label="Close modal"
            >
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
