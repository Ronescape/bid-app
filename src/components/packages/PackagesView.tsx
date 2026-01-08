// PackagesView.tsx
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { PackagesViewProps, Package } from "./types";
import { usePackages } from "./hooks/usePackages";
import { PackageCard } from "./components/PackageCard";
import { PackagesHeader } from "./components/PackagesHeader";
import { HowToTopup } from "./components/HowToTopup";
import { ImportantNotes } from "./components/ImportantNotes";
import { TopupModal } from "../topup/modal/TopupModal";
import Pusher from "pusher-js";
import { getEnv } from "../../utils/GeneralUtility";
import { getUserId } from "../../data/userData";

export const PUSHER_KEY = getEnv("VITE_PUSHER_APP_KEY");
export const PUSHER_CLUSTER = getEnv("VITE_PUSHER_CLUSTER");

export function PackagesView({ apiUrl, onPointsAdded }: PackagesViewProps) {
  const { packages, loading, error, refetch, purchase } = usePackages(apiUrl);
  const [selected, setSelected] = useState<Package | null>(null);
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<any>(null);
  const [lastEvent, setLastEvent] = useState<any>(null);

  useEffect(() => {
    if (!selected) {
      if (pusherRef.current) {
        console.log("Cleaning up Pusher connection (modal closing)");
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      return;
    }

    console.log("Initializing Pusher for topup status updates");
    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }

    const userId = getUserId();
    if (userId == null) {
      console.error("No user data found in localStorage");
      return;
    }

    try {


      if (!PUSHER_KEY) {
        console.warn("Pusher app key not configured");
        return;
      }

      const pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
        activityTimeout: 120000,
        pongTimeout: 30000,
      });

      pusherRef.current = pusher;

      const channelName = `staging.user.${userId}`;
      console.log(`Subscribing to channel: ${channelName} for topup updates`);
      
      const channel = pusher.subscribe(channelName);
      channelRef.current = channel;

      channel.bind('pusher:subscription_succeeded', () => {
        console.log("✅ Successfully subscribed to topup channel");
      });

      channel.bind('pusher:subscription_error', (error: any) => {
        console.error("❌ Failed to subscribe to topup channel:", error);
      });

      const handleTopupStatusUpdate = (payload: any) => {
        console.log("📦 Topup status update received:", payload);
        setLastEvent(payload);

        if (payload.status === 'completed' || payload.status === 'success') {
          const points = payload.points || payload.amount;
          
          if (points) {
            onPointsAdded(points, payload.package_name || selected?.name || "Package");
            
            if (selected && selected.id === payload.package_id) {
              console.log("✅ Topup successful, closing modal");
              setSelected(null);
            }
            
            // Refresh packages list
            refetch();
          }
        }
      };

      channel.bind('topup.status.update', handleTopupStatusUpdate);

      pusher.connection.bind('error', (err: any) => {
        console.error('Pusher connection error:', err);
      });

      return () => {
        console.log("🧹 Cleaning up Pusher connection");
        if (channelRef.current) {
          channelRef.current.unbind('topup.status.update', handleTopupStatusUpdate);
          channelRef.current.unbind('pusher:subscription_succeeded');
          channelRef.current.unbind('pusher:subscription_error');
          channelRef.current.unsubscribe();
          channelRef.current = null;
        }
        if (pusherRef.current) {
          pusherRef.current.disconnect();
          pusherRef.current = null;
        }
      };

    } catch (error) {
      console.error("Error initializing Pusher:", error);
    }
  }, [selected, apiUrl, onPointsAdded, refetch]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (pusherRef.current) {
        console.log("Component unmounting, cleaning up Pusher");
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      if (channelRef.current) {
        channelRef.current.unbind_all();
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []);

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
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Last Event Debug (optional) */}
      {lastEvent && process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 p-3 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-purple-500 max-w-xs">
          <h4 className="text-xs font-semibold text-purple-400 mb-1">Last Topup Event</h4>
          <pre className="text-xs text-slate-300 overflow-auto">
            {JSON.stringify(lastEvent, null, 2)}
          </pre>
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
          onClose={() => setSelected(null)}
          onSuccess={(points) => {
            onPointsAdded(points, selected.name);
            setSelected(null);
          }}
          onPurchase={purchase}
        />
      )}
    </div>
  );
}