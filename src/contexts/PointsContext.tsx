import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface PointsContextType {
  points: number;
  updatePoints: (newPoints: number) => void;
  addPoints: (pointsToAdd: number, source?: string) => void;
  deductPoints: (pointsToDeduct: number, reason?: string) => boolean;
  formatPoints: () => string;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

interface PointsProviderProps {
  children: ReactNode;
  initialPoints?: number;
}

export function PointsProvider({ children, initialPoints = 0 }: PointsProviderProps) {
  const [points, setPoints] = useState<number>(initialPoints);

  // Load points from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('user_points');
    if (savedPoints) {
      try {
        const parsedPoints = parseFloat(savedPoints);
        if (!isNaN(parsedPoints)) {
          setPoints(parsedPoints);
        }
      } catch (error) {
        console.error('Error parsing saved points:', error);
      }
    }
  }, []);

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('user_points', points.toString());
  }, [points]);

  const updatePoints = (newPoints: number) => {
    setPoints(newPoints);
  };

  const addPoints = (pointsToAdd: number, source?: string) => {
    if (pointsToAdd <= 0) return;
    
    setPoints(prev => {
      const newTotal = prev + pointsToAdd;
      
      toast.success(`🎉 +${pointsToAdd} points added!`, {
        description: source ? `From: ${source}` : `New balance: ${newTotal} points`,
        duration: 3000,
      });
      
      return newTotal;
    });
  };

  const deductPoints = (pointsToDeduct: number, reason?: string): boolean => {
    if (pointsToDeduct <= 0) return true;
    
    if (points < pointsToDeduct) {
      toast.error("❌ Insufficient points!", {
        description: `You need ${pointsToDeduct - points} more points`,
      });
      return false;
    }
    
    setPoints(prev => {
      const newTotal = prev - pointsToDeduct;
      
      toast.info(`⚡ ${pointsToDeduct} points used`, {
        description: reason ? `For: ${reason}` : `Remaining: ${newTotal} points`,
      });
      
      return newTotal;
    });
    
    return true;
  };

  const formatPoints = () => {
    return points.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const value = {
    points,
    updatePoints,
    addPoints,
    deductPoints,
    formatPoints
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}