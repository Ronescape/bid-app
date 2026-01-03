import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Zap, Crown, Coins, Shield, Clock, Gift, Loader2 } from 'lucide-react';
import { TopupModal } from './TopupModal';
import { toast } from 'sonner';
import { apiGet } from '../utils/apiUtility';
import { ApiPackage, Package } from '../data/gameData';

interface PackagesViewProps {
  onPointsAdded: (points: number, packageName?: string) => Promise<void>;
  apiUrl: string;
  currentPoints?: number;
}

export function PackagesView({ onPointsAdded, apiUrl }: PackagesViewProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
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
        `${apiUrl}/packages`,
        headers,
        (responseData) => {
          if (responseData.success && responseData.data) {
            const transformedPackages = responseData.data.map(transformApiPackage);
            // Sort by weight
            const sortedPackages = transformedPackages.sort((a : any, b : any) => a.weight - b.weight);
            setPackages(sortedPackages);
          } else {
            throw new Error(responseData.message || 'Failed to fetch packages');
          }
        },
        (error) => {
          setError(error.message || 'Failed to load packages');
          toast.error('Failed to load packages');
        }
      );
    } catch (error) {
      setError('Unexpected error occurred');
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const transformApiPackage = (apiPkg: ApiPackage): Package => {
    // Determine icon based on name or weight
    const getIconFromName = (name: string): 'coins' | 'sparkles' | 'zap' | 'crown' => {
      if (name.toLowerCase().includes('starter')) return 'coins';
      if (name.toLowerCase().includes('silver')) return 'sparkles';
      if (name.toLowerCase().includes('gold')) return 'zap';
      if (name.toLowerCase().includes('diamond')) return 'crown';
      return 'coins';
    };

    return {
      id: apiPkg.id.toString(),
      name: apiPkg.name,
      points: apiPkg.points,
      price: apiPkg.amount,
      tag: apiPkg.tag || undefined,
      icon: getIconFromName(apiPkg.name),
      popular: apiPkg.is_popular,
      bonus: apiPkg.bonus,
      photo: apiPkg.photo.url,
      weight: apiPkg.weight
    };
  };

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

  const getGradient = (weight: number) => {
    switch (weight) {
      case 1:
        return 'from-gray-400 via-gray-500 to-gray-600';
      case 2:
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 3:
        return 'from-yellow-400 via-orange-500 to-orange-600';
      case 4:
        return 'from-purple-500 via-purple-600 to-pink-600';
      default:
        return 'from-purple-600 via-blue-600 to-pink-600';
    }
  };

  const getTotalPoints = (pkg: Package) => {
    if (pkg.bonus && pkg.bonus > 0) {
      const bonusPoints = Math.floor(pkg.points * (pkg.bonus / 100));
      return pkg.points + bonusPoints;
    }
    return pkg.points;
  };

  const renderPackageCard = (pkg: Package) => {
    const totalPoints = getTotalPoints(pkg);
    
    return (
      <Card 
        key={pkg.id}
        className={`group relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/70 transition-all cursor-pointer bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50 ${
          pkg.popular ? 'border-2 border-yellow-400' : ''
        }`}
        onClick={() => setSelectedPackage(pkg)}
      >
        {pkg.popular && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 text-xs font-semibold rounded-bl-lg rounded-tr-lg z-10">
            ⭐ Popular
          </div>
        )}
        
        {!pkg.popular && pkg.tag && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl shadow-purple-500/50 text-xs">
              {pkg.tag}
            </Badge>
          </div>
        )}

        <div className={`p-6 ${pkg.popular ? 'pt-10' : ''}`}>
          {/* Package Image */}
          <div className="relative w-full h-32 mb-4 overflow-hidden rounded-xl">
            <img 
              src={pkg.photo} 
              alt={pkg.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback to gradient if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center ${getGradient(pkg.weight)} rounded-xl">
                      ${getIcon(pkg.icon).props.children}
                    </div>
                  `;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 right-2">
              <div className={`w-10 h-10 bg-gradient-to-br ${getGradient(pkg.weight)} rounded-full flex items-center justify-center text-white shadow-xl`}>
                {getIcon(pkg.icon)}
              </div>
            </div>
          </div>

          {/* Package Name */}
          <h3 className="text-center text-white font-medium mb-3">{pkg.name}</h3>

          {/* Points Display */}
          <div className="text-center mb-4">
            <div className="text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total Points</div>
            {pkg.bonus && pkg.bonus > 0 && (
              <div className="text-xs text-green-400 mt-1">
                (Base: {pkg.points.toLocaleString()} + {pkg.bonus}% Bonus)
              </div>
            )}
          </div>

          {/* Bonus Badge */}
          {pkg.bonus && pkg.bonus > 0 && (
            <div className="text-center mb-4">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-xl shadow-green-500/50">
                <Gift className="w-3 h-3 mr-1" />
                +{pkg.bonus}% Bonus
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
            className={`w-full transition-all shadow-xl border-0 bg-gradient-to-r ${getGradient(pkg.weight)} hover:shadow-purple-500/70`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedPackage(pkg);
            }}
          >
            Buy Now
          </Button>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <p className="text-slate-400">Loading packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load packages: {error}</p>
        <Button 
          onClick={fetchPackages}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          Retry
        </Button>
      </div>
    );
  }

  const stats = [
    {
      label: 'Points',
      description: 'For Bidding',
      icon: Coins,
      gradient: 'from-purple-600 to-blue-600',
      value: packages.reduce((sum, pkg) => sum + getTotalPoints(pkg), 0).toLocaleString()
    },
    {
      label: 'Secure',
      description: 'USDT BSC',
      icon: Shield,
      gradient: 'from-blue-600 to-cyan-500',
      value: '✓'
    },
    {
      label: 'Instant',
      description: 'Delivery',
      icon: Zap,
      gradient: 'from-green-500 to-emerald-500',
      value: '✓'
    },
    {
      label: 'Max Bonus',
      description: 'Percentage',
      icon: Gift,
      gradient: 'from-yellow-500 to-orange-500',
      value: `${Math.max(...packages.map(pkg => pkg.bonus || 0))}%`
    }
  ];

  const steps = [
    { number: 1, title: 'Choose Package', description: 'Select points bundle' },
    { number: 2, title: 'Scan QR Code', description: 'Or copy wallet address' },
    { number: 3, title: 'Send USDT', description: 'Via BSC network only' },
    { number: 4, title: 'Get Points', description: 'Submit transaction hash' }
  ];

  const notes = [
    'Only send USDT via BSC (Binance Smart Chain) network',
    'Minimum transaction amount: $10 USDT',
    'Points will be credited after transaction confirmation (usually 1-5 minutes)',
    'Make sure to submit the correct transaction hash',
    'Contact support if you don\'t receive points within 30 minutes'
  ];

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-1">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 text-center bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-lg text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </Card>
        ))}
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
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl">
                <div className="text-lg font-semibold">{step.number}</div>
              </div>
              <p className="text-white text-sm font-medium">{step.title}</p>
              <p className="text-slate-400 text-xs mt-1">{step.description}</p>
            </div>
          ))}
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
          {notes.map((note, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Topup Modal */}
      {selectedPackage && (
        <TopupModal
          package={selectedPackage}
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onSuccess={(points) => {
            onPointsAdded(points, selectedPackage.name);
            setSelectedPackage(null);
          }}
        />
      )}
    </div>
  );
}