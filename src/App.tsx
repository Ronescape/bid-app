import { useState, useEffect } from 'react';
import { BiddingsView } from './components/bidding/BiddingsView';
import { AccountView } from './components/account/AccountView';
import { PackagesView } from './components/packages/PackagesView';
import { BundlesView } from './components/bundles/BundlesView';
import { Button } from './components/ui/button';
import { Gavel, User, Package, TrendingUp, Coins, RefreshCw } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { UserData } from './data/gameData';
import { apiPost } from './utils/apiUtility';
import { AUTH_TELEGRAM } from './types/endpoints';


type View = 'biddings' | 'packages' | 'bundles' | 'account';

const getEnv = (key: string, defaultValue: string = ''): string => {
  return (import.meta as any).env?.[key] || defaultValue;
};

const getTokenFromEnv = (): string | null => {
  return (import.meta as any).env?.VITE_USER_TOKEN || null;
};

export const API_URL = getEnv('VITE_API_URL', 'http://localhost:3000/api');
export const IS_DEV = getEnv('DEV') === 'true' || import.meta.env.MODE === 'development';
export const DUMMY_INIT_DATA = getEnv('VITE_INIT_DATA', '{}');

export default function App() {
  const [currentView, setCurrentView] = useState<View>('biddings');
  const [userData, setUserData] = useState<UserData>({
    username: 'BidMaster',
    points: 500,
    totalBids: 0,
    wonAuctions: 0,
    joinDate: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);

  // Initialize Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isInTelegram = window.Telegram?.WebApp !== undefined;
      setIsTelegram(isInTelegram);
      
      if (isInTelegram) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        if (tg.themeParams) {
          document.documentElement.style.setProperty(
            '--tg-theme-bg-color', 
            tg.themeParams.bg_color || '#17212b'
          );
          document.documentElement.style.setProperty(
            '--tg-theme-text-color', 
            tg.themeParams.text_color || '#ffffff'
          );
        }
      }
    }
  }, []);

  // Fetch user data with Telegram authentication
  const fetchUserData = async (showLoading = true) => {
    console.log('Fetching user data...');
    
    // Check for token in dev mode
    if (IS_DEV) {
      const storedToken = localStorage.getItem('bidwin_token');
      if (storedToken) {
        console.log('Using cached token, skipping API call');
        const cachedUser = localStorage.getItem('bidwin_user');
        if (cachedUser) {
          setUserData(JSON.parse(cachedUser));
          setIsLoading(false);
          return;
        }
      }
      
      // Add token from env if not present
      const envToken = getTokenFromEnv();
      if (envToken && !storedToken) {
        localStorage.setItem('bidwin_token', envToken);
      }
    }
    
    if (showLoading) setIsLoading(true);
    if (!showLoading) setIsRefreshing(true);
    
    setApiError(null);

    try {
      const url = `${API_URL}${AUTH_TELEGRAM}`;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      // Prepare payload
      let payloadBody: any = {};
      
      if (window.Telegram?.WebApp) {
        const initData = window.Telegram.WebApp.initData || '';
        if (initData) {
          payloadBody.init_data = initData;
        }
      }

      // Use dummy data in development
      if (IS_DEV && !window.Telegram?.WebApp) {
        payloadBody.init_data = DUMMY_INIT_DATA;
      }

      await apiPost(
        url,
        JSON.stringify(payloadBody),
        headers,
        (responseData: any) => {
          console.log('User data received:', responseData);
          
          if (responseData.success && responseData.data) {
            const userDataUpdate: UserData = {
              username: responseData.data.name || responseData.data.username || 'User',
              points: parseFloat(responseData.data.points) || 0,
              telegramId: responseData.data.tg_id?.toString(),
              avatar: `https://t.me/i/userpic/320/${responseData.data.tg_id}.svg`,
              totalBids: 0,
              wonAuctions: 0,
              joinDate: responseData.data.created_ts?.split('T')[0] || new Date().toISOString().split('T')[0]
            };
            
            setUserData(userDataUpdate);
            localStorage.setItem('bidwin_user', JSON.stringify(userDataUpdate));
            
            // Store token if provided
            if (responseData.token) {
              localStorage.setItem('bidwin_token', responseData.token);
            }
            
            if (!showLoading) {
              toast.success('Profile refreshed!');
            }
          }
        },
        (error) => {
          console.error('API Error:', error);
          handleApiError();
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      setApiError('Unexpected error occurred');
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle API errors with fallback to cached data
  const handleApiError = () => {
    const cachedUser = localStorage.getItem('bidwin_user');
    if (cachedUser) {
      const cachedData = JSON.parse(cachedUser);
      setUserData(cachedData);
      toast.warning('Using cached data', {
        description: 'Connectivity issues with server'
      });
    } else {
      // Fallback to demo user
      const demoUser = {
        username: 'DemoUser',
        points: 500,
        totalBids: 0,
        wonAuctions: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUserData(demoUser);
      localStorage.setItem('bidwin_user', JSON.stringify(demoUser));
      toast.error('Failed to load profile');
    }
  };

  // Initial data load
  useEffect(() => {
    fetchUserData();
  }, []);

  // Sync user data to localStorage only (API sync removed as it's not in requirements)
  const syncUserData = (updatedData: Partial<UserData>) => {
    const newUserData = { ...userData, ...updatedData };
    setUserData(newUserData);
    localStorage.setItem('bidwin_user', JSON.stringify(newUserData));
    return true;
  };

  const handlePointsAdded = async (points: number, packageName?: string) => {
    const newPoints = userData.points + points;
    const success = syncUserData({ points: newPoints });
    
    if (success) {
      toast.success(`🎉 Added ${points} points!`, {
        description: `New balance: ${newPoints} points`,
        duration: 3000,
      });
    }
  };

  const handlePointsUsed = async (points: number, itemName?: string) => {
    if (userData.points < points) {
      toast.error('❌ Insufficient points!', {
        description: `You need ${points - userData.points} more points`,
      });
      return false;
    }
    
    const newPoints = userData.points - points;
    const success = syncUserData({ 
      points: newPoints,
      totalBids: (userData.totalBids || 0) + 1
    });
    
    if (success) {
      toast.info(`⚡ ${points} points used`, {
        description: itemName ? `For: ${itemName}` : `Remaining: ${newPoints} points`,
      });
    }
    
    return success;
  };

  const handleAuctionWon = async () => {
    const success = syncUserData({ 
      wonAuctions: (userData.wonAuctions || 0) + 1 
    });
    
    if (success) {
      toast.success('🎊 Congratulations! You won the auction!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bidwin_user');
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    } else {
      const demoUser = {
        username: 'DemoUser',
        points: 500,
        totalBids: 0,
        wonAuctions: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUserData(demoUser);
      localStorage.setItem('bidwin_user', JSON.stringify(demoUser));
      setCurrentView('biddings');
      toast.info('Reset to demo user');
    }
  };

  const handleRefresh = () => {
    fetchUserData(false);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            BidWin
          </h1>
          <p className="text-slate-400">Loading your auction experience...</p>
          <p className="text-xs text-slate-500 mt-4">
            {isTelegram ? 'Telegram Mode' : 'Browser Mode'} | API: {API_URL}
            {IS_DEV && localStorage.getItem('bidwin_token') && ' | Token: ✓'}
          </p>
        </div>
      </div>
    );
  }

  // Navigation configuration
  const navItems = [
    { id: 'biddings', icon: Gavel, label: 'Bids' },
    { id: 'packages', icon: Package, label: 'Topup' },
    { id: 'bundles', icon: TrendingUp, label: 'Bundles' },
    { id: 'account', icon: User, label: 'Account' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    BidWin
                  </h1>
                  {isTelegram && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      Telegram
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-400">
                    {IS_DEV ? 'Development Mode' : 'Live'}
                  </p>
                  <button 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-purple-400' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Points Display */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full shadow-2xl shadow-purple-500/50">
                <Coins className="w-4 h-4 text-white" />
                <span className="text-white font-medium">{userData.points.toLocaleString()}</span>
                <span className="text-white/80 text-xs">points</span>
              </div>
              
              {/* User Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {userData.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* API Error Banner */}
          {apiError && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <span className="text-xs">⚠️</span>
                Connection Issue: {apiError}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Using local data. Some features may be limited.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 relative z-10">
        {currentView === 'biddings' && (
          <BiddingsView 
            username={userData.username}
            userPoints={userData.points}
            onPointsUsed={handlePointsUsed}
            onAuctionWon={handleAuctionWon}
            apiUrl={API_URL}
            totalBids={userData.totalBids}
            wonAuctions={userData.wonAuctions}
          />
        )}
        {currentView === 'packages' && (
          <PackagesView 
            onPointsAdded={handlePointsAdded}
            apiUrl={API_URL}
            currentPoints={userData.points}
          />
        )}
        {currentView === 'bundles' && (
          <BundlesView 
            userPoints={userData.points}
            onPointsUsed={handlePointsUsed}
            onPointsAdded={handlePointsAdded}
            apiUrl={API_URL}
          />
        )}
        {currentView === 'account' && (
          <AccountView 
            userData={userData}
            onLogout={handleLogout}
            onRefresh={handleRefresh}
            apiUrl={API_URL}
            apiError={apiError}
            isTelegram={isTelegram}
            username={userData.username}
            userPoints={userData.points}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/30 backdrop-blur-sm border-t border-slate-700/30 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-1 py-2">
            {navItems.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant="ghost"
                onClick={() => setCurrentView(id as View)}
                className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
                  currentView === id 
                    ? getActiveStyle(id)
                    : 'text-slate-400 hover:text-purple-400 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        expand={true}
        richColors
        theme="dark"
        toastOptions={{
          duration: 4000,
          classNames: {
            toast: 'group toast group-[.toaster]:bg-slate-800/90 group-[.toaster]:text-slate-50 group-[.toaster]:border-slate-700 group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-slate-300',
            actionButton: 'group-[.toast]:bg-purple-600 group-[.toast]:text-purple-50',
            cancelButton: 'group-[.toast]:bg-slate-700 group-[.toast]:text-slate-400',
          },
        }}
      />
      
      {/* Animations CSS */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// Helper function for active navigation styles
function getActiveStyle(viewId: string): string {
  switch(viewId) {
    case 'biddings':
      return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/50';
    case 'packages':
      return 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/50';
    case 'bundles':
      return 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/50';
    case 'account':
      return 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl shadow-pink-500/50';
    default:
      return '';
  }
}