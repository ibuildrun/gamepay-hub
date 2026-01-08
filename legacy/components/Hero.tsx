
import React from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Gift, Heart } from 'lucide-react';

interface HeroProps {
  onOpenPromo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenPromo }) => {
  return (
    <div className="relative w-full rounded-[2.5rem] overflow-hidden group shadow-2xl">
      {/* Background Image with Overlay */}
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
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Эксклюзивные предложения 2025</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-heading mb-6 leading-tight">
            Пополняй Steam <br />
            <span className="text-[#7e9dff]">с выгодой и заботой</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
            Моментальный баланс для твоих любимых игр. Никаких сложностей — только удовольствие от игры.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => {
                const form = document.getElementById('topup-form');
                form?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-[1.5rem] font-black hover:bg-gray-100 transition-all flex items-center justify-center space-x-3 shadow-2xl active:scale-95"
            >
              <span>Пополнить</span>
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={onOpenPromo}
              className="w-full sm:w-auto glass px-10 py-5 rounded-[1.5rem] font-bold flex items-center justify-center space-x-3 hover:bg-white/10 transition-all border-white/10 group/btn active:scale-95"
            >
              <Gift size={20} className="text-[#7e9dff] group-hover/btn:scale-110 transition-transform" />
              <span>Получить бонус</span>
            </button>
          </div>
        </div>

        {/* Dynamic Image Overlay */}
        <div className="hidden lg:block relative">
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
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Акция</p>
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
    </div>
  );
};

export default Hero;
