'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Search, RefreshCw, Shield, ShieldOff,
  User, Mail, Calendar, Package, Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface UserData {
  id: number;
  name: string;
  email: string;
  telegram_username?: string;
  is_admin: boolean;
  orders_count: number;
  total_spent: number;
  created_at: string;
  last_login?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.is_admin)) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.is_admin) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    setIsLoading(true);
    // Mock data
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Иван Петров', email: 'ivan@email.com', telegram_username: 'ivanpetrov', is_admin: false, orders_count: 15, total_spent: 45000, created_at: '2025-12-01T10:00:00Z', last_login: '2026-01-08T14:30:00Z' },
        { id: 2, name: 'Мария Сидорова', email: 'maria@email.com', is_admin: false, orders_count: 8, total_spent: 12500, created_at: '2025-12-15T12:00:00Z', last_login: '2026-01-08T10:00:00Z' },
        { id: 3, name: 'Алексей Козлов', email: 'alex@email.com', telegram_username: 'alexkozlov', is_admin: true, orders_count: 3, total_spent: 5000, created_at: '2025-11-20T08:00:00Z', last_login: '2026-01-08T14:00:00Z' },
        { id: 4, name: 'Елена Новикова', email: 'elena@email.com', is_admin: false, orders_count: 22, total_spent: 78000, created_at: '2025-10-05T14:00:00Z', last_login: '2026-01-07T18:00:00Z' },
        { id: 5, name: 'Дмитрий Волков', email: 'dmitry@email.com', telegram_username: 'dmitryv', is_admin: false, orders_count: 5, total_spent: 15000, created_at: '2026-01-01T09:00:00Z', last_login: '2026-01-08T12:00:00Z' },
      ]);
      setIsLoading(false);
    }, 500);
  };

  const filteredUsers = users.filter(u => 
    search === '' ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.telegram_username?.toLowerCase().includes(search.toLowerCase())
  );

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
                <Users className="text-accent" />
                <span>Пользователи</span>
              </h1>
              <p className="text-sm text-gray-500">{users.length} пользователей</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Поиск по имени, email, telegram..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-accent/50 outline-none"
            />
          </div>
          <button
            onClick={loadUsers}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Users Grid */}
        {isLoading ? (
          <div className="glass-card p-12 text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-500">Загрузка пользователей...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Users size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500">Пользователи не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((userData) => (
              <div key={userData.id} className="glass-card p-6 hover:border-accent/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <User size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center space-x-2">
                        <span>{userData.name}</span>
                        {userData.is_admin && (
                          <Shield size={14} className="text-yellow-500" />
                        )}
                      </h3>
                      {userData.telegram_username && (
                        <p className="text-xs text-accent">@{userData.telegram_username}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Mail size={14} />
                    <span className="truncate">{userData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar size={14} />
                    <span>С {new Date(userData.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Заказов</p>
                    <p className="font-bold">{userData.orders_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Потрачено</p>
                    <p className="font-bold">{(userData.total_spent / 1000).toFixed(1)}K ₽</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-colors">
                    Заказы
                  </button>
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    {userData.is_admin ? (
                      <ShieldOff size={14} className="text-yellow-500" />
                    ) : (
                      <Shield size={14} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
