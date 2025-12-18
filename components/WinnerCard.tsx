import React from 'react';
import { Winner } from '../types';

interface WinnerCardProps {
  winner: Winner;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winner }) => {
  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const cleanPhone = phone.toString();
    if (cleanPhone.length < 4) return cleanPhone;
    return `${cleanPhone.substring(0, 4)}****`;
  };

  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between border border-stone-100 shadow-sm hover:border-red-200 transition-colors group">
      <div className="flex flex-col">
        <span className="text-xs text-stone-400 mb-1">Facebook 用戶</span>
        <span className="text-lg font-bold text-stone-800 serif-font group-hover:text-red-700 transition-colors">
          {winner.name}
        </span>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-xs text-stone-400 mb-1">電話</span>
        <span className="font-mono text-base text-stone-600 bg-stone-50 px-2 py-0.5 rounded">
          {maskPhone(winner.phone)}
        </span>
      </div>
    </div>
  );
};

export default WinnerCard;