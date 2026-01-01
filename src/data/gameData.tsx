export type ComboBoxOption = {
  value: string;
  label: string;
};

export interface UserData {
  username: string;
  points: number;
  telegramId?: string;
  avatar?: string;
  totalBids?: number;
  wonAuctions?: number;
  joinDate?: string;
}
