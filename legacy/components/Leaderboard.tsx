
import React, { useState } from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { Donor } from '../types';

interface LeaderboardProps {
  donors: Donor[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ donors }) => {
  const [activeTab, setActiveTab] = useState('7d');

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-sm uppercase tracking-widest text-gray-200">Топ донатеров проекта за</h3>
        <HelpCircle size={18} className="text-gray-600 cursor-help" />
      </div>

      <div className="grid grid-cols-3 gap-2 bg-black/20 p-1 rounded-xl mb-8">
        <button 
          onClick={() => setActiveTab('7d')}
          className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === '7d' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          7 дней
        </button>
        <button 
          onClick={() => setActiveTab('30d')}
          className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === '30d' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          30 дней
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Всё время
        </button>
      </div>

      <div className="space-y-4 flex-grow">
        {donors.map((donor, idx) => (
          <div key={donor.id} className="flex items-center justify-between p-2 rounded-2xl group cursor-pointer hover:bg-white/5 transition-all">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src={donor.avatar} className="w-12 h-12 rounded-xl object-cover" alt={donor.name} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-yellow-500 group-hover:text-yellow-400 transition-colors">{donor.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">{idx + 1} место</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
               <span className="text-2xl font-black text-white/10 group-hover:text-white/20 transition-all font-heading">#{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5">
         <div className="flex items-center justify-center text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors group">
            <span>Профиль</span>
            <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
         </div>
      </div>
    </div>
  );
};

export default Leaderboard;
