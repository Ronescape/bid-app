
import { Coins, Sparkles, Zap, Crown } from "lucide-react";
import { JSX } from "react";
import { Bundle } from "../../../data/gameData";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";

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
  console.log("Bundle photo URL:", bundle?.photo);
  return (
    <Card className="relative bg-slate-800/30 border-slate-700/50 rounded-lg overflow-hidden">
      {bundle.popular && (
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 text-white flex items-center justify-center text-sm font-semibold rounded-t-lg">
          ⭐ Most Popular
        </div>
      )}

      <div className="p-6 space-y-4 mt-6">
        <div className="flex justify-center">
            <img src={bundle?.photo} alt="" className="w-12 h-[100px] object-contain" />
        </div>
        <h3 className="text-center text-white">{bundle.name}</h3>

        <div className="text-center">
          <div className="text-3xl text-purple-400">
            {bundle.pointsCost.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Points</div>
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
