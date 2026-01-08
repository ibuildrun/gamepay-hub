'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Calendar, History, Settings, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/5 rounded-3xl" />
            <div className="h-64 bg-white/5 rounded-3xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const menuItems = [
    { href: '/profile/orders', icon: History, label: 'История заказов', desc: 'Все ваши покупки и транзакции' },
    { href: '/profile/settings', icon: Settings, label: 'Настройки', desc: 'Изменить данные аккаунта' },
  ];

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black font-heading uppercase tracking-tight">
            Мой <span className="text-accent">профиль</span>
          </h1>
        </div>

        {/* User Card */}
        <div className="glass-card p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-accent/20 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <User size={40} className="text-accent" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-black">{user.name}</h2>
              {user.telegram_username && (
                <p className="text-accent text-sm font-bold">@{user.telegram_username}</p>
              )}
              
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail size={14} />
                  <span>{user.email || 'Email не указан'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>С {new Date(user.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</span>
                </div>
                {user.is_admin && (
                  <div className="flex items-center space-x-2 text-accent">
                    <Shield size={14} />
                    <span>Администратор</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card p-6 flex items-center justify-between group hover:border-accent/30 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
          
          {user.is_admin && (
            <Link
              href="/admin"
              className="glass-card p-6 flex items-center justify-between group hover:border-yellow-500/30 transition-all border-yellow-500/10"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  <Shield size={24} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-bold">Админ-панель</h3>
                  <p className="text-sm text-gray-500">Управление заказами и пользователями</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-500 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
