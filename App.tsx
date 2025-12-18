import React, { useState, useEffect } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import WinnerCard from './components/WinnerCard';
import AdminModal from './components/AdminModal';
import { Winner } from './types';
import { INITIAL_WINNERS, TOTAL_DAYS } from './constants';

const App: React.FC = () => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [winners, setWinners] = useState<Winner[]>(INITIAL_WINNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('cny_winners_v1');
    if (saved) {
      try {
        setWinners(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  }, []);

  // Save data
  const handleUpdate = (newWinners: Winner[]) => {
    setWinners(newWinners);
    localStorage.setItem('cny_winners_v1', JSON.stringify(newWinners));
  };

  const currentWinners = winners.filter(w => w.day === activeDay);

  return (
    <div className="min-h-screen pb-20 relative">
      
      {/* Decorative Header Border */}
      <div className="h-2 bg-gradient-to-r from-red-800 via-red-600 to-red-800"></div>

      <div className="max-w-2xl mx-auto px-6">
        
        {/* Header Section */}
        <header className="py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1 rounded-full text-xs tracking-widest uppercase font-bold mb-2 border border-red-100">
            <Sparkles className="w-3 h-3" />
            Lucky Draw Event
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 tracking-wide">
            新春幸運大抽獎
          </h1>
          <p className="text-stone-500 font-light text-sm md:text-base max-w-md mx-auto leading-relaxed">
            恭喜各位得獎者，祝願新一年大吉大利，好運連連。
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-stone-200 inline-flex overflow-x-auto max-w-full">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`
                  relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap z-10
                  ${activeDay === day 
                    ? 'text-white' 
                    : 'text-stone-500 hover:text-stone-800'}
                `}
              >
                {activeDay === day && (
                  <div className="absolute inset-0 bg-red-700 rounded-full shadow-md -z-10"></div>
                )}
                第 {day} 日
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main className="space-y-4">
          <div className="flex items-end justify-between px-2 mb-2 border-b border-stone-200 pb-3">
            <h2 className="text-2xl font-serif text-stone-800 font-bold">
              得獎名單
            </h2>
            <span className="text-xs text-stone-400 font-mono">
              Day {activeDay} • {currentWinners.length} Winners
            </span>
          </div>

          {currentWinners.length > 0 ? (
            <div className="grid gap-4">
              {currentWinners.map((winner, idx) => (
                <WinnerCard key={winner.id} winner={winner} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-dashed border-stone-200 rounded-lg">
              <p className="text-stone-400 font-serif text-lg">
                本日名單尚未公佈，敬請期待
              </p>
            </div>
          )}
        </main>

        {/* Footer / Copyright */}
        <footer className="mt-20 text-center text-xs text-stone-400 font-light">
          <p>© 2025 新春活動籌備委員會. All Rights Reserved.</p>
        </footer>

      </div>

      {/* Admin Button (Bottom Right) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-10 h-10 bg-white border border-stone-200 text-stone-400 hover:text-red-700 hover:border-red-300 rounded-full shadow-lg flex items-center justify-center transition-all z-40"
        title="Admin Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Modals */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default App;