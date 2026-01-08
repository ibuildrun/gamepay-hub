
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-6 bg-[#0e121a] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] font-bold text-gray-600 uppercase tracking-widest">
        <p>2026 © rodina-cs2.ru - Пополнить Steam в СНГ выгодно с минимальной комиссией!</p>
        <div className="flex items-center space-x-8 mt-4 md:mt-0 opacity-40">
           <a href="#" className="hover:text-white transition-colors">Помощь</a>
           <a href="#" className="hover:text-white transition-colors">Оферта</a>
           <a href="#" className="hover:text-white transition-colors">API</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
