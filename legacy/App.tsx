
import React, { useState } from 'react';
import { ViewType, GameStatus } from './types';
import { REVIEWS, GAMES, GIFT_CARDS } from './constants';
import { 
  Menu, X, Wallet, Send, Gamepad2, Layers, HelpCircle, 
  MessageSquare, Star, User, Globe, Trophy, Sparkles, 
  Search, Shield, Zap, ShoppingCart, ChevronRight,
  ChevronDown, Heart, LayoutDashboard
} from 'lucide-react';

// Sections
import HomeView from './views/HomeView';
import SteamView from './views/SteamView';
import TelegramView from './views/TelegramView';
import GamesView from './views/GamesView';
import GiftCardsView from './views/GiftCardsView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';
import PromoModal from './components/PromoModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Game state for the mini-game promo
  const [promoStatus, setPromoStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  const navigate = (view: ViewType) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const notifyTelegram = (message: string) => {
    // In a real app, this would be an API call to a Telegram Bot
    console.log(`[Telegram Bot Notification]: ${message}`);
  };

  const handlePlayPromo = () => {
    setPromoStatus(GameStatus.PLAYING);
    // Simulate mini-game check
    setTimeout(() => {
      const win = Math.random() > 0.4; // 60% win chance for engagement
      if (win) {
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        setPromoCode(code);
        setPromoStatus(GameStatus.WON);
        notifyTelegram(`Victory! Promo code issued: ${code}`);
      } else {
        setPromoStatus(GameStatus.LOST);
        notifyTelegram("Loss");
      }
    }, 2500);
  };

  const handleResetPromo = () => {
    setPromoStatus(GameStatus.IDLE);
    setPromoCode(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col selection:bg-[#7e9dff]/30 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5 h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4 md:space-x-10">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 group cursor-pointer" 
              onClick={() => navigate('home')}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#7e9dff] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(126,157,255,0.4)] group-hover:scale-105 transition-transform">
                <Heart className="text-[#0b0e14]" size={20} fill="#0b0e14" />
              </div>
              <span className="text-lg md:text-xl font-black font-heading tracking-tighter uppercase text-white">
                Game<span className="text-[#7e9dff]">Hub</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center space-x-1 text-[13px] font-bold text-gray-400">
              <button onClick={() => navigate('steam')} className={`px-4 py-2 rounded-xl transition-all hover:text-white flex items-center space-x-2 ${currentView === 'steam' ? 'bg-white/5 text-white' : ''}`}>
                <Wallet size={14} className={currentView === 'steam' ? 'text-[#7e9dff]' : ''} />
                <span>Steam</span>
              </button>
              <button onClick={() => navigate('telegram')} className={`px-4 py-2 rounded-xl transition-all hover:text-white flex items-center space-x-2 ${currentView === 'telegram' ? 'bg-white/5 text-white' : ''}`}>
                <Send size={14} className={currentView === 'telegram' ? 'text-[#7e9dff]' : ''} />
                <span>Telegram</span>
              </button>
              <button onClick={() => navigate('games')} className={`px-4 py-2 rounded-xl transition-all hover:text-white flex items-center space-x-2 ${currentView === 'games' ? 'bg-white/5 text-white' : ''}`}>
                <Gamepad2 size={14} className={currentView === 'games' ? 'text-[#7e9dff]' : ''} />
                <span>Игры</span>
              </button>
              <button onClick={() => navigate('giftcards')} className={`px-4 py-2 rounded-xl transition-all hover:text-white flex items-center space-x-2 ${currentView === 'giftcards' ? 'bg-[#7e9dff]/10 text-white' : ''}`}>
                <Layers size={14} className={currentView === 'giftcards' ? 'text-[#7e9dff]' : ''} />
                <span>Карты</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={() => navigate('profile')}
              className="hidden sm:flex items-center space-x-2 bg-[#7e9dff] hover:opacity-90 px-5 py-2.5 rounded-xl text-sm font-black text-[#0b0e14] transition-all shadow-lg active:scale-95"
            >
              <ShoppingCart size={18} />
              <span>Пополнить</span>
            </button>
            
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-300 transition-all"
            >
              <User size={18} />
              <span className="hidden md:inline">Войти</span>
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0d1117] border-b border-white/10 p-4 space-y-2 animate-in slide-in-from-top-4 duration-300">
            <button onClick={() => navigate('steam')} className="w-full text-left p-4 glass-card flex items-center space-x-4">
              <Wallet size={20} className="text-[#7e9dff]" />
              <span className="font-bold">Steam</span>
            </button>
            <button onClick={() => navigate('telegram')} className="w-full text-left p-4 glass-card flex items-center space-x-4">
              <Send size={20} className="text-[#7e9dff]" />
              <span className="font-bold">Telegram Stars</span>
            </button>
            <button onClick={() => navigate('games')} className="w-full text-left p-4 glass-card flex items-center space-x-4">
              <Gamepad2 size={20} className="text-[#7e9dff]" />
              <span className="font-bold">Магазин игр</span>
            </button>
            <button onClick={() => navigate('giftcards')} className="w-full text-left p-4 glass-card flex items-center space-x-4">
              <Layers size={20} className="text-[#7e9dff]" />
              <span className="font-bold">Подарочные карты</span>
            </button>
            <button onClick={() => navigate('admin')} className="w-full text-left p-4 glass-card flex items-center space-x-4 border-[#7e9dff]/20 bg-[#7e9dff]/5">
              <LayoutDashboard size={20} className="text-[#7e9dff]" />
              <span className="font-bold">Админ-панель</span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24 md:pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10">
        {currentView === 'home' && (
          <HomeView 
            onNavigate={navigate} 
            onOpenPromo={() => setIsPromoOpen(true)} 
          />
        )}
        {currentView === 'steam' && <SteamView />}
        {currentView === 'telegram' && <TelegramView />}
        {currentView === 'games' && <GamesView />}
        {currentView === 'giftcards' && <GiftCardsView />}
        {currentView === 'profile' && <ProfileView onNavigate={navigate} />}
        {currentView === 'admin' && <AdminView />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0e14] border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#7e9dff] rounded-lg flex items-center justify-center">
                <Gamepad2 size={18} className="text-[#0b0e14]" />
              </div>
              <span className="text-lg font-black uppercase tracking-tight">GamePay <span className="text-[#7e9dff]">Hub</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Моментальные пополнения и игровые товары с доставкой прямо в ваш аккаунт. 
              Работаем честно и прозрачно для геймеров СНГ.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:bg-[#7e9dff]/20 transition-all text-[#7e9dff]"><Send size={18} /></a>
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:bg-yellow-600/20 transition-all text-yellow-500"><Star size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">Услуги</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><button onClick={() => navigate('steam')} className="hover:text-white transition-colors">Пополнение Steam</button></li>
              <li><button onClick={() => navigate('telegram')} className="hover:text-white transition-colors">Telegram Stars</button></li>
              <li><button onClick={() => navigate('games')} className="hover:text-white transition-colors">Магазин игр</button></li>
              <li><button onClick={() => navigate('giftcards')} className="hover:text-white transition-colors">Подарочные карты</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">Помощь</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Как это работает?</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Поддержка 24/7</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">Статистика</h4>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#7e9dff]">50,000+</span>
                <span className="text-xs text-gray-500 font-bold uppercase">Пополнений</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#7e9dff]">10,000+</span>
                <span className="text-xs text-gray-500 font-bold uppercase">Клиентов</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[11px] font-bold text-gray-600 uppercase tracking-widest gap-4">
          <p>© 2025 GAMEPAY HUB. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          <div className="flex items-center space-x-6 opacity-40">
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('admin')}>Админка</span>
            <span className="hover:text-white cursor-pointer">Оферта</span>
            <span className="hover:text-white cursor-pointer">Политика</span>
          </div>
        </div>
      </footer>

      {/* Promo Game Modal */}
      <PromoModal 
        isOpen={isPromoOpen} 
        onClose={() => setIsPromoOpen(false)} 
        status={promoStatus}
        onPlay={handlePlayPromo}
        promoCode={promoCode}
        onReset={handleResetPromo}
      />

      {/* Refined Auth Modal - Updated to match the screenshot precisely */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsAuthOpen(false)}></div>
          <div className="relative w-full max-w-[480px] bg-[#0d1117] border border-white/5 rounded-[2.5rem] p-10 md:p-12 animate-in zoom-in-95 duration-200 shadow-2xl">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#7e9dff]/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-[#7e9dff]/20">
                <Shield className="text-[#7e9dff]" size={32} />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-2">ВХОД В АККАУНТ</h2>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black opacity-60">БЕЗОПАСНЫЙ ДОСТУП</p>
            </div>

            <div className="space-y-6">
              <button className="w-full bg-[#34a0e0] hover:bg-[#2c8fc9] py-5 rounded-[1.5rem] font-bold flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-[0_10px_30px_rgba(52,160,224,0.3)]">
                <Send size={18} fill="white" className="text-white" />
                <span className="text-sm uppercase tracking-wider font-bold">Войти через Telegram</span>
              </button>

              <div className="flex items-center space-x-4 py-2">
                <div className="h-px bg-white/5 flex-grow"></div>
                <span className="text-[11px] text-gray-600 font-bold uppercase tracking-widest">или</span>
                <div className="h-px bg-white/5 flex-grow"></div>
              </div>

              <div className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-[#0b0e14] border border-white/5 rounded-full py-4 px-8 text-xs font-bold focus:border-[#7e9dff]/30 outline-none transition-all placeholder:text-gray-700 tracking-wider h-14" 
                />
                <input 
                  type="password" 
                  placeholder="Пароль" 
                  className="w-full bg-[#0b0e14] border border-white/5 rounded-full py-4 px-8 text-xs font-bold focus:border-[#7e9dff]/30 outline-none transition-all placeholder:text-gray-700 tracking-wider h-14" 
                />
                
                <button 
                  onClick={() => setIsAuthOpen(false)}
                  className="w-full bg-[#94acff] hover:bg-[#7e9dff] py-5 rounded-[1.5rem] font-black text-[#0b0e14] text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(126,157,255,0.2)] transition-all active:scale-95 mt-4 h-16"
                >
                  ВОЙТИ
                </button>
              </div>

              <p className="text-center text-[10px] text-gray-500 font-black uppercase tracking-[0.15em] mt-8 cursor-pointer hover:text-white transition-colors">
                НЕТ АККАУНТА? ЗАРЕГИСТРИРУЙТЕСЬ
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
