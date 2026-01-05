export interface Transaction {
  id: string;
  bundleName: string;
  type: "points" | "usdt";
  amount: number;
  date: Date;
  status: "completed" | "pending";
}

export interface BundlesViewProps {
  userPoints: number;
  onPointsUsed: (points: number, itemName?: string) => Promise<boolean>;
  onPointsAdded: (points: number, itemName?: string) => Promise<void>;
  apiUrl: string;
}
