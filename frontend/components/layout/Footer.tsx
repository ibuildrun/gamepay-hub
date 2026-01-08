import Link from 'next/link';
import { Gamepad2, Send, Star } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0b0e14] border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#7e9dff] rounded-lg flex items-center justify-center">
              <Gamepad2 size={18} className="text-[#0b0e14]" />
            </div>
            <span className="text-lg font-black uppercase tracking-tight">
              GamePay <span className="text-[#7e9dff]">Hub</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Моментальные пополнения и игровые товары с доставкой прямо в ваш аккаунт.
            Работаем честно и прозрачно для геймеров СНГ.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 glass-card flex items-center justify-center hover:bg-[#7e9dff]/20 transition-all text-[#7e9dff]"
            >
              <Send size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 glass-card flex items-center justify-center hover:bg-yellow-600/20 transition-all text-yellow-500"
            >
              <Star size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">
            Услуги
          </h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li>
              <Link href="/steam" className="hover:text-white transition-colors">
                Пополнение Steam
              </Link>
            </li>
            <li>
              <Link href="/telegram" className="hover:text-white transition-colors">
                Telegram Stars
              </Link>
            </li>
            <li>
              <Link href="/games" className="hover:text-white transition-colors">
                Магазин игр
              </Link>
            </li>
            <li>
              <Link href="/giftcards" className="hover:text-white transition-colors">
                Подарочные карты
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">
            Помощь
          </h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Как это работает?
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Поддержка 24/7
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Контакты
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-[0.2em]">
            Статистика
          </h4>
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
          <a href="#" className="hover:text-white cursor-pointer">
            Оферта
          </a>
          <a href="#" className="hover:text-white cursor-pointer">
            Политика
          </a>
        </div>
      </div>
    </footer>
  );
}
