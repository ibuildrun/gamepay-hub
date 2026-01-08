
import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const TopBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-green-900/40 via-blue-900/40 to-green-900/40 border border-white/5 rounded-[1.2rem] p-4 mb-8 flex items-center justify-between overflow-hidden relative group">
       <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
       <div className="flex items-center space-x-6 relative z-10">
          <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
             <Zap size={20} fill="currentColor" />
          </div>
          <div>
             <h3 className="text-xl font-black font-heading uppercase tracking-tight text-white flex items-center">
                <span className="text-green-400 mr-2">SKIN</span>RAVE
                <span className="mx-4 text-gray-500">|</span>
                ВЫИГРЫВАЙ СКИНЫ МЕЧТЫ
             </h3>
          </div>
       </div>
       <div className="flex items-center space-x-8 relative z-10 overflow-x-auto no-scrollbar hidden md:flex">
          <div className="flex space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             <span className="hover:text-white cursor-pointer">Битвы</span>
             <span className="hover:text-white cursor-pointer">Двойной</span>
             <span className="hover:text-white cursor-pointer text-green-400">Кейсы</span>
             <span className="hover:text-white cursor-pointer">Мины</span>
             <span className="hover:text-white cursor-pointer">Лимбо</span>
          </div>
          <button className="bg-green-400 hover:bg-green-500 text-black px-6 py-2 rounded-lg font-black text-xs uppercase transition-all shadow-lg">
             Лутай скины!
          </button>
       </div>
    </div>
  );
};

export default TopBanner;
