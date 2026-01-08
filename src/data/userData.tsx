import { UserData } from "./gameData";

export const getUserData = (): UserData | null => {
  try {
    const userDataStr = localStorage.getItem('bidwin_user');
    if (!userDataStr) {
      console.warn('No user data found in localStorage');
      return null;
    }
    
    const userData = JSON.parse(userDataStr) as UserData;
    return userData;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * Get user ID from localStorage
 * @returns User ID or null if not found
 */
export const getUserId = (): number | null => {
  const userData = getUserData();
  return userData?.id || null;
};

/**
 * Get user points from localStorage
 * @returns Points as number or 0 if not found/invalid
 */
export const getUserPoints = (): number => {
  const userData = getUserData();
  if (!userData?.points) return 0;
  
  // Handle both string and number types
  const points = userData.points;
  return typeof points === 'string' ? parseFloat(points) || 0 : Number(points) || 0;
};

/**
 * Get username from localStorage
 * @returns Username or empty string
 */
export const getUsername = (): string => {
  const userData = getUserData();
  return userData?.username || '';
};

/**
 * Get formatted username (name if available, otherwise username)
 * @returns Display name
 */
export const getDisplayName = (): string => {
  const userData = getUserData();
  return userData?.name || userData?.username || '';
};

/**
 * Get user token from localStorage
 * @returns Token string or null
 */
export const getUserToken = (): string | null => {
  return localStorage.getItem('bidwin_token');
};

/**
 * Update specific user data in localStorage
 * @param updates Partial user data to update
 * @returns Updated user data or null if update failed
 */
export const updateUserData = (updates: Partial<UserData>): UserData | null => {
  try {
    const currentData = getUserData();
    if (!currentData) {
      console.warn('Cannot update: No user data found');
      return null;
    }
    
    const updatedData = { ...currentData, ...updates };
    localStorage.setItem('bidwin_user', JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error updating user data:', error);
    return null;
  }
};

/**
 * Update user points in localStorage
 * @param points New points value (number or string)
 * @returns Success status
 */
export const updateUserPoints = (points: number | string): boolean => {
  try {
    const numPoints = typeof points === 'string' ? parseFloat(points) : points;
    return updateUserData({ points: numPoints }) !== null;
  } catch (error) {
    console.error('Error updating user points:', error);
    return false;
  }
};

/**
 * Clear all user data from localStorage
 */
export const clearUserData = (): void => {
  localStorage.removeItem('bidwin_user');
  localStorage.removeItem('bidwin_token');
};

/**
 * Check if user is logged in (has user data)
 * @returns Boolean indicating login status
 */
export const isUserLoggedIn = (): boolean => {
  return getUserData() !== null;
};

/**
 * Get user avatar URL or initials for fallback
 * @returns Object with avatar URL and initials
 */
export const getUserAvatar = (): { 
  url: string | null; 
  initials: string;
} => {
  const userData = getUserData();
  
  if (userData?.avatar) {
    return {
      url: userData.avatar,
      initials: ''
    };
  }
  
  // Generate initials from name or username
  const displayName = getDisplayName();
  const initials = displayName
    ? displayName.substring(0, 2).toUpperCase()
    : 'U';
    
  return {
    url: null,
    initials
  };
};

/**
 * Format user points with 2 decimal places
 * @returns Formatted points string
 */
export const getFormattedPoints = (): string => {
  const points = getUserPoints();
  return points.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};