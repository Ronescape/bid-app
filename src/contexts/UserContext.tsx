import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  username: string;
  telegramId?: string;
  points: number;
  usdt?: string;
  referralCode?: string;
  createdTs?: string;
  updatedTs?: string;
  avatar?: string;
  totalBids?: number;
  wonAuctions?: number;
  joinDate: string;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
  addPoints: (points: number, source?: string) => void;
  deductPoints: (points: number, reason?: string) => boolean;
  refreshUserData: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  initialUserData: UserData;
}

export function UserProvider({ children, initialUserData }: UserProviderProps) {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("bidwin_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bidwin_user", JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const addPoints = (points: number, source?: string) => {
    if (points <= 0) return;

    setUserData((prev) => {
      const newPoints = prev.points + points;

      // Show toast notification
      toast.success(`🎉 +${points} points added!`, {
        description: source ? `From: ${source}` : `New balance: ${newPoints} points`,
        duration: 3000,
      });

      return {
        ...prev,
        points: newPoints,
      };
    });
  };

  const deductPoints = (points: number, reason?: string): boolean => {
    if (points <= 0) return true;

    if (userData.points < points) {
      toast.error("❌ Insufficient points!", {
        description: `You need ${points - userData.points} more points`,
      });
      return false;
    }

    setUserData((prev) => {
      const newPoints = prev.points - points;

      toast.info(`⚡ ${points} points used`, {
        description: reason ? `For: ${reason}` : `Remaining: ${newPoints} points`,
      });

      return {
        ...prev,
        points: newPoints,
        totalBids: (prev.totalBids || 0) + (reason?.includes("bid") ? 1 : 0),
      };
    });

    return true;
  };

  const refreshUserData = async () => {
    // This would typically make an API call to refresh user data
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In a real app, you would fetch fresh data from your API here
      toast.success("Profile refreshed!");
    } catch (error) {
      toast.error("Failed to refresh profile");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    userData,
    updateUserData,
    addPoints,
    deductPoints,
    refreshUserData,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
