import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Zap, Crown, Coins, Shield, Clock, Gift } from 'lucide-react';
import { TopupModal } from './TopupModal';

interface Package {
  id: string;
  name: string;
  points: number;
  price: number;
  badge?: string;
  icon: 'coins' | 'sparkles' | 'zap' | 'crown';
  popular?: boolean;
  bonus?: string;
  bonusPoints?: number;
}

interface PackagesViewProps {
  onPointsAdded: (points: number) => void;
}

export function PackagesView({ onPointsAdded }: PackagesViewProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const packages: Package[] = [
    {
      id: '1',
      name: 'Starter',
      points: 100,
      price: 10,
      icon: 'coins',
      badge: 'Beginner Friendly',
      bonusPoints: 10,
    },
    {
      id: '2',
      name: 'Silver',
      points: 250,
      price: 20,
      icon: 'sparkles',
      bonus: '+10% Bonus',
      bonusPoints: 25,
    },
    {
      id: '3',
      name: 'Gold',
      points: 600,
      price: 50,
      icon: 'zap',
      popular: true,
      bonus: '+20% Bonus',
      badge: 'Most Popular',
      bonusPoints: 120,
    },
    {
      id: '4',
      name: 'Diamond',
      points: 1500,
      price: 100,
      icon: 'crown',
      bonus: '+50% Bonus',
      badge: 'Best Value',
      bonusPoints: 750,
    },
  ];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'coins':
        return <Coins className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'zap':
        return <Zap className="w-6 h-6" />;
      case 'crown':
        return <Crown className="w-6 h-6" />;
      default:
        return <Coins className="w-6 h-6" />;
    }
  };

  const getGradient = (id: string) => {
    switch (id) {
      case '1':
        return 'from-gray-400 via-gray-500 to-gray-600';
      case '2':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case '3':
        return 'from-yellow-400 via-orange-500 to-orange-600';
      case '4':
        return 'from-purple-500 via-purple-600 to-pink-600';
      default:
        return 'from-purple-600 via-blue-600 to-pink-600';
    }
  };

  const renderPackageCard = (pkg: Package) => (
    <Card 
      key={pkg.id}
      className={`group relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/70 transition-all cursor-pointer bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 ${
        pkg.popular ? 'border-2 border-yellow-400' : ''
      }`}
      onClick={() => setSelectedPackage(pkg)}
    >
      {pkg.popular && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 text-xs font-semibold rounded-bl-lg rounded-tr-lg z-10">
          ⭐ {pkg.badge}
        </div>
      )}
      
      {!pkg.popular && pkg.badge && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl shadow-purple-500/50 text-xs">
            {pkg.badge}
          </Badge>
        </div>
      )}

      <div className={`p-6 ${pkg.popular ? 'pt-10' : ''}`}>
        {/* Icon */}
        <div
          className={`w-16 h-16 bg-gradient-to-br ${getGradient(
            pkg.id
          )} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-xl`}
        >
          {getIcon(pkg.icon)}
        </div>

        {/* Package Name */}
        <h3 className="text-center text-white mb-3">{pkg.name}</h3>

        {/* Points Display */}
        <div className="text-center mb-4">
          <div className="text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {pkg.points}
          </div>
          <div className="text-sm text-slate-400">Points</div>
        </div>

        {/* Bonus */}
        {pkg.bonus && (
          <div className="text-center mb-4">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-xl shadow-green-500/50">
              <Gift className="w-3 h-3 mr-1" />
              {pkg.bonus}
            </Badge>
          </div>
        )}

        {/* Price */}
        <div className="text-center mb-6">
          <div className="text-2xl text-white">${pkg.price}</div>
          <div className="text-sm text-slate-400">USDT (BSC)</div>
        </div>

        {/* Buy Button */}
        <Button
          className={`w-full transition-all shadow-xl border-0 bg-gradient-to-r ${getGradient(pkg.id)} hover:shadow-purple-500/70`}
          onClick={(e : any) => {
            e.stopPropagation();
            setSelectedPackage(pkg);
          }}
        >
          Buy Now
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-lg text-white mb-1">Points</div>
          <div className="text-sm text-slate-400">For Bidding</div>
        </Card>
        
        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-lg text-white mb-1">Secure</div>
          <div className="text-sm text-slate-400">USDT BSC</div>
        </Card>
        
        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-lg text-white mb-1">Instant</div>
          <div className="text-sm text-slate-400">Delivery</div>
        </Card>
        
        <Card className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-lg text-white mb-1">+50%</div>
          <div className="text-sm text-slate-400">Max Bonus</div>
        </Card>
      </div>

      {/* Main Header */}
      <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-slate-800/50 to-blue-900/50"></div>
        <div className="relative z-10">
          <h2 className="text-white mb-2">Points Packages</h2>
          <p className="text-slate-400 mb-4">
            Purchase points with USDT (BSC Network) to place bids on amazing items
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              Instant Delivery
            </Badge>
            <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm">
              <Shield className="w-3 h-3 mr-1" />
              Secure Payment
            </Badge>
            <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              24/7 Support
            </Badge>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      </Card>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map(renderPackageCard)}
      </div>

      {/* How it Works */}
      <Card className="p-6 bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
        <h3 className="text-white mb-6">How to Top Up</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl">
              <div className="text-lg font-semibold">1</div>
            </div>
            <p className="text-white text-sm font-medium">Choose Package</p>
            <p className="text-slate-400 text-xs mt-1">Select points bundle</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl">
              <div className="text-lg font-semibold">2</div>
            </div>
            <p className="text-white text-sm font-medium">Scan QR Code</p>
            <p className="text-slate-400 text-xs mt-1">Or copy wallet address</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl">
              <div className="text-lg font-semibold">3</div>
            </div>
            <p className="text-white text-sm font-medium">Send USDT</p>
            <p className="text-slate-400 text-xs mt-1">Via BSC network only</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl">
              <div className="text-lg font-semibold">4</div>
            </div>
            <p className="text-white text-sm font-medium">Get Points</p>
            <p className="text-slate-400 text-xs mt-1">Submit transaction hash</p>
          </div>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-yellow-400/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-yellow-400">Important Notes</h4>
        </div>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span>Only send USDT via BSC (Binance Smart Chain) network</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span>Minimum transaction amount: $10 USDT</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span>Points will be credited after transaction confirmation (usually 1-5 minutes)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span>Make sure to submit the correct transaction hash</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 mt-1">•</span>
            <span>Contact support if you don't receive points within 30 minutes</span>
          </li>
        </ul>
      </Card>

      {/* Topup Modal */}
      {selectedPackage && (
        <TopupModal
          package={selectedPackage}
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onSuccess={(points) => {
            onPointsAdded(points);
            setSelectedPackage(null);
          }}
        />
      )}
    </div>
  );
}