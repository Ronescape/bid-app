import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Zap, Crown, Coins, TrendingUp, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiGet } from '../utils/apiUtility';
import { Bundle } from '../data/gameData';

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
  onPointsUsed: (points: number, itemName?: string) => Promise<boolean>;
  onPointsAdded: (points: number, itemName?: string) => Promise<void>;
  apiUrl: string;
}

export function BundlesView({ userPoints, onPointsUsed, onPointsAdded, apiUrl }: BundlesViewProps) {
  const [activeBundle, setActiveBundle] = useState<string | null>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyTransactions, setDailyTransactions] = useState<Transaction[]>([
    { id: '1', bundleName: 'Gold Bundle', type: 'usdt', amount: 3.5, date: new Date(Date.now() - 1 * 60 * 60 * 1000), status: 'completed' },
    { id: '2', bundleName: 'Silver Bundle', type: 'points', amount: 30, date: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'completed' },
    { id: '3', bundleName: 'Gold Bundle', type: 'usdt', amount: 3.5, date: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'completed' },
    { id: '4', bundleName: 'Silver Bundle', type: 'points', amount: 30, date: new Date(Date.now() - 8 * 60 * 60 * 1000), status: 'completed' },
    { id: '5', bundleName: 'Starter Bundle', type: 'usdt', amount: 0.5, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'completed' },
  ]);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
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
        `${apiUrl}/bundles`,
        headers,
        (responseData) => {
          if (responseData.success && responseData.data) {
            const transformedBundles = responseData.data.map(transformApiBundle);
            // Sort by weight
            const sortedBundles = transformedBundles.sort((a : any, b : any) => a.weight - b.weight);
            setBundles(sortedBundles);
          } else {
            throw new Error(responseData.message || 'Failed to fetch bundles');
          }
        },
        (error) => {
          setError(error.message || 'Failed to load bundles');
          toast.error('Failed to load bundles');
        }
      );
    } catch (error) {
      setError('Unexpected error occurred');
      toast.error('Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  const transformApiBundle = (apiBundle: any): Bundle => {
    // Calculate points cost based on total value (assuming 1 point = $0.01)
    const totalValue = parseFloat(apiBundle.package_details.total_value);
    const pointsCost = Math.round(totalValue * 100); // $1 = 100 points
    
    // Determine icon based on name or code
    const getIconFromCode = (code: string): 'coins' | 'sparkles' | 'zap' | 'crown' => {
      if (code.includes('starter')) return 'coins';
      if (code.includes('silver')) return 'sparkles';
      if (code.includes('gold')) return 'zap';
      return 'crown';
    };

    // Determine gradient based on weight
    const getGradientFromWeight = (weight: number): string => {
      switch (weight) {
        case 1:
          return 'from-slate-700 to-slate-900';
        case 2:
          return 'from-blue-600 to-purple-600';
        case 3:
          return 'from-orange-500 to-pink-600';
        default:
          return 'from-purple-600 to-pink-600';
      }
    };

    return {
      id: apiBundle.code,
      code: apiBundle.code,
      name: apiBundle.name,
      pointsCost: pointsCost,
      dailyPoints: parseInt(apiBundle.package_details.daily_points),
      dailyUsdt: parseFloat(apiBundle.package_details.daily_usdt),
      duration: parseInt(apiBundle.package_details.duration_days),
      totalValue: totalValue,
      icon: getIconFromCode(apiBundle.code),
      gradient: getGradientFromWeight(apiBundle.weight),
      popular: apiBundle.is_popular,
      tag: apiBundle.tag || undefined,
      photo: apiBundle.photo.url,
      weight: apiBundle.weight
    };
  };

  const handlePurchaseBundle = async (bundle: Bundle) => {
    if (userPoints < bundle.pointsCost) {
      toast.error(`Insufficient points! You need ${bundle.pointsCost} points.`);
      return;
    }

    const pointsUsed = await onPointsUsed(bundle.pointsCost, bundle.name);
    
    if (pointsUsed) {
      setActiveBundle(bundle.id);
      
      // Simulate adding daily earnings (in real app, this would come from API)
      setTimeout(() => {
        onPointsAdded(bundle.dailyPoints, `${bundle.name} Daily Reward`);
        toast.success(`💰 +${bundle.dailyPoints} points added from ${bundle.name}`);
      }, 1000);
      
      toast.success(`${bundle.name} activated! You'll receive daily rewards for ${bundle.duration} days.`);
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <p className="text-slate-400">Loading bundles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load bundles: {error}</p>
        <Button 
          onClick={fetchBundles}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          Retry
        </Button>
      </div>
    );
  }

  const renderBundleCard = (bundle: Bundle) => (
    <Card
      key={bundle.id}
      className={`relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-500/50 border-slate-700/50 bg-slate-800/30 backdrop-blur-sm ${
        bundle.popular ? 'border-2 border-purple-500/30' : ''
      }`}
    >
      {bundle.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 text-white text-center py-1 text-xs">
          ⭐ Popular
        </div>
      )}
      {!bundle.popular && bundle.tag && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            {bundle.tag}
          </Badge>
        </div>
      )}

      <div className={`p-6 ${bundle.popular ? 'pt-10' : ''}`}>
        {/* Bundle Image */}
        <div className="relative w-full h-32 mb-4 overflow-hidden rounded-xl">
          <img 
            src={bundle.photo} 
            alt={bundle.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              // Fallback to gradient if image fails
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center ${bundle.gradient} rounded-xl">
                    ${getIcon(bundle.icon).props.children}
                  </div>
                `;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-2 right-2">
            <div className={`w-10 h-10 bg-gradient-to-br ${bundle.gradient} rounded-full flex items-center justify-center text-white shadow-xl`}>
              {getIcon(bundle.icon)}
            </div>
          </div>
        </div>

        {/* Bundle Name */}
        <h3 className="text-center mb-2 text-white font-medium">{bundle.name}</h3>

        {/* Cost */}
        <div className="text-center mb-4">
          <div className="text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {bundle.pointsCost.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Points Cost</div>
          <div className="text-xs text-slate-500">(Value: ${bundle.totalValue})</div>
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
            <span className="text-yellow-400">${bundle.totalValue}</span>
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
  );

  const steps = [
    { number: 1, title: 'Purchase a bundle with your points' },
    { number: 2, title: 'Bundle activates immediately' },
    { number: 3, title: 'Receive daily points & USDT automatically' },
    { number: 4, title: 'Earn passive income for the duration' }
  ];

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
        {bundles.map(renderBundleCard)}
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
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl shadow-purple-500/50">
                {step.number}
              </div>
              <p className="text-sm text-slate-300">{step.title}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}