import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PackagesViewProps, Package } from "./types";
import { usePackages } from "./hooks/usePackages";
import { PackageCard } from "./components/PackageCard";
import { PackagesHeader } from "./components/PackagesHeader";
import { HowToTopup } from "./components/HowToTopup";
import { ImportantNotes } from "./components/ImportantNotes";
import { TopupModal } from "../topup/modal/TopupModal";

export function PackagesView({ apiUrl, onPointsAdded }: PackagesViewProps) {
  const { packages, loading, error, refetch } = usePackages(apiUrl);
  const [selected, setSelected] = useState<Package | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PackagesHeader packages={packages} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onSelect={setSelected} />
        ))}
      </div>

      <HowToTopup />
      <ImportantNotes />

      {selected && (
        <TopupModal
          package={selected}
          isOpen
          onClose={() => setSelected(null)}
          onSuccess={(points) => {
            onPointsAdded(points, selected.name);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
