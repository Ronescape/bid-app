export interface ApiPackage {
  id: number;
  name: string;
  points: number;
  amount: number;
  tag?: string;
  is_popular: boolean;
  bonus?: number;
  photo: {
    url: string;
  };
  weight: number;
}

export interface Package {
  id: string;
  name: string;
  points: number;
  price: number;
  tag?: string;
  icon: "coins" | "sparkles" | "zap" | "crown";
  popular: boolean;
  bonus?: number;
  photo: string;
  weight: number;
}

export interface PackagesViewProps {
  onPointsAdded: (points: number, packageName?: string) => Promise<void>;
  apiUrl: string;
  currentPoints?: number;
}
