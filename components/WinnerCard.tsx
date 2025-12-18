import React from 'react';
import { Winner } from '../types';

interface WinnerCardProps {
  winner: Winner;
  index: number;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winner, index }) => {
  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const s = phone.toString();
    if (s.length < 4) return s;
    return `${s.slice(0, 4)}****`;
  };

  return (
    <div 
      className="group relative bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-sm overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Decorative Red Left Border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-800/80 group-hover:bg-red-700 transition-colors"></div>
      
      <div className="p-5 flex items-center justify-between">
        <div className="flex flex-col pl-3">
          <span className="text-xs tracking-widest text-stone-400 uppercase mb-1">
            Facebook Name
          </span>
          <h3 className="text-lg md:text-xl font-serif font-medium text-stone-800 group-hover:text-red-800 transition-colors">
            {winner.name}
          </h3>
        </div>

        <div className="text-right">
          <span className="text-xs tracking-widest text-stone-400 uppercase block mb-1">
            Phone
          </span>
          <span className="font-mono text-base text-stone-600 bg-stone-50 px-2 py-1 rounded border border-stone-100">
            {maskPhone(winner.phone)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;