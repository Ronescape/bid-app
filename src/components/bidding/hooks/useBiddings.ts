import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiGet } from "../../../utils/apiUtility";
import { BiddingItem } from "../../../data/gameData";
import { transformApiItem } from "../utils/biddingTransform";

export function useBiddings(apiUrl: string) {
  const [items, setItems] = useState<BiddingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("bidwin_token");
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      await apiGet(
        `${apiUrl}/items`,
        headers,
        (responseData) => {
          if (!responseData.success) throw new Error(responseData.message);
          setItems(responseData.data.map(transformApiItem));
        },
        (error) => {
          setError(error.message ?? "Failed to load auctions");
          toast.error("Failed to load auctions");
        }
      );
    } catch (e: any) {
      setError(e.message ?? "Unexpected error occurred");
      toast.error("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, error, fetchItems, setItems };
}
