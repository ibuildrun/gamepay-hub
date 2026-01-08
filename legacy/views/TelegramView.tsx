
import React, { useState } from 'react';
import { Send, Star, Zap, Info, ChevronRight } from 'lucide-react';

const TelegramView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [stars, setStars] = useState('100');

  const starPackages = [
    { label: '50 ⭐', val: '50', price: 120 },
    { label: '100 ⭐', val: '100', price: 230 },
    { label: '250 ⭐', val: '250', price: 550 },
    { label: '500 ⭐', val: '500', price: 1050 },
    { label: '1000 ⭐', val: '1000', price: 1990 },
    { label: 'Своё', val: 'custom', price: 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight text-white">
          Telegram <span className="text-[#7e9dff]">Stars</span>
        </h1>
        <p className="text-gray-400 text-sm uppercase font-bold tracking-[0.2em]">Низкие цены • Моментальная выдача</p>
      </div>

      <div className="glass-card p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Telegram Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7e9dff]">
                  @
                </div>
                <input 
                  type="text" 
                  placeholder="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold focus:border-[#7e9dff]/50 outline-none transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Выберите количество</label>
              <div className="grid grid-cols-3 gap-2">
                {starPackages.map(pkg => (
                  <button 
                    key={pkg.val} 
                    onClick={() => setStars(pkg.val)}
                    className={`py-3 text-[10px] font-black rounded-xl border transition-all ${stars === pkg.val ? 'bg-[#7e9dff]/20 border-[#7e9dff] text-[#7e9dff]' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {pkg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 flex flex-col justify-between">
            <div className="bg-[#7e9dff]/5 border border-[#7e9dff]/10 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                <span>Количество звёзд:</span>
                <span className="text-white text-lg flex items-center">{stars} <Star size={16} className="ml-2 text-yellow-500" /></span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                <span>Стоимость:</span>
                <span className="text-[#7e9dff] text-lg">230 ₽</span>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold uppercase">
                <Zap size={16} className="text-[#7e9dff] shrink-0" />
                <p>Комиссия уже включена в стоимость. Никаких скрытых платежей.</p>
              </div>
            </div>

            <button className="w-full bg-[#7e9dff] py-5 rounded-2xl font-black text-[#0b0e14] text-lg uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-95 group">
              <Star size={20} className="text-yellow-500" />
              <span>Купить Stars</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="glass-card p-6 text-center space-y-3">
          <h3 className="font-black text-sm uppercase">Премиум на 1 мес</h3>
          <p className="text-2xl font-black text-[#7e9dff]">350 ₽</p>
          <button className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Купить</button>
        </div>
        <div className="glass-card p-6 text-center space-y-3 border-[#7e9dff]/30">
          <div className="inline-block px-3 py-1 bg-[#7e9dff] rounded-full text-[8px] font-bold text-[#0b0e14] uppercase mb-2">Популярно</div>
          <h3 className="font-black text-sm uppercase">Премиум на 3 мес</h3>
          <p className="text-2xl font-black text-[#7e9dff]">950 ₽</p>
          <button className="w-full bg-[#7e9dff] py-3 rounded-xl text-[10px] font-black text-[#0b0e14] uppercase tracking-widest transition-all">Купить</button>
        </div>
        <div className="glass-card p-6 text-center space-y-3">
          <h3 className="font-black text-sm uppercase">Премиум на 12 мес</h3>
          <p className="text-2xl font-black text-[#7e9dff]">2890 ₽</p>
          <button className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Купить</button>
        </div>
      </div>
    </div>
  );
};

export default TelegramView;
