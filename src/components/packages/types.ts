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
  bonus: number;
  photo: string;
  weight: number;
}

export interface PackagesViewProps {
  onPointsAdded: (points: number, packageName?: string) => Promise<void>;
  apiUrl: string;
  currentPoints?: number;
}


export interface SubmitHashResponse {
  data: {
    reference: string;
    user_id: number;
    wallet_address: string;
    txn_hash: string;
    currency: string;
    outlet: string;
    status: string;
    notes: string | null;
    payload: {
      network: string;
    };
    completed_at: string | null;
    expire_at: string;
    created_at: string;
  };
  message: string;
  success: boolean;
  code: number;
}

export interface PaymentData {
  purchasable_type: string;
  title: string;
  amount: number;
  currency: string;
  payment_method: string;
  topup_request: {
    reference: string;
    wallet_address: string;
    status: string;
    currency: string;
    expire_ts: string;
  };
}