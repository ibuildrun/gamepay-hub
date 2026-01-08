
import React from 'react';
import { User, Wallet, Clock, Settings, LogOut, ChevronRight, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { ViewType } from '../types';

interface ProfileViewProps {
  onNavigate: (view: ViewType) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-card p-8 text-center space-y-4">
          <div className="relative inline-block">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" className="w-24 h-24 rounded-[2rem] mx-auto border-4 border-white/5" alt="Profile" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#7e9dff] rounded-xl flex items-center justify-center shadow-lg border-2 border-[#0b0e14]">
              <ShieldCheck size={16} className="text-[#0b0e14]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Alexander777</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">ID: 44290123</p>
          </div>
          <button className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Редактировать</button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Меню</div>
          <div className="flex flex-col">
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all text-[#7e9dff] bg-[#7e9dff]/5">
              <div className="flex items-center space-x-4"><User size={18} /> <span className="text-sm font-bold">Профиль</span></div>
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#7e9dff]/10 transition-all border-l-4 border-transparent hover:border-[#7e9dff]"
            >
              <div className="flex items-center space-x-4"><LayoutDashboard size={18} className="text-[#7e9dff]" /> <span className="text-sm font-bold">Админ-панель</span></div>
              <ChevronRight size={16} />
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center space-x-4"><Clock size={18} /> <span className="text-sm font-bold">История заказов</span></div>
              <ChevronRight size={16} />
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center space-x-4"><Wallet size={18} /> <span className="text-sm font-bold">Баланс и бонусы</span></div>
              <ChevronRight size={16} />
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center space-x-4"><Settings size={18} /> <span className="text-sm font-bold">Настройки</span></div>
              <ChevronRight size={16} />
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-600/5 transition-all text-red-400">
              <div className="flex items-center space-x-4"><LogOut size={18} /> <span className="text-sm font-bold">Выйти</span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 bg-gradient-to-br from-[#7e9dff]/20 to-transparent border-[#7e9dff]/20">
            <h3 className="text-xs font-black uppercase text-gray-400 mb-2">Основной баланс</h3>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-black text-white">4,250 ₽</p>
              <button className="bg-[#7e9dff] text-[#0b0e14] px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Пополнить</button>
            </div>
          </div>
          <div className="glass-card p-8 bg-gradient-to-br from-green-600/20 to-transparent border-green-500/20">
            <h3 className="text-xs font-black uppercase text-gray-400 mb-2">Бонусные баллы</h3>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-black text-white">450 GP</p>
              <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Потратить</button>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-tight">Последние заказы</h3>
            <button className="text-[10px] font-black uppercase text-[#7e9dff] hover:underline">См. все</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-gray-600 border-b border-white/5">
                  <th className="px-8 py-4">ID Заказа</th>
                  <th className="px-8 py-4">Услуга</th>
                  <th className="px-8 py-4">Сумма</th>
                  <th className="px-8 py-4">Статус</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-8 py-6 font-bold">#GP-124401</td>
                  <td className="px-8 py-6 text-gray-400">Steam Пополнение</td>
                  <td className="px-8 py-6 font-bold text-white">2,500 ₽</td>
                  <td className="px-8 py-6"><span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Выполнен</span></td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-8 py-6 font-bold">#GP-124398</td>
                  <td className="px-8 py-6 text-gray-400">Telegram Stars (100⭐)</td>
                  <td className="px-8 py-6 font-bold text-white">230 ₽</td>
                  <td className="px-8 py-6"><span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Выполнен</span></td>
                </tr>
                <tr className="hover:bg-white/5 transition-all">
                  <td className="px-8 py-6 font-bold">#GP-124395</td>
                  <td className="px-8 py-6 text-gray-400">The Sims 4: Luxury (Gift)</td>
                  <td className="px-8 py-6 font-bold text-white">990 ₽</td>
                  <td className="px-8 py-6"><span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">В процессе</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
