
import React from 'react';
import { 
  BarChart3, Users, ShoppingCart, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Package, UserPlus,
  Settings, Search, MoreVertical, CheckCircle2, Clock, AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Order } from '../types';

const STATS = [
  { label: 'Выручка (мес)', value: '1.2M ₽', change: '+12.5%', trend: 'up', icon: <TrendingUp className="text-green-500" /> },
  { label: 'Новые юзеры', value: '1,420', change: '+18.2%', trend: 'up', icon: <UserPlus className="text-[#7e9dff]" /> },
  { label: 'Заказы сегодня', value: '342', change: '-4.1%', trend: 'down', icon: <ShoppingCart className="text-yellow-500" /> },
  { label: 'Средний чек', value: '1,240 ₽', change: '+2.4%', trend: 'up', icon: <BarChart3 className="text-purple-500" /> },
];

const RECENT_ORDERS: Order[] = [
  { id: 'GP-9921', user: 'katya_gamer', service: 'Steam Refill', amount: '1,500 ₽', status: 'completed', date: '2 мин назад' },
  { id: 'GP-9920', user: 'nikita_pro', service: 'Hogwarts Legacy', amount: '2,490 ₽', status: 'pending', date: '5 мин назад' },
  { id: 'GP-9919', user: 'elena_m', service: 'Telegram Stars', amount: '550 ₽', status: 'completed', date: '12 мин назад' },
  { id: 'GP-9918', user: 'dima_cs', service: 'Steam Refill', amount: '10,000 ₽', status: 'failed', date: '20 мин назад' },
  { id: 'GP-9917', user: 'sofi_art', service: 'Xbox Card 25$', amount: '2,300 ₽', status: 'completed', date: '1 час назад' },
];

const AdminView: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-heading uppercase tracking-tight">Admin <span className="text-[#7e9dff]">Dashboard</span></h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Управление и мониторинг платформы</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по ID/Юзеру..." 
              className="bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-6 text-sm focus:border-[#7e9dff] outline-none transition-all w-64"
            />
          </div>
          <button className="glass-card p-3 hover:bg-[#7e9dff]/10 transition-all text-gray-400 hover:text-white">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="glass-card p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                {stat.icon}
              </div>
              <div className={`flex items-center space-x-1 text-[10px] font-black uppercase ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Orders Table */}
        <div className="xl:col-span-2 glass-card">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight">Последние транзакции</h3>
            <button className="text-[10px] font-black uppercase text-[#7e9dff] hover:underline">Экспорт CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-gray-600 border-b border-white/5">
                  <th className="px-8 py-6">ID</th>
                  <th className="px-8 py-6">Пользователь</th>
                  <th className="px-8 py-6">Услуга</th>
                  <th className="px-8 py-6">Сумма</th>
                  <th className="px-8 py-6">Статус</th>
                  <th className="px-8 py-6 text-right">Время</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                    <td className="px-8 py-6 font-black text-xs text-gray-500">#{order.id}</td>
                    <td className="px-8 py-6 font-bold text-[#7e9dff]">{order.user}</td>
                    <td className="px-8 py-6 text-gray-400">{order.service}</td>
                    <td className="px-8 py-6 font-black text-white">{order.amount}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        {order.status === 'completed' && <CheckCircle2 size={14} className="text-green-500" />}
                        {order.status === 'pending' && <Clock size={14} className="text-yellow-500" />}
                        {order.status === 'failed' && <AlertCircle size={14} className="text-red-500" />}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'completed' ? 'text-green-500' : 
                          order.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {order.status === 'completed' ? 'Успешно' : 
                           order.status === 'pending' ? 'В обработке' : 'Отмена'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right text-[10px] font-bold text-gray-600 uppercase">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Быстрые действия</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="w-full bg-[#7e9dff] hover:opacity-90 text-[#0b0e14] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-95">
                Рассылка в Telegram
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/5 transition-all">
                Добавить игру
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/5 transition-all">
                Настройка курсов
              </button>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Запросы в саппорт</h3>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#7e9dff]/20 transition-all">
                    {/* Fixed: MessageSquare icon now correctly imported from lucide-react */}
                    <MessageSquare size={18} className="text-gray-500 group-hover:text-[#7e9dff]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">Проблема с пополнением #GP-123</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">От: user_882 • 5 мин назад</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-[10px] font-black text-[#7e9dff] uppercase tracking-widest mt-8 hover:underline">Посмотреть все тикеты</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
