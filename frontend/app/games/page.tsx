'use client';

import { useState } from 'react';
import { Search, ChevronDown, Filter, ShoppingCart, Globe, Gift } from 'lucide-react';

const GAMES = [
  { id: 1, title: 'Counter-Strike 2', price: 0, oldPrice: null, discount: null, region: 'RU', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg' },
  { id: 2, title: 'Cyberpunk 2077', price: 1999, oldPrice: 2999, discount: 33, region: 'RU', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg' },
  { id: 3, title: "Baldur's Gate 3", price: 3499, oldPrice: null, discount: null, region: 'RU', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg' },
  { id: 4, title: 'Elden Ring', price: 2499, oldPrice: 3999, discount: 38, region: 'RU', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg' },
  { id: 5, title: 'Red Dead Redemption 2', price: 1499, oldPrice: 2999, discount: 50, region: 'RU', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg' },
  { id: 6, title: 'GTA V', price: 749, oldPrice: 1499, discount: 50, region: 'RU', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg' },
  { id: 7, title: 'Hogwarts Legacy', price: 2799, oldPrice: 3999, discount: 30, region: 'RU', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg' },
  { id: 8, title: 'Starfield', price: 3499, oldPrice: null, discount: null, region: 'RU', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg' },
];

export default function GamesPage() {
  const [search, setSearch] = useState('');

  const filteredGames = GAMES.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black font-heading uppercase tracking-tight text-white">Магазин <span className="text-accent">Игр</span></h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Лучшие предложения из Steam</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Поиск игры..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-accent outline-none transition-all"
              />
            </div>
            <button className="glass-card px-5 py-3 text-xs font-bold uppercase flex items-center space-x-2">
              <Filter size={16} />
              <span>Фильтры</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <div key={game.id} className="glass-card group flex flex-col overflow-hidden hover:border-accent/50 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={game.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={game.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                {game.discount && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white font-black text-xs px-2 py-1 rounded-lg shadow-lg">
                    -{game.discount}%
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black flex items-center space-x-1">
                  <Globe size={10} className="text-accent" />
                  <span>{game.region}</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-black text-sm uppercase mb-4 line-clamp-1 tracking-tight">{game.title}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    {game.oldPrice && <p className="text-[10px] text-gray-600 font-bold line-through">{game.oldPrice} ₽</p>}
                    <p className="text-lg font-black text-white">{game.price === 0 ? 'Бесплатно' : `${game.price} ₽`}</p>
                  </div>
                  <button className="p-3 bg-white/5 hover:bg-accent hover:text-dark rounded-xl transition-all group/btn">
                    <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Игры не найдены. Попробуйте изменить запрос.</p>
          </div>
        )}

        <div className="glass-card p-12 bg-gradient-to-r from-accent/10 to-transparent border-accent/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-accent/20 px-3 py-1 rounded-full text-accent text-[10px] font-black uppercase">
              <Gift size={12} />
              <span>Гифты Steam</span>
            </div>
            <h2 className="text-3xl font-black font-heading uppercase tracking-tight">Не нашли игру?</h2>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Мы можем отправить любую игру, доступную в Steam, подарком на ваш аккаунт. 
              Просто напишите нам в Telegram и мы рассчитаем стоимость с учетом вашего региона.
            </p>
          </div>
          <button className="bg-accent text-dark px-10 py-5 rounded-2xl font-black text-lg uppercase shadow-xl whitespace-nowrap active:scale-95 transition-all">
            Заказать игру
          </button>
        </div>
      </div>
    </main>
  );
}
