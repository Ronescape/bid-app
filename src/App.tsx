import { useState, useEffect } from 'react';
import { BiddingsView } from './components/BiddingsView';
import { AccountView } from './components/AccountView';
import { PackagesView } from './components/PackagesView';
import { BundlesView } from './components/BundlesView';
import { Button } from './components/ui/button';
import { Gavel, User, Package, TrendingUp, Coins, LogOut, RefreshCw } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { UserData } from './data/gameData';
import { apiPost } from './utils/apiUtility';

type View = 'biddings' | 'packages' | 'bundles' | 'account';

const getEnv = (key: string, defaultValue: string = ''): string => {
  const env = (import.meta as any).env;
  return env?.[key] || defaultValue;
};

export const API_URL = getEnv('VITE_API_URL', 'http://localhost:3000/api');
export const IS_DEV = getEnv('DEV') === 'true' || import.meta.env.MODE === 'development';
export const IS_PROD = import.meta.env.MODE === 'production';
export const APP_TITLE = getEnv('VITE_APP_TITLE', 'BidWin');

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isInTelegram = window.Telegram?.WebApp !== undefined;
      setIsTelegram(isInTelegram);
      
      if (isInTelegram) {
        console.log('Running in Telegram WebApp');
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
      } else {
        console.log('Running in browser (development mode)');
      }
    }
  }, []);

  const fetchUserData = async (showLoading = true) => {
    console.log('Fetching user data...');
    if (showLoading && isLoading === false) {
      setIsLoading(true);
    }
    console.log('showLoading API_URL:', API_URL);
    if (!showLoading) {
      setIsRefreshing(true);
    }
    console.log('showLoading API_URL:', API_URL);
    setApiError(null);

    try {
      let payloadBody: any = {};
      let url = `${API_URL}/mini-app/auth`;
      console.log('Fetching user data from:', url);
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        console.log('Telegram initData:', tg.initData);
        const initData = tg.initData || tg.initDataUnsafe || '';
        
        if (initData) {
          payloadBody.init_data = initData;
        } else {
          console.warn('No Telegram initData available');
          const cachedUser = localStorage.getItem('bidwin_user');
          if (cachedUser) {
            setUserData(JSON.parse(cachedUser));
            return;
          }
        }
      } else {
        console.log('Running in browser mode, using demo data');
        const demoUser = {
          username: 'DemoUser',
          points: 500,
          totalBids: 0,
          wonAuctions: 0,
          joinDate: new Date().toISOString().split('T')[0]
        };
        setUserData(demoUser);
        localStorage.setItem('bidwin_user', JSON.stringify(demoUser));
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      await apiPost(
        url,
        JSON.stringify(payloadBody),
        headers,
        (responseData: any) => {
          console.log('User data received:', responseData);
          
          const userDataUpdate: UserData = {
            username: responseData.name || responseData.username || userData.username,
            points: responseData.points || 500,
            telegramId: responseData.tg_id?.toString() || responseData.telegramId,
            avatar: responseData.avatar || responseData.photo_url || userData.avatar,
            totalBids: responseData.totalBids || 0,
            wonAuctions: responseData.wonAuctions || 0,
            joinDate: responseData.joinDate || new Date().toISOString().split('T')[0]
          };
          
          setUserData(userDataUpdate);
          localStorage.setItem('bidwin_user', JSON.stringify(userDataUpdate));
          
          if (!showLoading) {
            toast.success('Profile refreshed!');
          }
        },
        (error) => {
          console.error('API Error:', error);
          
          const cachedUser = localStorage.getItem('bidwin_user');
          if (cachedUser) {
            const cachedData = JSON.parse(cachedUser);
            setUserData(cachedData);
            setApiError('Using cached data. Connection issue: ' + (error.message || 'API unavailable'));
            toast.warning('Using cached data', {
              description: 'Connectivity issues with server'
            });
          } else {
            setApiError(error.message || 'Failed to fetch user data');
            toast.error('Failed to load profile');
          }
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

  // Initial data load
  useEffect(() => {
    fetchUserData();
  }, []);

  // Sync user data
  const syncUserData = async (updatedData: Partial<UserData>) => {
    try {
      const newUserData = { ...userData, ...updatedData };
      setUserData(newUserData);
      
      // Save to localStorage
      localStorage.setItem('bidwin_user', JSON.stringify(newUserData));
      
      // Sync with API if in Telegram
      if (window.Telegram?.WebApp?.initData) {
        const tg = window.Telegram.WebApp;
        
        await fetch(`${API_URL}/user/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Telegram-Data': tg.initData,
          },
          body: JSON.stringify(newUserData),
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error('Failed to sync with server');
      return false;
    }
  };

  const handlePointsAdded = async (points: number, packageName?: string) => {
    const newPoints = userData.points + points;
    const success = await syncUserData({ points: newPoints });
    
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
    const success = await syncUserData({ 
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
    const success = await syncUserData({ 
      wonAuctions: (userData.wonAuctions || 0) + 1 
    });
    
    if (success) {
      toast.success('🎊 Congratulations! You won the auction!');
    }
  };

  const handleLogout = async () => {
    // Clear localStorage
    localStorage.removeItem('bidwin_user');
    
    if (window.Telegram?.WebApp) {
      // In Telegram, close the app
      window.Telegram.WebApp.close();
    } else {
      // In browser, reset to demo user
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
          </p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-2">
                <div className="text-right mr-2 hidden sm:block">
                  <p className="text-sm text-white">@{userData.username}</p>
                  <p className="text-xs text-slate-400">
                    {userData.wonAuctions || 0} won
                  </p>
                </div>
                <div className="relative">
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
            <Button
              variant="ghost"
              onClick={() => setCurrentView('biddings')}
              className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
                currentView === 'biddings' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/50' 
                  : 'text-slate-400 hover:text-purple-400 hover:bg-white/10'
              }`}
            >
              <Gavel className="w-5 h-5" />
              <span className="text-xs">Bids</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView('packages')}
              className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
                currentView === 'packages' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/50' 
                  : 'text-slate-400 hover:text-purple-400 hover:bg-white/10'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="text-xs">Topup</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView('bundles')}
              className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
                currentView === 'bundles' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/50' 
                  : 'text-slate-400 hover:text-purple-400 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs">Bundles</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView('account')}
              className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
                currentView === 'account' 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl shadow-pink-500/50' 
                  : 'text-slate-400 hover:text-purple-400 hover:bg-white/10'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Account</span>
            </Button>
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