import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiGet } from "../../../utils/apiUtility";
import { ApiPackage, Package } from "../types";
import { transformApiPackage } from "../utils/packageHelpers";

export const usePackages = (apiUrl: string) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
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
            const sorted = res.data
              .map((p: ApiPackage) => transformApiPackage(p))
              .sort((a: any, b: any) => a.weight - b.weight);
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

  useEffect(() => {
    fetchPackages();
  }, []);

  return { packages, loading, error, refetch: fetchPackages };
};
