import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Zap, Crown, Coins } from 'lucide-react';
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
      badge: 'Best for Beginners',
    },
    {
      id: '2',
      name: 'Silver',
      points: 250,
      price: 20,
      icon: 'sparkles',
      bonus: '+10% Bonus',
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
    },
    {
      id: '4',
      name: 'Diamond',
      points: 1500,
      price: 100,
      icon: 'crown',
      bonus: '+50% Bonus',
      badge: 'Best Value',
    },
  ];

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

  const getGradient = (id: string) => {
    switch (id) {
      case '1':
        return 'from-gray-400 to-gray-600';
      case '2':
        return 'from-blue-400 to-blue-600';
      case '3':
        return 'from-yellow-400 to-orange-500';
      case '4':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-purple-600 to-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <h2 className="text-white mb-2">Buy Points Packages</h2>
          <p className="text-white/90 mb-4">
            Purchase points with USDT (BSC Network) to place bids on amazing items
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-white/20 text-white border-0">
              Instant Delivery
            </Badge>
            <Badge className="bg-white/20 text-white border-0">
              Secure Payment
            </Badge>
            <Badge className="bg-white/20 text-white border-0">
              24/7 Support
            </Badge>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Points System</div>
              <div>1 Point = 1 Bid</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Fast Topup</div>
              <div>Instant Points</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Bonus Points</div>
              <div>Up to +50%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${
              pkg.popular ? 'border-2 border-yellow-400' : ''
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-1 text-xs">
                ⭐ {pkg.badge}
              </div>
            )}
            {!pkg.popular && pkg.badge && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  {pkg.badge}
                </Badge>
              </div>
            )}

            <div className={`p-6 ${pkg.popular ? 'pt-10' : ''}`}>
              {/* Icon */}
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getGradient(
                  pkg.id
                )} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto`}
              >
                {getIcon(pkg.icon)}
              </div>

              {/* Package Name */}
              <h3 className="text-center mb-2">{pkg.name}</h3>

              {/* Points */}
              <div className="text-center mb-4">
                <div className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {pkg.points}
                </div>
                <div className="text-sm text-gray-600">Points</div>
              </div>

              {/* Bonus */}
              {pkg.bonus && (
                <div className="text-center mb-4">
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    {pkg.bonus}
                  </Badge>
                </div>
              )}

              {/* Price */}
              <div className="text-center mb-4">
                <div className="text-2xl">${pkg.price}</div>
                <div className="text-sm text-gray-600">USDT (BSC)</div>
              </div>

              {/* Buy Button */}
              <Button
                onClick={() => setSelectedPackage(pkg)}
                className={`w-full bg-gradient-to-r ${getGradient(pkg.id)} hover:opacity-90`}
              >
                Buy Now
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* How it Works */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <h3 className="mb-4">How to Top Up</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3">
              1
            </div>
            <p className="text-sm">Choose a package</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3">
              2
            </div>
            <p className="text-sm">Scan QR code or copy wallet address</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3">
              3
            </div>
            <p className="text-sm">Send USDT via BSC network</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3">
              4
            </div>
            <p className="text-sm">Submit transaction hash & get points</p>
          </div>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <h4 className="mb-3 text-yellow-800">⚠️ Important Notes</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Only send USDT via BSC (Binance Smart Chain) network</li>
          <li>• Minimum transaction amount: $10 USDT</li>
          <li>• Points will be credited after transaction confirmation (usually 1-5 minutes)</li>
          <li>• Make sure to submit the correct transaction hash</li>
          <li>• Contact support if you don't receive points within 30 minutes</li>
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
