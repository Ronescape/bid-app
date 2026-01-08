import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiGet, apiPost } from "../../../utils/apiUtility";
import { ApiPackage, Package } from "../types";
import { transformApiPackage } from "../utils/packageHelpers";

export const usePackages = (apiUrl: string) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [submitHashLoading, setSubmitHashLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("bidwin_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (token) headers.Authorization = `Bearer ${token}`;

      await apiGet(
        `${apiUrl}/packages`,
        headers,
        (res) => {
          if (res.success && res.data) {
            const sorted = res.data.map((p: ApiPackage) => transformApiPackage(p)).sort((a: any, b: any) => a.weight - b.weight);
            setPackages(sorted);
          } else {
            throw new Error(res.message);
          }
        },
        (err) => {
          setError(err.message);
          toast.error("Failed to load packages");
        }
      );
    } catch {
      setError("Unexpected error occurred");
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const purchase = async (packageId: string, paymentMethod: string) => {
    setPurchaseLoading(true);

    try {
      const token = localStorage.getItem("bidwin_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (token) headers.Authorization = `Bearer ${token}`;

      const payloadBody = {
        payment_method: paymentMethod,
      };

      const response = await fetch(`${apiUrl}/packages/${packageId}/purchase`, {
        method: "POST",
        headers,
        body: JSON.stringify(payloadBody),
      });

      const data = await response.json();

      if (data.success && data.data) {
        toast.success("Payment details generated!");
        return data;
      } else {
        throw new Error(data.message || "Failed to process purchase");
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error(error.message || "Failed to process purchase");
      throw error;
    } finally {
      setPurchaseLoading(false);
    }
  };

  const submitHash = async (referenceId: string, transactionHash: string) => {
    setSubmitHashLoading(true);

    try {
      const token = localStorage.getItem("bidwin_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (token) headers.Authorization = `Bearer ${token}`;

      const payloadBody = {
        txn_hash: transactionHash,
      };

      console.log("Submitting transaction hash for reference:", referenceId);

      const response = await fetch(`${apiUrl}/topup-requests/${referenceId}/txn-hash/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify(payloadBody),
      });

      const data = await response.json();
      console.log("Submit hash response:", data);

      if (data.success) {
        toast.success(data.message || "Transaction submitted successfully!");
        return data;
      } else {
        throw new Error(data.message || "Failed to verify transaction");
      }
    } catch (error: any) {
      console.error("Error submitting transaction hash:", error);
      toast.error(error.message || "Failed to verify transaction");
      throw error;
    } finally {
      setSubmitHashLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    purchaseLoading,
    submitHashLoading,
    error,
    refetch: fetchPackages,
    purchase,
    submitHash,
  };
};
