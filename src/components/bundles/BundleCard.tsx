
import { Coins, Sparkles, Zap, Crown } from "lucide-react";
import { JSX } from "react";
import { Bundle } from "../../data/gameData";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const iconMap: Record<string, JSX.Element> = {
  coins: <Coins className="w-8 h-8" />,
  sparkles: <Sparkles className="w-8 h-8" />,
  zap: <Zap className="w-8 h-8" />,
  crown: <Crown className="w-8 h-8" />,
};

interface Props {
  bundle: Bundle;
  active: boolean;
  disabled: boolean;
  onPurchase: () => void;
}

export function BundleCard({ bundle, active, disabled, onPurchase }: Props) {
  return (
    <Card className="relative bg-slate-800/30 border-slate-700/50">
      {bundle.popular && (
        <div className="absolute top-0 inset-x-0 text-xs text-center bg-purple-600 text-white py-1">
          ⭐ Popular
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex justify-center">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${bundle.gradient} flex items-center justify-center`}>
            {iconMap[bundle.icon]}
          </div>
        </div>

        <h3 className="text-center text-white">{bundle.name}</h3>

        <div className="text-center">
          <div className="text-3xl text-purple-400">
            {bundle.pointsCost.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Points</div>
        </div>

        <Button
          disabled={disabled || active}
          onClick={onPurchase}
          className={`w-full bg-gradient-to-r ${bundle.gradient}`}
        >
          {active ? "Active" : "Purchase"}
        </Button>
      </div>
    </Card>
  );
}
