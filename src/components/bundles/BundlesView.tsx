import { useState } from "react";
import { useBundles } from "./hooks/useBundles";
import { BundleCard } from "./components/BundleCard";
import { HowBundlesWork } from "./HowBundlesWork";
import { BundlesViewProps } from "./types";


export function BundlesView(props: BundlesViewProps) {
  const { bundles, loading, error, fetchBundles } = useBundles(props.apiUrl);
  const [activeBundle, setActiveBundle] = useState<string | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <button onClick={fetchBundles}>Retry</button>;

  return (
    <div className="space-y-6">
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

      <HowBundlesWork />
    </div>
  );
}
