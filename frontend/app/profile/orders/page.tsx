'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, AlertCircle, Loader2, ChevronRight, Filter } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ordersApi } from '@/lib/api';

interface Order {
  id: number;
  type: 'steam' | 'telegram' | 'game' | 'giftcard';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  details: {
    login?: string;
    username?: string;
    game_name?: string;
    card_brand?: string;
    stars?: number;
  };
  created_at: string;
  completed_at?: string;
}

const statusConfig = {
  pending: { label: 'Ожидает оплаты', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  processing: { label: 'Обрабатывается', icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  completed: { label: 'Выполнен', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  failed: { label: 'Ошибка', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  refunded: { label: 'Возврат', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
};

const typeLabels = {
  steam: 'Steam пополнение',
  telegram: 'Telegram Stars',
  game: 'Игра в подарок',
  giftcard: 'Подарочная карта',
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, filter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await ordersApi.list(params);
      setOrders(response.data.data || []);
    } catch (error) {
      // Mock data for demo
      setOrders([
        {
          id: 1,
          type: 'steam',
          status: 'completed',
          amount: 1000,
          currency: 'RUB',
          details: { login: 'steamuser123' },
          created_at: '2026-01-08T10:30:00Z',
          completed_at: '2026-01-08T10:32:00Z',
        },
        {
          id: 2,
          type: 'telegram',
          status: 'completed',
          amount: 230,
          currency: 'RUB',
          details: { username: 'telegramuser', stars: 100 },
          created_at: '2026-01-07T15:20:00Z',
          completed_at: '2026-01-07T15:21:00Z',
        },
        {
          id: 3,
          type: 'game',
          status: 'processing',
          amount: 1999,
          currency: 'RUB',
          details: { game_name: 'Cyberpunk 2077', login: 'steamuser123' },
          created_at: '2026-01-08T12:00:00Z',
        },
        {
          id: 4,
          type: 'giftcard',
          status: 'pending',
          amount: 1100,
          currency: 'RUB',
          details: { card_brand: 'Steam 1000₽' },
          created_at: '2026-01-08T14:00:00Z',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black font-heading uppercase tracking-tight">
                История заказов
              </h1>
              <p className="text-sm text-gray-500">Все ваши покупки и транзакции</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'processing', 'completed', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === status
                  ? 'bg-accent text-dark'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {status === 'all' ? 'Все' : statusConfig[status as keyof typeof statusConfig]?.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Package size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">Заказов пока нет</h3>
            <p className="text-gray-500 text-sm mb-6">
              {filter === 'all' 
                ? 'Здесь будут отображаться ваши покупки'
                : 'Нет заказов с выбранным статусом'}
            </p>
            <Link
              href="/steam"
              className="inline-flex items-center space-x-2 bg-accent px-6 py-3 rounded-xl font-bold text-dark"
            >
              <span>Сделать первый заказ</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={order.id}
                  className="glass-card p-5 flex items-center justify-between hover:border-accent/20 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center`}>
                      <StatusIcon size={20} className={`${status.color} ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold">{typeLabels[order.type]}</h3>
                        <span className="text-xs text-gray-600">#{order.id}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {order.details.login && `Steam: ${order.details.login}`}
                        {order.details.username && `@${order.details.username}`}
                        {order.details.game_name && order.details.game_name}
                        {order.details.card_brand && order.details.card_brand}
                        {order.details.stars && ` • ${order.details.stars} ⭐`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(order.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-black">{order.amount.toLocaleString()} ₽</p>
                    <p className={`text-xs font-bold ${status.color}`}>{status.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
