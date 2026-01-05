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
  const totalPoints = getTotalPoints(pkg);

  return (
    <Card
      className="group relative overflow-hidden bg-slate-800/30 border-slate-700/50 hover:shadow-xl cursor-pointer"
      onClick={() => onSelect(pkg)}
    >
      {pkg.popular && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 text-xs rounded">
          ⭐ Popular
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${getGradient(
              pkg.weight
            )} rounded-full flex items-center justify-center text-white`}
          >
            {icons[pkg.icon]}
          </div>
        </div>

        <h3 className="text-center text-white mb-2">{pkg.name}</h3>

        <div className="text-center mb-3">
          <div className="text-3xl text-purple-400">
            {totalPoints.toLocaleString()}
          </div>
          {pkg.bonus && (
            <Badge className="mt-1 bg-green-500">
              <Gift className="w-3 h-3 mr-1" /> +{pkg.bonus}%
            </Badge>
          )}
        </div>

        <div className="text-center text-white mb-4">${pkg.price}</div>

        <Button className={`w-full bg-gradient-to-r ${getGradient(pkg.weight)}`}>
          Buy Now
        </Button>
      </div>
    </Card>
  );
}
