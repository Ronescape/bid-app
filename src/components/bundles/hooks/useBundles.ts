import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bundle } from "../../../data/gameData";
import { transformApiBundle } from "../utils";
import { apiGet } from "../../../utils/apiUtility";

export const useBundles = (apiUrl: string) => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBundles = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("bidwin_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      await apiGet(
        `${apiUrl}/bundles`,
        headers,
        (res) => {
          const sorted = res.data
            .map(transformApiBundle)
            .sort((a: any, b: any) => a.weight - b.weight);

          setBundles(sorted);
        },
        (err) => {
          setError(err.message);
          toast.error("Failed to load bundles");
        }
      );
    } catch {
      setError("Unexpected error");
      toast.error("Failed to load bundles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  return { bundles, loading, error, fetchBundles };
};
