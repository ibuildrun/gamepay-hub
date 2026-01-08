'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Package, Search, Filter, Download, RefreshCw,
  CheckCircle, XCircle, Clock, Loader2, Eye, MoreVertical
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface Order {
  id: number;
  type: 'steam' | 'telegram' | 'game' | 'giftcard';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  details: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  pending: { label: 'Ожидает', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  processing: { label: 'В процессе', icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  completed: { label: 'Выполнен', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  failed: { label: 'Ошибка', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  refunded: { label: 'Возврат', icon: RefreshCw, color: 'text-orange-500', bg: 'bg-orange-500/10' },
};

const typeLabels = {
  steam: 'Steam',
  telegram: 'Telegram',
  game: 'Игра',
  giftcard: 'Карта',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.is_admin)) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.is_admin) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setIsLoading(true);
    // Mock data
    setTimeout(() => {
      setOrders([
        { id: 1001, type: 'steam', status: 'completed', amount: 2000, currency: 'RUB', user: { id: 1, name: 'Иван Петров', email: 'ivan@email.com' }, details: { login: 'steamuser1' }, created_at: '2026-01-08T14:30:00Z', updated_at: '2026-01-08T14:32:00Z' },
        { id: 1000, type: 'telegram', status: 'processing', amount: 550, currency: 'RUB', user: { id: 2, name: 'Мария Сидорова', email: 'maria@email.com' }, details: { username: 'teleuser', stars: 250 }, created_at: '2026-01-08T14:25:00Z', updated_at: '2026-01-08T14:25:00Z' },
        { id: 999, type: 'game', status: 'completed', amount: 1999, currency: 'RUB', user: { id: 3, name: 'Алексей Козлов', email: 'alex@email.com' }, details: { game: 'Cyberpunk 2077', login: 'gamer123' }, created_at: '2026-01-08T14:20:00Z', updated_at: '2026-01-08T14:22:00Z' },
        { id: 998, type: 'giftcard', status: 'pending', amount: 1100, currency: 'RUB', user: { id: 4, name: 'Елена Новикова', email: 'elena@email.com' }, details: { brand: 'Steam', value: '1000₽' }, created_at: '2026-01-08T14:15:00Z', updated_at: '2026-01-08T14:15:00Z' },
        { id: 997, type: 'steam', status: 'failed', amount: 5000, currency: 'RUB', user: { id: 5, name: 'Дмитрий Волков', email: 'dmitry@email.com' }, details: { login: 'steamfail', error: 'Payment timeout' }, created_at: '2026-01-08T14:10:00Z', updated_at: '2026-01-08T14:15:00Z' },
        { id: 996, type: 'telegram', status: 'completed', amount: 1990, currency: 'RUB', user: { id: 1, name: 'Иван Петров', email: 'ivan@email.com' }, details: { username: 'ivanpetrov', stars: 1000 }, created_at: '2026-01-08T13:00:00Z', updated_at: '2026-01-08T13:02:00Z' },
        { id: 995, type: 'steam', status: 'refunded', amount: 3000, currency: 'RUB', user: { id: 6, name: 'Ольга Смирнова', email: 'olga@email.com' }, details: { login: 'olgasteam', refund_reason: 'User request' }, created_at: '2026-01-08T12:00:00Z', updated_at: '2026-01-08T14:00:00Z' },
      ]);
      setIsLoading(false);
    }, 500);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = search === '' || 
      order.id.toString().includes(search) ||
      order.user.email.toLowerCase().includes(search.toLowerCase()) ||
      order.user.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (authLoading || !user?.is_admin) {
    return null;
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black font-heading uppercase tracking-tight flex items-center space-x-2">
                <Package className="text-accent" />
                <span>Заказы</span>
              </h1>
              <p className="text-sm text-gray-500">{orders.length} заказов всего</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            <Download size={16} />
            <span>Экспорт CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Поиск по ID, email, имени..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-accent/50 outline-none"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:border-accent/50 outline-none"
          >
            <option value="all">Все статусы</option>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:border-accent/50 outline-none"
          >
            <option value="all">Все типы</option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <button
            onClick={loadOrders}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Orders Table */}
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto mb-4" size={32} />
              <p className="text-gray-500">Загрузка заказов...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500">Заказы не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/20">
                  <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Тип</th>
                    <th className="p-4">Пользователь</th>
                    <th className="p-4">Сумма</th>
                    <th className="p-4">Статус</th>
                    <th className="p-4">Дата</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;
                    return (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono text-sm font-bold">#{order.id}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-white/5 rounded-lg text-xs font-bold">
                            {typeLabels[order.type]}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-sm">{order.user.name}</p>
                            <p className="text-xs text-gray-500">{order.user.email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-bold">{order.amount.toLocaleString()} ₽</td>
                        <td className="p-4">
                          <div className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-lg ${status.bg}`}>
                            <StatusIcon size={12} className={`${status.color} ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                            <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString('ru-RU')}
                        </td>
                        <td className="p-4">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Eye size={16} className="text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
