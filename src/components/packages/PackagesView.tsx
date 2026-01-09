import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { PackagesViewProps, Package } from "./types";
import { usePackages } from "./hooks/usePackages";
import { PackageCard } from "./components/PackageCard";
import { PackagesHeader } from "./components/PackagesHeader";
import { HowToTopup } from "./components/HowToTopup";
import { ImportantNotes } from "./components/ImportantNotes";
import { TopupModal } from "../topup/modal/TopupModal";
import { getUserId } from "../../data/userData";
import { pusherSingleton } from "../../utils/pusherSingleton";

export function PackagesView({ apiUrl, onPointsAdded }: PackagesViewProps) {
  const { packages, loading, purchaseLoading, error, refetch, purchase, submitHash } = usePackages(apiUrl);
  const [selected, setSelected] = useState<Package | null>(null);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [currentReference, setCurrentReference] = useState<string | null>(null);
  const [isPusherReady, setIsPusherReady] = useState(false);
  const hasSubscribedRef = useRef(false);

  const handleTopupStatusUpdate = useCallback((payload: any) => {
    console.log("📦 Topup status update received:", payload);
    setLastEvent(payload);

    if (currentReference && payload.reference === currentReference) {
      console.log("📦 Update for current transaction:", payload);
    }

    if (payload.status === "completed" || payload.status === "success") {
      const points = payload.points || payload.amount;

      if (points) {
        onPointsAdded(points, payload.package_name || selected?.name || "Package");

        if (selected && selected.id === payload.package_id) {
          console.log("✅ Topup successful, closing modal");
          setSelected(null);
        }

        refetch();
      }
    }
  }, [currentReference, onPointsAdded, refetch, selected]);

  useEffect(() => {
    const userId = getUserId();
    if (userId == null) {
      console.error("No user data found in localStorage");
      return;
    }

    // Initialize Pusher singleton
    const pusher = pusherSingleton.initialize();
    if (!pusher) {
      console.warn("Pusher initialization failed");
      return;
    }

    // Only subscribe once
    if (!hasSubscribedRef.current) {
      console.log("Setting up Pusher subscription");
      pusherSingleton.subscribeToUserChannel(userId.toString(), handleTopupStatusUpdate);
      hasSubscribedRef.current = true;
      
      // Listen for connection events
      pusher.connection.bind('connected', () => {
        console.log("Pusher connected in PackagesView");
        setIsPusherReady(true);
      });

      pusher.connection.bind('disconnected', () => {
        console.log("Pusher disconnected in PackagesView");
        setIsPusherReady(false);
      });

      // Check current connection state
      if (pusher.connection.state === 'connected') {
        setIsPusherReady(true);
      }
    }

    return () => {
      console.log("PackagesView cleanup - not unsubscribing to keep Pusher alive");
    };
  }, [handleTopupStatusUpdate]); // Only depend on the memoized callback

  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
        <p className="text-slate-400">Loading packages...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={refetch} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
          Retry
        </button>
      </div>
    );
  }

  const handleSubmitHash = async (referenceId: string, transactionHash: string) => {
    try {
      const response = await submitHash(referenceId, transactionHash);
      // Store the reference for Pusher updates
      if (response?.data?.reference) {
        setCurrentReference(response.data.reference);
      }
      return response;
    } catch (error) {
      console.error("Submit hash error:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Last Event Debug (optional) */}
      {lastEvent && process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-50 p-3 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-purple-500 max-w-xs">
          <h4 className="text-xs font-semibold text-purple-400 mb-1">Last Topup Event</h4>
          <pre className="text-xs text-slate-300 overflow-auto">{JSON.stringify(lastEvent, null, 2)}</pre>
        </div>
      )}

      {/* Pusher status indicator for debugging */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-4 right-4 z-50 p-2 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-purple-500 text-xs">
          <div className={`w-2 h-2 rounded-full mr-2 inline-block ${isPusherReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
          Pusher: {isPusherReady ? 'Connected' : 'Disconnected'}
        </div>
      )}

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
          onClose={() => {
            setSelected(null);
            setCurrentReference(null); // Reset reference
          }}
          onSuccess={(points) => {
            onPointsAdded(points, selected.name);
            setSelected(null);
            setCurrentReference(null); // Reset reference
          }}
          onPurchase={() => purchase(selected.id, "crypto_payment")}
          onSubmitHash={handleSubmitHash}
          isPurchaseLoading={purchaseLoading}
        />
      )}
    </div>
  );
}