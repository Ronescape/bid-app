import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Trophy, TrendingUp, DollarSign, Clock, Award, LogOut } from 'lucide-react';

interface AccountViewProps {
  username: string;
  onLogout: () => void;
  userPoints: number;
}

export function AccountView({ username, onLogout, userPoints }: AccountViewProps) {
  // Mock user data
  const userData = {
    username,
    joinDate: 'December 2024',
    totalBids: 47,
    wonAuctions: 12,
    activeBids: 3,
    totalSpent: 3420,
    savedAmount: 1280,
    rating: 4.8,
  };

  const myActiveBids = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      myBid: 850,
      currentBid: 850,
      isWinning: true,
      timeLeft: '3h 45m',
    },
    {
      id: '2',
      title: 'MacBook Pro 16" M3',
      myBid: 2050,
      currentBid: 2100,
      isWinning: false,
      timeLeft: '1h 23m',
    },
    {
      id: '3',
      title: 'Sony WH-1000XM5',
      myBid: 185,
      currentBid: 185,
      isWinning: true,
      timeLeft: '5h 12m',
    },
  ];

  const recentWins = [
    {
      id: '1',
      title: 'iPad Air 5th Gen',
      winningBid: 420,
      wonDate: '2 days ago',
    },
    {
      id: '2',
      title: 'AirPods Pro 2',
      winningBid: 180,
      wonDate: '5 days ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2>@{username}</h2>
              <p className="text-gray-600">Member since {userData.joinDate}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                  <Award className="w-3 h-3 mr-1" />
                  Top Bidder
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span>{userData.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <Button 
            variant="outline"
            onClick={onLogout}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Bids</div>
              <div>{userData.totalBids}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Won</div>
              <div>{userData.wonAuctions}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active</div>
              <div>{userData.activeBids}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Saved</div>
              <div>${userData.savedAmount}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* My Active Bids */}
      <div>
        <h3 className="mb-4">My Active Bids</h3>
        <div className="space-y-3">
          {myActiveBids.map((bid) => (
            <Card key={bid.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm">{bid.title}</h4>
                    {bid.isWinning ? (
                      <Badge className="bg-green-500 text-white text-xs">Winning</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Outbid</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">My bid: </span>
                      <span className={bid.isWinning ? 'text-green-600' : ''}>
                        ${bid.myBid}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current: </span>
                      <span className="text-purple-600">${bid.currentBid}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-2">{bid.timeLeft}</div>
                  {!bid.isWinning && (
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Increase Bid
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Wins */}
      <div>
        <h3 className="mb-4">Recent Wins</h3>
        <div className="space-y-3">
          {recentWins.map((win) => (
            <Card key={win.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <h4 className="text-sm">{win.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{win.wonDate}</p>
                </div>
                <div className="text-right">
                  <div className="text-green-600">${win.winningBid}</div>
                  <div className="text-xs text-gray-600">Won</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="mb-4">Activity Summary</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
            <div className="text-purple-600">${userData.totalSpent}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Saved</div>
            <div className="text-green-600">${userData.savedAmount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Win Rate</div>
            <div>{Math.round((userData.wonAuctions / userData.totalBids) * 100)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Avg. Bid</div>
            <div>${Math.round(userData.totalSpent / userData.totalBids)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}