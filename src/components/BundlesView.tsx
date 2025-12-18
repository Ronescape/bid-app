import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Zap, Crown, Coins, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Bundle {
  id: string;
  name: string;
  pointsCost: number;
  dailyPoints: number;
  dailyUsdt: number;
  duration: number; // days
  icon: 'coins' | 'sparkles' | 'zap' | 'crown';
  gradient: string;
  popular?: boolean;
  badge?: string;
}

interface Transaction {
  id: string;
  bundleName: string;
  type: 'points' | 'usdt';
  amount: number;
  date: Date;
  status: 'completed' | 'pending';
}

interface BundlesViewProps {
  userPoints: number;
  onPointsUsed: (points: number) => void;
  onPointsAdded: (points: number) => void;
}

export function BundlesView({ userPoints, onPointsUsed, onPointsAdded }: BundlesViewProps) {
  const [activeBundle, setActiveBundle] = useState<string | null>(null);
  const [dailyTransactions] = useState<Transaction[]>([
    { id: '1', bundleName: 'Diamond Bundle', type: 'usdt', amount: 5.5, date: new Date(Date.now() - 1 * 60 * 60 * 1000), status: 'completed' },
    { id: '2', bundleName: 'Gold Bundle', type: 'points', amount: 50, date: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'completed' },
    { id: '3', bundleName: 'Premium Bundle', type: 'usdt', amount: 8.2, date: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'completed' },
    { id: '4', bundleName: 'Silver Bundle', type: 'points', amount: 30, date: new Date(Date.now() - 8 * 60 * 60 * 1000), status: 'completed' },
    { id: '5', bundleName: 'Diamond Bundle', type: 'usdt', amount: 5.5, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '6', bundleName: 'Elite Bundle', type: 'points', amount: 120, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '7', bundleName: 'Gold Bundle', type: 'usdt', amount: 3.5, date: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '8', bundleName: 'Premium Bundle', type: 'points', amount: 80, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '9', bundleName: 'Starter Bundle', type: 'points', amount: 15, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '10', bundleName: 'Diamond Bundle', type: 'usdt', amount: 5.5, date: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '11', bundleName: 'Silver Bundle', type: 'points', amount: 30, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '12', bundleName: 'Elite Bundle', type: 'usdt', amount: 12.0, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '13', bundleName: 'Gold Bundle', type: 'points', amount: 50, date: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '14', bundleName: 'Premium Bundle', type: 'usdt', amount: 8.2, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '15', bundleName: 'Starter Bundle', type: 'points', amount: 15, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '16', bundleName: 'Diamond Bundle', type: 'usdt', amount: 5.5, date: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '17', bundleName: 'Silver Bundle', type: 'points', amount: 30, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '18', bundleName: 'Gold Bundle', type: 'usdt', amount: 3.5, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '19', bundleName: 'Elite Bundle', type: 'points', amount: 120, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), status: 'completed' },
    { id: '20', bundleName: 'Premium Bundle', type: 'usdt', amount: 8.2, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), status: 'completed' },
  ]);

  const bundles: Bundle[] = [
    {
      id: '1',
      name: 'Starter Bundle',
      pointsCost: 50,
      dailyPoints: 15,
      dailyUsdt: 0.5,
      duration: 7,
      icon: 'coins',
      gradient: 'from-slate-700 to-slate-900',
      badge: 'Beginner Friendly'
    },
    {
      id: '2',
      name: 'Silver Bundle',
      pointsCost: 150,
      dailyPoints: 30,
      dailyUsdt: 1.2,
      duration: 10,
      icon: 'sparkles',
      gradient: 'from-blue-600 to-purple-600',
    },
    {
      id: '3',
      name: 'Gold Bundle',
      pointsCost: 300,
      dailyPoints: 50,
      dailyUsdt: 3.5,
      duration: 14,
      icon: 'zap',
      gradient: 'from-orange-500 to-pink-600',
      popular: true,
      badge: 'Most Popular'
    },
    {
      id: '4',
      name: 'Diamond Bundle',
      pointsCost: 500,
      dailyPoints: 100,
      dailyUsdt: 5.5,
      duration: 21,
      icon: 'crown',
      gradient: 'from-purple-600 to-pink-600',
      badge: 'Best Value'
    },
    {
      id: '5',
      name: 'Premium Bundle',
      pointsCost: 800,
      dailyPoints: 180,
      dailyUsdt: 8.2,
      duration: 30,
      icon: 'crown',
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Pro Choice'
    },
    {
      id: '6',
      name: 'Elite Bundle',
      pointsCost: 1500,
      dailyPoints: 350,
      dailyUsdt: 12,
      duration: 45,
      icon: 'crown',
      gradient: 'from-red-600 to-pink-500',
      badge: 'Ultimate'
    },
  ];

  const handlePurchaseBundle = (bundle: Bundle) => {
    if (userPoints < bundle.pointsCost) {
      toast.error(`Insufficient points! You need ${bundle.pointsCost} points.`);
      return;
    }

    onPointsUsed(bundle.pointsCost);
    setActiveBundle(bundle.id);
    toast.success(`${bundle.name} activated! You'll receive daily rewards for ${bundle.duration} days.`);
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'coins':
        return <Coins className="w-8 h-8" />;
      case 'sparkles':
        return <Sparkles className="w-8 h-8" />;
      case 'zap':
        return <Zap className="w-8 h-8" />;
      case 'crown':
        return <Crown className="w-8 h-8" />;
      default:
        return <Coins className="w-8 h-8" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const totalDailyEarnings = bundles.find(b => b.id === activeBundle);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 border border-purple-500/30">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10">
          <h2 className="text-white mb-2">Investment Bundles</h2>
          <p className="text-white/90 mb-4">
            Buy bundles with points and earn daily rewards in points & USDT
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
              Daily Rewards
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
              Auto Distribution
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
              Passive Income
            </Badge>
          </div>
        </div>
      </div>

      {/* Active Bundle Info */}
      {activeBundle && totalDailyEarnings && (
        <Card className="p-6 bg-gradient-to-r from-green-400 to-cyan-500 border-0">
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="text-white mb-1">Active Bundle</h3>
              <p className="text-white/90">{totalDailyEarnings.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Daily Earnings</div>
              <div className="text-white">
                +{totalDailyEarnings.dailyPoints} Points + ${totalDailyEarnings.dailyUsdt} USDT
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <Card
            key={bundle.id}
            className={`relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-500/50 border-slate-700/50 bg-slate-800/30 backdrop-blur-sm ${
              bundle.popular ? 'border-2 border-purple-500/30' : ''
            }`}
          >
            {bundle.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 text-white text-center py-1 text-xs">
                ⭐ {bundle.badge}
              </div>
            )}
            {!bundle.popular && bundle.badge && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                  {bundle.badge}
                </Badge>
              </div>
            )}

            <div className={`p-6 ${bundle.popular ? 'pt-10' : ''}`}>
              {/* Icon */}
              <div
                className={`w-16 h-16 bg-gradient-to-br ${bundle.gradient} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-xl shadow-purple-500/50`}
              >
                {getIcon(bundle.icon)}
              </div>

              {/* Bundle Name */}
              <h3 className="text-center mb-2 text-white">{bundle.name}</h3>

              {/* Cost */}
              <div className="text-center mb-4">
                <div className="text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {bundle.pointsCost}
                </div>
                <div className="text-sm text-slate-400">Points Cost</div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 p-3 bg-black/60 rounded-lg border border-slate-700/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Daily Points:</span>
                  <span className="text-green-400">+{bundle.dailyPoints}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Daily USDT:</span>
                  <span className="text-blue-400">+${bundle.dailyUsdt}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-purple-400">{bundle.duration} days</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700/50">
                  <span className="text-slate-400">Total Value:</span>
                  <span className="text-yellow-400">
                    ${(bundle.dailyPoints * 0.1 + bundle.dailyUsdt) * bundle.duration}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <Button
                onClick={() => handlePurchaseBundle(bundle)}
                disabled={activeBundle === bundle.id || userPoints < bundle.pointsCost}
                className={`w-full bg-gradient-to-r ${bundle.gradient} hover:opacity-90 transition-all shadow-xl border-0 ${
                  activeBundle === bundle.id ? 'opacity-50' : 'hover:shadow-purple-500/70'
                }`}
              >
                {activeBundle === bundle.id ? 'Active' : 'Purchase Bundle'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Daily Transactions */}
      <div>
        <h3 className="mb-4 text-white">Daily Rewards History</h3>
        <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dailyTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-black/60 rounded-lg border border-slate-700/30 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'usdt' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    {tx.type === 'usdt' ? (
                      <DollarSign className="w-5 h-5 text-white" />
                    ) : (
                      <Coins className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-white">{tx.bundleName}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {formatTime(tx.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={tx.type === 'usdt' ? 'text-blue-400' : 'text-purple-400'}>
                    +{tx.amount} {tx.type === 'usdt' ? 'USDT' : 'Points'}
                  </div>
                  <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50">
        <h3 className="mb-4 text-white">How Bundles Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl shadow-purple-500/50">
              1
            </div>
            <p className="text-sm text-slate-300">Purchase a bundle with your points</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl shadow-purple-500/50">
              2
            </div>
            <p className="text-sm text-slate-300">Bundle activates immediately</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl shadow-purple-500/50">
              3
            </div>
            <p className="text-sm text-slate-300">Receive daily points & USDT automatically</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl shadow-purple-500/50">
              4
            </div>
            <p className="text-sm text-slate-300">Earn passive income for the duration</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
