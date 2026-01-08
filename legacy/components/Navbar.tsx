
import React from 'react';
import { Search, LogIn, ChevronDown, Gamepad2, Users, Layers, Trophy, Star, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0e121a]/95 border-b border-white/5 h-20">
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <span className="text-xl font-black font-heading tracking-tighter uppercase text-white">
              RODINA-CS2
            </span>
            <div className="flex items-center bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-[10px] font-bold text-green-500">84</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden xl:flex items-center space-x-1 text-[13px] font-bold text-gray-400">
            <a href="#" className="flex items-center space-x-2 px-4 py-2 rounded-xl nav-link transition-all">
              <Layers size={14} />
              <span>Донат</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-4 py-2 rounded-xl nav-link transition-all">
              <Gamepad2 size={14} />
              <span>Скины</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-4 py-2 rounded-xl nav-link transition-all">
              <Users size={14} />
              <span>Игроки</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-4 py-2 rounded-xl nav-link transition-all">
              <Settings size={14} />
              <span>Кланы</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-4 py-2 rounded-xl nav-link transition-all">
              <Trophy size={14} />
              <span>Пропуск</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-4 py-2 rounded-xl nav-link transition-all">
              <ChevronDown size={14} />
              <span>Другое</span>
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 space-x-3 w-64 group focus-within:bg-white/10 transition-all">
             <div className="p-2 bg-blue-500/20 rounded-lg">
                <Search size={16} className="text-blue-400" />
             </div>
            <input 
              type="text" 
              placeholder="Найти игрока" 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600"
            />
          </div>

          <button className="flex items-center space-x-2 bg-[#d97706] hover:bg-[#b45309] px-6 py-2.5 rounded-xl text-sm font-black text-black transition-all">
            <WalletIcon />
            <span>Пополнить</span>
          </button>

          <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-300 transition-all">
            <LogIn size={18} />
            <span>Войти</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const WalletIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 7H5C3.34315 7 2 8.34315 2 10V18C2 19.6569 3.34315 21 5 21H19C20.6569 21 22 19.6569 22 18V10C22 8.34315 20.6569 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 13H18C16.8954 13 16 13.8954 16 15V15C16 16.1046 16.8954 17 18 17H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default Navbar;
