
import React from 'react';
import { ViewType } from '../types';
import { Wallet, Send, Gamepad2, Layers, Zap, Shield, HelpCircle, ChevronRight, Sparkles, Star, Heart } from 'lucide-react';
import Hero from '../components/Hero';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenPromo: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenPromo }) => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <Hero onOpenPromo={onOpenPromo} />

      {/* Services Row */}
      <section>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="shrink-0">
            <h2 className="text-3xl font-black font-heading uppercase tracking-tight">Наши сервисы</h2>
            <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest font-bold opacity-60">Лучшие предложения для вашего гейминга</p>
          </div>
          <div className="h-px bg-white/5 flex-grow mx-8 hidden lg:block"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard 
            icon={<Wallet className="text-[#7e9dff]" size={28} />} 
            title="STEAM" 
            desc="ПОПОЛНЕНИЕ КОШЕЛЬКА 0% КОМИССИЯ"
            onClick={() => onNavigate('steam')}
          />
          <ServiceCard 
            icon={<Send className="text-[#7e9dff]" size={28} />} 
            title="TELEGRAM STARS" 
            desc="ЗВЕЗДЫ И ПРЕМИУМ ПОДПИСКИ"
            onClick={() => onNavigate('telegram')}
          />
          <ServiceCard 
            icon={<Heart className="text-[#7e9dff]" size={28} fill="currentColor" />} 
            title="ИГРЫ ГИФТОМ" 
            desc="ЛЮБАЯ ИГРА ИЗ STEAM НА ВАШ АККАУНТ"
            onClick={() => onNavigate('games')}
          />
          <ServiceCard 
            icon={<Layers className="text-[#7e9dff]" size={28} />} 
            title="GIFT CARDS" 
            desc="ПОДАРОЧНЫЕ КАРТЫ ВСЕХ РЕГИОНОВ"
            onClick={() => onNavigate('giftcards')}
          />
        </div>
      </section>

      {/* Benefits - Updated to match screenshot and blue color request */}
      <section className="bg-black/20 border border-white/5 rounded-[2rem] p-12 overflow-hidden shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
          <div className="pb-8 md:pb-0 md:pr-12 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-[#7e9dff]/10 rounded-2xl flex items-center justify-center text-[#7e9dff]">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Мгновенно</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">Средства зачисляются на ваш аккаунт в течение 1-5 минут после оплаты в автоматическом режиме.</p>
            </div>
          </div>
          
          <div className="py-8 md:py-0 md:px-12 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-[#7e9dff]/10 rounded-2xl flex items-center justify-center text-[#7e9dff]">
              <Shield size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Безопасно</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">Мы используем зашифрованные протоколы и проверенные методы зачисления через официальных партнеров.</p>
            </div>
          </div>

          <div className="pt-8 md:pt-0 md:pl-12 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-[#7e9dff]/10 rounded-2xl flex items-center justify-center text-[#7e9dff]">
              <HelpCircle size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">24/7 Поддержка</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">Наша команда поддержки всегда на связи в Telegram и готова помочь с любым вопросом или проблемой.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ServiceCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <button onClick={onClick} className="glass-card p-10 flex flex-col items-center text-center space-y-6 hover:translate-y-[-4px] group active:scale-95 transition-all">
    <div className="w-20 h-20 bg-black/40 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-black font-heading uppercase tracking-tighter">{title}</h3>
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed max-w-[160px]">{desc}</p>
    </div>
  </button>
);

export default HomeView;
