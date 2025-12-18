import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Trophy, TrendingUp, DollarSign, Clock, Award, LogOut, Percent, TrendingDown, CheckCircle, Target } from 'lucide-react';

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
    level: 'Gold',
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
    <div className="space-y-4">
      {/* Profile Header */}
      <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-slate-800/50 to-blue-900/50"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white text-2xl">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-white">@{username}</h2>
                <p className="text-slate-400">Member since {userData.joinDate}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-xl">
                    <Award className="w-3 h-3 mr-1" />
                    {userData.level} Bidder
                  </Badge>
                  <div className="flex items-center gap-1 text-sm bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white">{userData.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <div className="text-sm text-slate-400">Points Balance</div>
                <div className="text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {userPoints}
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={onLogout}
                className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-white hover:border-red-500/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-lg text-white mb-1">{userData.totalBids}</div>
          <div className="text-sm text-slate-400">Total Bids</div>
        </Card>

        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-lg text-white mb-1">{userData.wonAuctions}</div>
          <div className="text-sm text-slate-400">Won</div>
        </Card>

        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-lg text-white mb-1">{userData.activeBids}</div>
          <div className="text-sm text-slate-400">Active</div>
        </Card>

        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-lg text-white mb-1">${userData.savedAmount}</div>
          <div className="text-sm text-slate-400">Saved</div>
        </Card>
      </div>

      {/* My Active Bids */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">My Active Bids</h3>
          <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm">
            <Target className="w-3 h-3 mr-1" />
            Live Bidding
          </Badge>
        </div>
        <div className="space-y-2">
          {myActiveBids.map((bid) => (
            <Card key={bid.id} className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white group-hover:text-purple-300 transition-colors">{bid.title}</h4>
                    {bid.isWinning ? (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-xl">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Winning
                      </Badge>
                    ) : (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-xl">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Outbid
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">My bid: </span>
                      <span className={bid.isWinning ? 'text-green-400' : 'text-white'}>
                        ${bid.myBid}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Current: </span>
                      <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">${bid.currentBid}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 mb-2 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {bid.timeLeft}
                  </div>
                  {!bid.isWinning && (
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/70">
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Recent Wins</h3>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Trophy className="w-3 h-3 mr-1" />
            Victories
          </Badge>
        </div>
        <div className="space-y-2">
          {recentWins.map((win) => (
            <Card key={win.id} className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-green-500/30 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white group-hover:text-green-300 transition-colors">{win.title}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {win.wonDate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-green-400">${win.winningBid}</div>
                  <div className="text-xs text-slate-400">Won</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
        <h3 className="text-white mb-6">Activity Summary</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Total Spent</div>
                  <div className="text-white">${userData.totalSpent}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Win Rate</div>
                  <div className="text-white">
                    {Math.round((userData.wonAuctions / userData.totalBids) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Total Saved</div>
                  <div className="text-green-400">${userData.savedAmount}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                  <Percent className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Avg. Bid</div>
                  <div className="text-white">
                    ${Math.round(userData.totalSpent / userData.totalBids)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Level Progress */}
      <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Bidder Level</h3>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            {userData.level}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Progress to Platinum</span>
            <span className="text-white">65%</span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
              style={{ width: '65%' }}
            ></div>
          </div>
          <div className="text-xs text-slate-400">
            125 more wins needed for Platinum level
          </div>
        </div>
      </Card>
    </div>
  );
}