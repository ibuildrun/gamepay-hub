'use client';

import { useState } from 'react';
import { ShoppingCart, Layers } from 'lucide-react';

const CATEGORIES = ['STEAM', 'PLAYSTATION', 'XBOX', 'NINTENDO', 'APPLE'];

const GIFT_CARDS = [
  { id: 1, brand: 'Steam', value: '500 ₽', price: 550, image: 'https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg' },
  { id: 2, brand: 'Steam', value: '1000 ₽', price: 1100, image: 'https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg' },
  { id: 3, brand: 'Steam', value: '2000 ₽', price: 2200, image: 'https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg' },
  { id: 4, brand: 'PlayStation', value: '$10', price: 1100, image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps-logo-stacked-colour-01-ps-background-01' },
  { id: 5, brand: 'PlayStation', value: '$25', price: 2750, image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps-logo-stacked-colour-01-ps-background-01' },
  { id: 6, brand: 'Xbox', value: '$10', price: 1100, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1200px-Xbox_one_logo.svg.png' },
  { id: 7, brand: 'Xbox', value: '$25', price: 2750, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1200px-Xbox_one_logo.svg.png' },
  { id: 8, brand: 'Nintendo', value: '$20', price: 2200, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/1200px-Nintendo.svg.png' },
  { id: 9, brand: 'Apple', value: '$10', price: 1100, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png' },
];

export default function GiftCardsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCards = activeCategory 
    ? GIFT_CARDS.filter(card => card.brand.toUpperCase() === activeCategory)
    : GIFT_CARDS;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black font-heading uppercase tracking-tight text-white flex items-center">
              GIFT <span className="text-yellow-500 ml-3">CARDS</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">ПОДАРОЧНЫЕ КАРТЫ ВСЕХ РЕГИОНОВ</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-accent text-dark' 
                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCards.map(card => (
            <div key={card.id} className="bg-[#161a23]/60 border border-white/5 rounded-[2rem] p-8 flex items-center justify-between hover:border-accent/30 group transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-black/40 rounded-2xl p-3 flex items-center justify-center group-hover:bg-black transition-colors overflow-hidden">
                  <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center text-xl font-black">
                    {card.brand.charAt(0)}
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black font-heading uppercase tracking-tight text-white">{card.brand}</h3>
                  <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">{card.value}</p>
                </div>
              </div>
              
              <div className="text-right space-y-3">
                <p className="text-2xl font-black text-white">{card.price} ₽</p>
                <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest">
                  <ShoppingCart size={14} />
                  <span>КУПИТЬ</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Карты не найдены для выбранной категории.</p>
          </div>
        )}
        
        <div className="bg-[#161a23]/30 border border-white/5 p-16 rounded-[3rem] text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-[2rem] flex items-center justify-center mb-8">
            <Layers className="text-yellow-500" size={40} />
          </div>
          <h2 className="text-4xl font-black font-heading uppercase mb-6 tracking-tight">НУЖНА КАРТА ДРУГОГО РЕГИОНА?</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto mb-10 font-medium leading-relaxed uppercase tracking-wide opacity-80">
            Мы поставляем карты из Турции, США, ОАЭ, Польши и многих других стран. Если нужного номинала нет на сайте, наша поддержка поможет оформить индивидуальный заказ.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-dark px-16 py-6 rounded-2xl font-black text-xl uppercase shadow-[0_10px_40px_rgba(234,179,8,0.2)] transition-all active:scale-95 tracking-tighter">
            СВЯЗАТЬСЯ С НАМИ
          </button>
        </div>
      </div>
    </main>
  );
}
