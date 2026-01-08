import Link from 'next/link';
import { Wallet, Send, Heart, Layers, Zap, Shield, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

const services = [
  {
    title: 'STEAM',
    description: 'ПОПОЛНЕНИЕ КОШЕЛЬКА 0% КОМИССИЯ',
    icon: Wallet,
    href: '/steam',
  },
  {
    title: 'TELEGRAM STARS',
    description: 'ЗВЕЗДЫ И ПРЕМИУМ ПОДПИСКИ',
    icon: Send,
    href: '/telegram',
  },
  {
    title: 'ИГРЫ ГИФТОМ',
    description: 'ЛЮБАЯ ИГРА ИЗ STEAM НА ВАШ АККАУНТ',
    icon: Heart,
    href: '/games',
  },
  {
    title: 'GIFT CARDS',
    description: 'ПОДАРОЧНЫЕ КАРТЫ ВСЕХ РЕГИОНОВ',
    icon: Layers,
    href: '/giftcards',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 space-y-24">
      {/* Hero Section */}
      <section className="relative w-full rounded-[2.5rem] overflow-hidden group shadow-2xl">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200"
            alt="Hero background"
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14] via-[#0b0e14]/90 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 py-12 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md">
              <Sparkles size={16} className="text-[#7e9dff]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                Эксклюзивные предложения 2025
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-heading mb-6 leading-tight">
              Пополняй Steam <br />
              <span className="text-[#7e9dff]">с выгодой и заботой</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
              Моментальный баланс для твоих любимых игр. Никаких сложностей — только
              удовольствие от игры.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/steam"
                className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-[1.5rem] font-black hover:bg-gray-100 transition-all flex items-center justify-center space-x-3 shadow-2xl active:scale-95"
              >
                <span>Пополнить</span>
                <ChevronRight size={20} />
              </Link>
              <button className="w-full sm:w-auto glass px-10 py-5 rounded-[1.5rem] font-bold flex items-center justify-center space-x-3 hover:bg-white/10 transition-all border-white/10 group/btn active:scale-95">
                <Heart size={20} className="text-[#7e9dff] group-hover/btn:scale-110 transition-transform" />
                <span>Получить бонус</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:block relative mt-12 md:mt-0">
            <div className="absolute -inset-12 bg-gradient-to-tr from-[#7e9dff]/30 to-blue-900/30 blur-[80px] rounded-full animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400"
              className="w-[360px] h-[360px] object-cover rounded-[3.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 border-8 border-white/5"
              alt="Gamer Promo"
            />
            <div className="absolute -bottom-8 -left-8 glass p-5 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#7e9dff] to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="text-white" size={24} fill="white" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Акция
                  </p>
                  <p className="text-base font-black">Бонусы x2 при первом пополнении</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-10 left-16 hidden md:flex space-x-3 items-center">
          <div className="w-12 h-1 bg-[#7e9dff] rounded-full"></div>
          <div className="w-4 h-1 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
          <div className="w-4 h-1 bg-white/20 rounded-full hover:bg-white/40 cursor-pointer transition-colors"></div>
        </div>
      </section>

      {/* Services Section */}
      <section>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="shrink-0">
            <h2 className="text-3xl font-black font-heading uppercase tracking-tight">
              Наши сервисы
            </h2>
            <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest font-bold opacity-60">
              Лучшие предложения для вашего гейминга
            </p>
          </div>
          <div className="h-px bg-white/5 flex-grow mx-8 hidden lg:block"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.href}
                href={service.href}
                className="glass-card p-10 flex flex-col items-center text-center space-y-6 hover:translate-y-[-4px] group active:scale-95 transition-all"
              >
                <div className="w-20 h-20 bg-black/40 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="text-[#7e9dff]" size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black font-heading uppercase tracking-tighter">
                    {service.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed max-w-[160px]">
                    {service.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-black/20 border border-white/5 rounded-[2rem] p-12 overflow-hidden shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
          <div className="pb-8 md:pb-0 md:pr-12 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-[#7e9dff]/10 rounded-2xl flex items-center justify-center text-[#7e9dff]">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Мгновенно</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Средства зачисляются на ваш аккаунт в течение 1-5 минут после оплаты в
                автоматическом режиме.
              </p>
            </div>
          </div>

          <div className="py-8 md:py-0 md:px-12 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-[#7e9dff]/10 rounded-2xl flex items-center justify-center text-[#7e9dff]">
              <Shield size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Безопасно</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Мы используем зашифрованные протоколы и проверенные методы зачисления через
                официальных партнеров.
              </p>
            </div>
          </div>

          <div className="pt-8 md:pt-0 md:pl-12 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 bg-[#7e9dff]/10 rounded-2xl flex items-center justify-center text-[#7e9dff]">
              <HelpCircle size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">24/7 Поддержка</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Наша команда поддержки всегда на связи в Telegram и готова помочь с любым
                вопросом или проблемой.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
