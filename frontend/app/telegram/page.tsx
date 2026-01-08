'use client';

import { useState } from 'react';
import { Star, Zap } from 'lucide-react';

const starPackages = [
  { label: '50 ⭐', val: '50', price: 120 },
  { label: '100 ⭐', val: '100', price: 230 },
  { label: '250 ⭐', val: '250', price: 550 },
  { label: '500 ⭐', val: '500', price: 1050 },
  { label: '1000 ⭐', val: '1000', price: 1990 },
  { label: 'Своё', val: 'custom', price: 0 },
];

export default function TelegramPage() {
  const [username, setUsername] = useState('');
  const [stars, setStars] = useState('100');
  const [customStars, setCustomStars] = useState('');

  const selectedPackage = starPackages.find(p => p.val === stars);
  const displayPrice = stars === 'custom' && customStars 
    ? Math.ceil(parseInt(customStars) * 2.3) 
    : selectedPackage?.price || 230;
  const displayStars = stars === 'custom' ? customStars || '0' : stars;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight text-white">
            Telegram <span className="text-accent">Stars</span>
          </h1>
          <p className="text-gray-400 text-sm uppercase font-bold tracking-[0.2em]">Низкие цены • Моментальная выдача</p>
        </div>

        <div className="glass-card p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Telegram Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-accent">@</div>
                  <input 
                    type="text" 
                    placeholder="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold focus:border-accent/50 outline-none transition-all placeholder:text-gray-700"
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
                      className={`py-3 text-[10px] font-black rounded-xl border transition-all ${stars === pkg.val ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                    >
                      {pkg.label}
                    </button>
                  ))}
                </div>
                {stars === 'custom' && (
                  <input 
                    type="number" 
                    placeholder="Введите количество звёзд" 
                    value={customStars}
                    onChange={(e) => setCustomStars(e.target.value)}
                    min="10"
                    className="w-full mt-3 bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:border-accent/50 outline-none transition-all placeholder:text-gray-700"
                  />
                )}
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-between">
              <div className="bg-accent/5 border border-accent/10 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>Количество звёзд:</span>
                  <span className="text-white text-lg flex items-center">{displayStars} <Star size={16} className="ml-2 text-yellow-500" /></span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>Стоимость:</span>
                  <span className="text-accent text-lg">{displayPrice} ₽</span>
                </div>
                <div className="h-px bg-white/5 w-full"></div>
                <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold uppercase">
                  <Zap size={16} className="text-accent shrink-0" />
                  <p>Комиссия уже включена в стоимость. Никаких скрытых платежей.</p>
                </div>
              </div>

              <button 
                disabled={!username.trim()}
                className="w-full bg-accent py-5 rounded-2xl font-black text-dark text-lg uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Star size={20} className="text-yellow-500" />
                <span>Купить Stars</span>
              </button>
            </div>
          </div>
        </div>

        {/* Premium packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="glass-card p-6 text-center space-y-3">
            <h3 className="font-black text-sm uppercase">Премиум на 1 мес</h3>
            <p className="text-2xl font-black text-accent">350 ₽</p>
            <button className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Купить</button>
          </div>
          <div className="glass-card p-6 text-center space-y-3 border-accent/30">
            <div className="inline-block px-3 py-1 bg-accent rounded-full text-[8px] font-bold text-dark uppercase mb-2">Популярно</div>
            <h3 className="font-black text-sm uppercase">Премиум на 3 мес</h3>
            <p className="text-2xl font-black text-accent">950 ₽</p>
            <button className="w-full bg-accent py-3 rounded-xl text-[10px] font-black text-dark uppercase tracking-widest transition-all">Купить</button>
          </div>
          <div className="glass-card p-6 text-center space-y-3">
            <h3 className="font-black text-sm uppercase">Премиум на 12 мес</h3>
            <p className="text-2xl font-black text-accent">2890 ₽</p>
            <button className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Купить</button>
          </div>
        </div>
      </div>
    </main>
  );
}
