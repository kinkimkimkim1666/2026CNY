import React from 'react';
import { Winner } from '../types';
import { ShieldCheck, User } from 'lucide-react';

interface WinnerCardProps {
  winner: Winner;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winner }) => {
  // Function to mask phone number (Show first 4, mask rest)
  const maskPhone = (phone: string) => {
    if (!phone) return '';
    const cleanPhone = phone.toString();
    if (cleanPhone.length < 4) return cleanPhone;
    return `${cleanPhone.substring(0, 4)}****`;
  };

  return (
    <div className="bg-red-800/80 border border-yellow-600/50 rounded-lg p-4 flex items-center justify-between shadow-lg backdrop-blur-sm hover:bg-red-800 transition-colors">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500/10 p-2 rounded-full">
          <User className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <p className="text-yellow-100 text-sm font-light">Facebook 帳戶</p>
          <p className="text-xl font-bold text-yellow-400 tracking-wide serif-font">
            {winner.name}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-yellow-100 text-sm font-light">電話號碼</p>
        <div className="flex items-center justify-end gap-1 text-white/90">
          <ShieldCheck className="w-3 h-3 text-green-400" />
          <span className="font-mono text-lg">{maskPhone(winner.phone)}</span>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;