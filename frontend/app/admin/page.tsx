'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Package, CreditCard, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle,
  ChevronRight, Settings
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
  revenueChange: number;
  ordersChange: number;
}

interface RecentOrder {
  id: number;
  type: string;
  status: string;
  amount: number;
  user: string;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.is_admin)) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.is_admin) {
      // Mock data for demo
      setStats({
        totalOrders: 1247,
        totalRevenue: 2456780,
        totalUsers: 892,
        pendingOrders: 12,
        todayOrders: 47,
        todayRevenue: 89450,
        revenueChange: 12.5,
        ordersChange: 8.3,
      });

      setRecentOrders([
        { id: 1001, type: 'steam', status: 'completed', amount: 2000, user: 'user@email.com', created_at: '2026-01-08T14:30:00Z' },
        { id: 1000, type: 'telegram', status: 'processing', amount: 550, user: 'another@email.com', created_at: '2026-01-08T14:25:00Z' },
        { id: 999, type: 'game', status: 'completed', amount: 1999, user: 'gamer@email.com', created_at: '2026-01-08T14:20:00Z' },
        { id: 998, type: 'giftcard', status: 'pending', amount: 1100, user: 'buyer@email.com', created_at: '2026-01-08T14:15:00Z' },
        { id: 997, type: 'steam', status: 'failed', amount: 5000, user: 'test@email.com', created_at: '2026-01-08T14:10:00Z' },
      ]);
    }
  }, [user]);

  if (isLoading || !user?.is_admin) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/5 rounded-xl w-1/4" />
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const statCards = [
    { 
      label: 'Всего заказов', 
      value: stats?.totalOrders.toLocaleString() || '0', 
      change: stats?.ordersChange || 0,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Общая выручка', 
      value: `${((stats?.totalRevenue || 0) / 1000).toFixed(0)}K ₽`, 
      change: stats?.revenueChange || 0,
      icon: CreditCard,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      label: 'Пользователей', 
      value: stats?.totalUsers.toLocaleString() || '0', 
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Ожидают оплаты', 
      value: stats?.pendingOrders.toString() || '0', 
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
  ];

  const statusColors: Record<string, string> = {
    completed: 'text-green-500',
    processing: 'text-blue-500',
    pending: 'text-yellow-500',
    failed: 'text-red-500',
  };

  const typeLabels: Record<string, string> = {
    steam: 'Steam',
    telegram: 'Telegram',
    game: 'Игра',
    giftcard: 'Карта',
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black font-heading uppercase tracking-tight flex items-center space-x-3">
              <LayoutDashboard className="text-accent" />
              <span>Админ-панель</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Управление GamePay Hub</p>
          </div>
          <Link
            href="/admin/settings"
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Settings size={20} />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon size={24} className={stat.color} />
                  </div>
                  {stat.change !== undefined && (
                    <div className={`flex items-center space-x-1 text-sm font-bold ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <span>{Math.abs(stat.change)}%</span>
                    </div>
                  )}
                </div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Today Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <TrendingUp className="text-accent" size={20} />
              <span>Сегодня</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-2xl font-black">{stats?.todayOrders || 0}</p>
                <p className="text-sm text-gray-500">Заказов</p>
              </div>
              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-2xl font-black">{((stats?.todayRevenue || 0) / 1000).toFixed(1)}K ₽</p>
                <p className="text-sm text-gray-500">Выручка</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Быстрые действия</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/orders" className="bg-black/20 hover:bg-black/30 rounded-xl p-4 transition-colors">
                <Package size={20} className="text-accent mb-2" />
                <p className="text-sm font-bold">Заказы</p>
              </Link>
              <Link href="/admin/users" className="bg-black/20 hover:bg-black/30 rounded-xl p-4 transition-colors">
                <Users size={20} className="text-accent mb-2" />
                <p className="text-sm font-bold">Пользователи</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Последние заказы</h3>
            <Link href="/admin/orders" className="text-sm text-accent hover:underline flex items-center space-x-1">
              <span>Все заказы</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="pb-4">ID</th>
                  <th className="pb-4">Тип</th>
                  <th className="pb-4">Пользователь</th>
                  <th className="pb-4">Сумма</th>
                  <th className="pb-4">Статус</th>
                  <th className="pb-4">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono text-sm">#{order.id}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-white/5 rounded-lg text-xs font-bold">
                        {typeLabels[order.type] || order.type}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-400">{order.user}</td>
                    <td className="py-4 font-bold">{order.amount.toLocaleString()} ₽</td>
                    <td className="py-4">
                      <span className={`text-xs font-bold uppercase ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
