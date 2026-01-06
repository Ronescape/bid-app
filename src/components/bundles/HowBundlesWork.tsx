import { Badge } from "lucide-react";
import { Card } from "../ui/card";

const steps = ["Purchase a bundle with your points", "Bundle activates immediately", "Receive daily points & USDT automatically", "Earn passive income for the duration"];

export function HowBundlesWork() {
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50">
      <h3 className="mb-4 text-white">How Bundles Work</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-2 text-white">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-xl shadow-purple-500/50">
              {i + 1}
            </div>
              {s}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function BundleRewards() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 border border-purple-500/30">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10">
          <h2 className="text-white mb-2">Investment Bundles</h2>
          <p className="text-white/90 mb-4">Buy bundles with points and earn daily rewards in points & USDT</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="bg-white/10 text-white border-white/20 backdrop-blur-sm rounded-full px-2 py-1">Daily Rewards</div>
            <div className="bg-white/10 text-white border-white/20 backdrop-blur-sm rounded-full px-2 py-1">Auto Distribution</div>
            <div className="bg-white/10 text-white border-white/20 backdrop-blur-sm rounded-full px-2 py-1">Passive Income</div>
          </div>
        </div>
      </div>
    </div>
  );
}
