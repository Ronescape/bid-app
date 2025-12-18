import { useState, useEffect } from 'react';
import { BiddingsView } from './components/BiddingsView';
import { AccountView } from './components/AccountView';
import { PackagesView } from './components/PackagesView';
import { BundlesView } from './components/BundlesView';
import { Button } from './components/ui/button';
import { Gavel, User, Package, TrendingUp, Coins } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

type View = 'biddings' | 'packages' | 'bundles' | 'account';

export default function App() {
  const [username] = useState('BidMaster');
  const [currentView, setCurrentView] = useState<View>('biddings');
  const [userPoints, setUserPoints] = useState(500); // Starting points

  useEffect(() => {
    const savedPoints = localStorage.getItem('bidwin_points');
    if (savedPoints) {
      setUserPoints(parseInt(savedPoints));
    }
  }, []);

  const handlePointsAdded = (points: number) => {
    const newPoints = userPoints + points;
    setUserPoints(newPoints);
    localStorage.setItem('bidwin_points', newPoints.toString());
  };

  const handlePointsUsed = (points: number) => {
    const newPoints = userPoints - points;
    setUserPoints(newPoints);
    localStorage.setItem('bidwin_points', newPoints.toString());
  };

  const handleLogout = () => {
    // For now, just reset view
    setCurrentView('biddings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Effects */}
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
                <h1 className="text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">BidWin</h1>
                <p className="text-xs text-slate-400">Telegram Mini App</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Points Display */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full shadow-2xl shadow-purple-500/50">
                <Coins className="w-4 h-4 text-white" />
                <span className="text-white">{userPoints}</span>
              </div>
              
              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <div className="text-right mr-2 hidden sm:block">
                  <p className="text-sm text-white">@{username}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50">
                  <span className="text-white">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 relative z-10">
        {currentView === 'biddings' && (
          <BiddingsView 
            username={username} 
            userPoints={userPoints}
            onPointsUsed={handlePointsUsed}
          />
        )}
        {currentView === 'packages' && (
          <PackagesView 
            onPointsAdded={handlePointsAdded}
          />
        )}
        {currentView === 'bundles' && (
          <BundlesView 
            userPoints={userPoints}
            onPointsUsed={handlePointsUsed}
            onPointsAdded={handlePointsAdded}
          />
        )}
        {currentView === 'account' && (
          <AccountView 
            username={username} 
            onLogout={handleLogout}
            userPoints={userPoints}
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
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/50 hover:bg-gradient-to-r hover:from-purple-700 hover:to-pink-700' 
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
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/50 hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700' 
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
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/50 hover:bg-gradient-to-r hover:from-blue-700 hover:to-cyan-600' 
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
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl shadow-pink-500/50 hover:bg-gradient-to-r hover:from-pink-700 hover:to-purple-700' 
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
      <Toaster position="top-center" />
      
      {/* Custom Styles for Animations */}
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
