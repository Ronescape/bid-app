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
import { toast } from "react-hot-toast";

export function PackagesView({ apiUrl, onPointsAdded }: PackagesViewProps) {
  const { packages, loading, purchaseLoading, error, refetch, purchase, submitHash } = usePackages(apiUrl);
  const [selected, setSelected] = useState<Package | null>(null);
  const [currentReference, setCurrentReference] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState("");
  const hasSubscribedRef = useRef(false);
  const lastTransactionRef = useRef<string | null>(null);

  const handleTopupStatusUpdate = useCallback(
    (payload: any) => {
      console.log("📦 [Pusher] Topup status update received:", payload);

      // Extract reference from the payload - check both field names
      const reference = payload.referenceCode || payload.reference;
      console.log("📦 [Pusher] Extracted reference:", reference);

      // Check ALL possible places where we might have stored the reference
      const possibleReferences = [currentReference, lastTransactionRef.current, localStorage.getItem("lastTopupReference"), sessionStorage.getItem("currentTopupReference")].filter((ref) => ref);

      console.log("📦 [Pusher] Possible references to match:", possibleReferences);

      // Check if this event matches ANY of our stored references
      const isOurTransaction = possibleReferences.some((ref) => ref === reference);

      if (isOurTransaction) {
        console.log("✅ [Pusher] This is OUR transaction!");
        console.log("📦 [Pusher] Status:", payload.status);

        // Update the current reference if it wasn't already set
        if (!currentReference && reference) {
          setCurrentReference(reference);
        }

        // Update modal state based on payload status
        switch (payload.status) {
          case "pending":
          case "confirming":
          case "processing":
            console.log("🔄 [Pusher] Transaction is confirming");
            setVerificationStatus("confirming");
            setModalStep(4);
            break;
          case "completed":
          case "success":
            console.log("🎉 [Pusher] Transaction completed - MOVING TO STEP 5!");
            setVerificationStatus("completed");
            setModalStep(5); // This sets the modal to step 5!

            // Store in localStorage for persistence
            if (reference) {
              localStorage.setItem("lastCompletedReference", reference);
            }

            // Add points
            const points = payload.credits || payload.points || payload.amount;
            if (points > 0) {
              setTimeout(() => {
                const packageName = payload.package_name || selected?.name || "Package";
                onPointsAdded(points, packageName);
                toast.success(`✅ ${points} points added to your account!`);
              }, 1000);
            }
            break;
          case "failed":
          case "error":
          case "cancelled":
            console.log("❌ [Pusher] Transaction failed");
            setVerificationStatus("failed");
            setModalStep(4);
            toast.error("Transaction failed. Please try again.");
            break;
        }
      } else {
        console.log("⚠️ [Pusher] Event doesn't match any known references");
        console.log("   Event reference:", reference);
        console.log("   Current reference:", currentReference);
        console.log("   Last transaction ref:", lastTransactionRef.current);
      }

      // Always refetch packages when any transaction completes
      if (payload.status === "completed" || payload.status === "success") {
        const points = payload.credits || payload.points || payload.amount;
        if (points > 0) {
          console.log("💰 [Pusher] Refetching packages due to completed transaction");
          refetch();
        }
      }
    },
    [currentReference, onPointsAdded, refetch, selected]
  );

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
      console.log("🔌 [Pusher] Setting up Pusher subscription for user:", userId);

      // Add comprehensive connection state logging
      pusher.connection.bind("state_change", (states: any) => {
        console.log("🔄 [Pusher] State changed:", states.current, "->", states.previous);
      });

      pusher.connection.bind("connecting", () => {
        console.log("🔄 [Pusher] Connecting...");
      });

      pusher.connection.bind("connected", () => {
        console.log("✅ [Pusher] Connected successfully!");
      });

      pusher.connection.bind("disconnected", () => {
        console.log("❌ [Pusher] Disconnected");
      });

      pusher.connection.bind("error", (error: any) => {
        console.error("🚨 [Pusher] Connection error:", error);
      });

      // Subscribe to user channel with enhanced debugging
      const channelName = `staging.user.${userId}`;
      console.log(`📡 [Pusher] Subscribing to channel: ${channelName}`);

      // Direct subscription for debugging
      const channel = pusher.subscribe(channelName);

      channel.bind("pusher:subscription_succeeded", () => {
        console.log(`✅ [Pusher] Successfully subscribed to ${channelName}`);
      });

      channel.bind("pusher:subscription_error", (error: any) => {
        console.error(`❌ [Pusher] Subscription error for ${channelName}:`, error);
      });

      // Bind to all events on this channel for debugging
      channel.bind_global((eventName: string, data: any) => {
        if (!eventName.includes("pusher:")) {
          console.log(`📨 [Pusher] Channel event: ${eventName}`, data);
        }
      });

      // Also use the singleton method
      pusherSingleton.subscribeToUserChannel(userId.toString(), handleTopupStatusUpdate);

      hasSubscribedRef.current = true;
    }

    return () => {
      console.log("🧹 [Pusher] PackagesView cleanup - keeping Pusher alive");
    };
  }, [handleTopupStatusUpdate]);

  // Restore previous transaction reference on mount
  useEffect(() => {
    const savedReference = localStorage.getItem("lastTopupReference");
    const savedTimestamp = localStorage.getItem("lastTopupTimestamp");

    if (savedReference && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const now = Date.now();
      const hoursSince = (now - timestamp) / (1000 * 60 * 60);

      // Only restore if it was within the last 2 hours
      if (hoursSince < 2) {
        console.log("🔄 [PackagesView] Restoring previous reference:", savedReference);
        setCurrentReference(savedReference);
        lastTransactionRef.current = savedReference;
      } else {
        // Clean up old reference
        localStorage.removeItem("lastTopupReference");
        localStorage.removeItem("lastTopupTimestamp");
      }
    }
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
        <button onClick={refetch} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
          Retry
        </button>
      </div>
    );
  }

  const handleSubmitHash = async (referenceId: string, transactionHash: string) => {
    try {
      console.log("📝 [SubmitHash] Submitting hash:", { referenceId, transactionHash });
      const response = await submitHash(referenceId, transactionHash);

      console.log("📝 [SubmitHash] Full response:", response);

      // Try to extract reference from different possible locations in the response
      let reference = null;

      if (response?.data?.reference) {
        reference = response.data.reference;
      } else if (response?.data?.referenceCode) {
        reference = response.data.referenceCode;
      } else if (response?.reference) {
        reference = response.reference;
      } else if (response?.referenceCode) {
        reference = response.referenceCode;
      } else if (referenceId) {
        // Use the referenceId passed to the function
        reference = referenceId;
      }

      if (reference) {
        console.log("✅ [SubmitHash] Reference found:", reference);

        // Store in multiple places to ensure we don't lose it
        setCurrentReference(reference);
        lastTransactionRef.current = reference;

        // Store in localStorage for persistence across page refreshes
        localStorage.setItem("lastTopupReference", reference);
        localStorage.setItem("lastTopupTimestamp", Date.now().toString());

        console.log("✅ [SubmitHash] Reference stored in:", {
          currentReference: reference,
          lastTransactionRef: lastTransactionRef.current,
          localStorage: localStorage.getItem("lastTopupReference"),
        });

        // Move to waiting step
        setModalStep(4);
        setVerificationStatus("confirming");

        toast.success("Transaction submitted! Waiting for confirmation...");
      } else {
        console.warn("⚠️ [SubmitHash] No reference found in response:", response);
        toast.error("Could not get transaction reference");
      }

      return response;
    } catch (error) {
      console.error("❌ [SubmitHash] Error:", error);
      toast.error("Failed to submit transaction");
      throw error;
    }
  };

  const handleModalClose = () => {
    console.log("🚪 [Modal] Closing modal, clearing references");
    setSelected(null);

    // Don't clear currentReference immediately - keep it for Pusher events
    // Only clear if we're not in step 4 or 5 (waiting/completed)
    if (modalStep !== 4 && modalStep !== 5) {
      setCurrentReference(null);
      lastTransactionRef.current = null;
    }

    setModalStep(1);
    setVerificationStatus("");
  };

  const handleTransactionComplete = () => {
    console.log("✅ [Transaction] Complete, cleaning up references");
    setCurrentReference(null);
    lastTransactionRef.current = null;
    localStorage.removeItem("lastTopupReference");
    localStorage.removeItem("lastTopupTimestamp");
    setSelected(null);
    setModalStep(1);
    setVerificationStatus("");
  };

  const handleModalSuccess = (points: number) => {
    console.log("🎯 [Modal] Success callback triggered");
    onPointsAdded(points, selected?.name || "Package");
    handleTransactionComplete();
  };

  return (
    <div className="space-y-6">
      <PackagesHeader packages={packages} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onSelect={setSelected} />
        ))}
      </div>

      <HowToTopup />
      <ImportantNotes />

      {selected && <TopupModal package={selected} isOpen onClose={handleModalClose} onTransactionComplete={handleTransactionComplete} onSuccess={handleModalSuccess} onPurchase={() => purchase(selected.id, "crypto_payment")} onSubmitHash={handleSubmitHash} isPurchaseLoading={purchaseLoading} currentStep={modalStep} onStepChange={setModalStep} verificationStatus={verificationStatus} onVerificationStatusChange={setVerificationStatus} />}
    </div>
  );
}
