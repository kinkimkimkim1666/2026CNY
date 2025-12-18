import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Settings } from 'lucide-react';
import WinnerCard from './components/WinnerCard';
import AdminModal from './components/AdminModal';
import { Winner } from './types';
import { INITIAL_WINNERS, TOTAL_DAYS } from './constants';

const App: React.FC = () => {
  // State
  const [activeDay, setActiveDay] = useState<number>(1);
  const [winners, setWinners] = useState<Winner[]>(INITIAL_WINNERS);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cny_event_winners');
    if (saved) {
      try {
        setWinners(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved winners");
      }
    }
  }, []);

  // Update winners handler
  const handleUpdateWinners = (newWinners: Winner[]) => {
    setWinners(newWinners);
    localStorage.setItem('cny_event_winners', JSON.stringify(newWinners));
  };

  // Filter winners for current day
  const currentWinners = winners.filter(w => w.day === activeDay);

  return (
    <div className="min-h-screen pb-12">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-10 text-yellow-500/10 transform rotate-12">
           <Sparkles className="w-64 h-64" />
        </div>
        <div className="absolute bottom-10 right-10 text-yellow-500/10 transform -rotate-12">
           <Sparkles className="w-96 h-96" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-500/50 mb-2">
             <Calendar className="w-8 h-8 text-red-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 drop-shadow-md tracking-wider">
            新春幸運大抽獎
          </h1>
          <p className="text-red-200 text-lg font-light tracking-widest uppercase">
            每日公佈得獎名單
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full"></div>
        </header>

        {/* Day Navigation */}
        <div className="bg-red-800/60 backdrop-blur rounded-2xl p-2 mb-8 flex justify-between shadow-inner border border-red-700/50">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`
                relative flex-1 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-300
                ${activeDay === day 
                  ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 text-red-900 shadow-lg scale-105 z-10' 
                  : 'text-red-200 hover:bg-red-700/50 hover:text-white'}
              `}
            >
              <span className="serif-font">第 {day} 日</span>
              {activeDay === day && (
                 <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full shadow-[0_0_8px_rgba(253,224,71,0.8)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <div className="mb-6 flex items-end justify-between px-2">
            <h2 className="text-2xl font-bold text-yellow-100 flex items-center gap-2">
              <span className="text-4xl text-yellow-400 serif-font">Day {activeDay}</span> 
              <span className="text-base opacity-70 font-normal mt-2">得獎幸運兒</span>
            </h2>
            <div className="text-right">
               <span className="bg-red-900/50 text-yellow-200 text-xs px-3 py-1 rounded-full border border-yellow-500/30">
                 共 {currentWinners.length} 位
               </span>
            </div>
          </div>

          {currentWinners.length > 0 ? (
            <div className="grid gap-4">
              {currentWinners.map((winner) => (
                <WinnerCard key={winner.id} winner={winner} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-red-800 rounded-2xl bg-red-900/20 text-red-300">
              <Sparkles className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg">今日名單尚未公佈</p>
              <p className="text-sm opacity-60">敬請期待！</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Toggle (Discreet) */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="bg-black/20 hover:bg-black/40 text-white/30 hover:text-white/80 p-2 rounded-full transition-all"
          title="管理員設定"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Modal */}
      <AdminModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onUpdate={handleUpdateWinners}
      />
    </div>
  );
};

export default App;