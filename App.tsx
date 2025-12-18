import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
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
    <div className="min-h-screen pb-12 px-4 max-w-3xl mx-auto">
      
      {/* Header - Extremely Minimal */}
      <header className="pt-16 pb-12 text-center">
        <div className="inline-block border-2 border-red-700 px-4 py-1 mb-4 rounded-full">
           <span className="text-red-700 font-bold tracking-widest text-xs uppercase">Lucky Draw</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-red-800 mb-2 tracking-wide serif-font">
          新春幸運大抽獎
        </h1>
        <p className="text-stone-500 font-light">
          每日得獎名單公佈
        </p>
      </header>

      {/* Day Navigation - Clean Tabs */}
      <div className="flex justify-center mb-10 overflow-x-auto">
        <div className="flex space-x-2 bg-stone-200/50 p-1 rounded-xl">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${activeDay === day 
                  ? 'bg-white text-red-700 shadow-sm ring-1 ring-black/5' 
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'}
              `}
            >
              第 {day} 日
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-6">
           <h2 className="text-xl font-bold text-stone-800 serif-font">
             Day {activeDay}
           </h2>
           <span className="text-stone-400 text-sm">
             共 {currentWinners.length} 位得獎者
           </span>
        </div>

        {currentWinners.length > 0 ? (
          <div className="grid gap-3">
            {currentWinners.map((winner) => (
              <WinnerCard key={winner.id} winner={winner} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-stone-300">
            <p className="text-stone-400 serif-font text-lg">本日名單尚未公佈</p>
          </div>
        )}
      </div>

      {/* Admin Toggle (Minimalist) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="bg-white text-stone-400 hover:text-red-600 border border-stone-200 p-2 rounded-full shadow-sm hover:shadow-md transition-all"
          title="管理員設定"
        >
          <Settings className="w-4 h-4" />
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