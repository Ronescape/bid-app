import { Coins, Shield, Zap, Gift, Clock, Sparkles, Badge } from "lucide-react";
import { Package } from "../types";
import { getTotalPoints } from "../utils/packageHelpers";
import { Card } from "../../ui/card";

interface Props {
  packages: Package[];
}

export function PackagesHeader({ packages }: Props) {
  const stats = [
    {
      label: "Points",
      icon: Coins,
      value: packages.reduce((sum, pkg) => sum + getTotalPoints(pkg), 0).toLocaleString(),
      gradient: "from-purple-600 to-blue-600",
    },
    {
      label: "Secure",
      icon: Shield,
      value: "USDT BSC",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      label: "Instant",
      icon: Zap,
      value: "Delivery",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Max Bonus",
      icon: Gift,
      value: `${Math.max(...packages.map((p) => p.bonus || 0))}%`,
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 text-center bg-slate-800/30 border-slate-700/50">
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-white text-lg">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Hero */}
      <Card className="relative overflow-hidden p-6 bg-slate-800/50 border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40" />
        <div className="relative z-10">
          <h2 className="text-white mb-2">Points Packages</h2>
          <p className="text-slate-400 mb-4">Buy points using USDT (BSC Network) to place bids</p>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center bg-white/10 text-white border-0 text-xs rounded-full px-2 py-1 font-semibold">
              <Clock className="w-3 h-3 mr-1 inline" /> Instant Delivery
            </div>
            <div className="flex items-center bg-white/10 text-white border-0 text-xs rounded-full px-2 py-1 font-semibold">
              <Shield className="w-3 h-3 mr-1 inline" /> Secure Payment
            </div>
            <div className="flex items-center bg-white/10 text-white border-0 text-xs rounded-full px-2 py-1 font-semibold">
              <Sparkles className="w-3 h-3 mr-1 inline" /> 24/7 Support
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
