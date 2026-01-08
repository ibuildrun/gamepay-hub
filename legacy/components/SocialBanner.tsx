
import React from 'react';
import { Send, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const SocialBanner: React.FC = () => {
  return (
    <div className="relative w-full h-80 rounded-[2rem] overflow-hidden group mb-8">
      {/* Background with masked image */}
      <div className="absolute inset-0 bg-[#161a23]">
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[3s]" 
          alt="CS2 Characters"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#161a23] via-[#161a23]/80 to-transparent"></div>
      </div>

      <div className="relative h-full px-12 flex flex-col justify-center max-w-lg z-10">
        <h2 className="text-5xl font-black font-heading text-white mb-4 leading-none">Наши соц. сети</h2>
        <p className="text-gray-400 text-sm mb-8">Подписывайтесь на наши соц. сети, чтобы быть в курсе новых событий!</p>
        
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 px-6 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">
             <MessageSquare size={16} className="text-gray-400" />
             <span>Отправить жалобу</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest shadow-xl">
             <Send size={16} />
             <span>Telegram</span>
          </button>
        </div>
      </div>

      {/* Slider dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
         <div className="w-2 h-2 bg-white/20 rounded-full"></div>
         <div className="w-6 h-2 bg-blue-600 rounded-full"></div>
         <div className="w-2 h-2 bg-white/20 rounded-full"></div>
      </div>

      {/* Slider Arrows */}
      <div className="absolute right-12 bottom-12 flex space-x-4">
         <button className="p-4 bg-black/40 hover:bg-black/60 rounded-full transition-all border border-white/5">
            <ChevronLeft size={20} />
         </button>
         <button className="p-4 bg-black/40 hover:bg-black/60 rounded-full transition-all border border-white/5">
            <ChevronRight size={20} />
         </button>
      </div>
    </div>
  );
};

export default SocialBanner;
