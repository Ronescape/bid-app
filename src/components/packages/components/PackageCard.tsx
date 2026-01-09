import { Coins, Sparkles, Zap, Crown, Badge, Gift } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Package } from "../types";
import { getTotalPoints, getGradient } from "../utils/packageHelpers";


const icons = {
  coins: <Coins className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
  crown: <Crown className="w-6 h-6" />,
};

interface Props {
  pkg: Package;
  onSelect: (pkg: Package) => void;
}

export function PackageCard({ pkg, onSelect }: Props) {

  return (
    <Card
      className="group relative overflow-hidden bg-slate-800/30 border-slate-700/50 hover:shadow-xl cursor-pointer"
      onClick={() => onSelect(pkg)}
    >
      {pkg.popular && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 text-xs font-semibold rounded-bl-lg rounded-tr-lg z-10">
          ⭐ Most Popular
        </div>
      )}

      {!pkg.popular && pkg.tag && (
        <div className="absolute top-2 right-2">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl shadow-purple-500/50 text-xs rounded-full px-2 py-1 font-semibold">
            {pkg.tag}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-center mb-4">
          <img src={pkg.photo.url} alt="CoinBid Logo" className="w-12 h-[100px] object-contain" />
        </div>

        <h3 className="text-center text-white mb-2">{pkg.name}</h3>

        <div className="text-center mb-3">
          <div className="text-3xl text-purple-400">
            {pkg.points.toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Points</div>
        </div>

        {pkg.bonus > 0 && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-emerald-500/50 text-xs rounded-full px-3 py-1.5 font-semibold">
              <span className="text-sm">🎁</span>
              +{pkg.bonus} Bonus
            </div>
          </div>
        )}

        <div className="text-center text-white mb-4">${pkg.price}</div>

        <Button className={`w-full bg-gradient-to-r ${getGradient(pkg.weight)}`}>
          Buy Now
        </Button>
      </div>
    </Card>
  );
}
