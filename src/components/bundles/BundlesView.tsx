import { useState } from "react";
import { useBundles } from "./hooks/useBundles";
import { BundleCard } from "./components/BundleCard";
import { HowBundlesWork, BundleRewards } from "./HowBundlesWork";
import { BundlesViewProps } from "./types";
import { BundleRewardsHistory } from "./BundleRewardsHistory";
import { Loader2 } from "lucide-react";


export function BundlesView(props: BundlesViewProps) {
  const { bundles, loading, error, fetchBundles } = useBundles(props.apiUrl);
  const [activeBundle, setActiveBundle] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }
  if (error) return <button onClick={fetchBundles}>Retry</button>;

  return (
    <div className="space-y-6">
      <BundleRewards />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bundles.map((b) => (
          <BundleCard
            key={b.id}
            bundle={b}
            active={activeBundle === b.id}
            disabled={props.userPoints < b.pointsCost}
            onPurchase={() => setActiveBundle(b.id)}
          />
        ))}
      </div>
      <BundleRewardsHistory />
      <HowBundlesWork />
    </div>
  );
}
