'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Wallet, Send, Gamepad2, Layers, Menu, X, User, ShoppingCart, LogOut, Settings, History } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { AuthModal } from '@/components/auth/AuthModal';

const navLinks = [
  { href: '/steam', label: 'Steam', icon: Wallet },
  { href: '/telegram', label: 'Telegram', icon: Send },
  { href: '/games', label: 'Игры', icon: Gamepad2 },
  { href: '/giftcards', label: 'Карты', icon: Layers },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5 h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4 md:space-x-10">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(126,157,255,0.4)] group-hover:scale-105 transition-transform">
                <Heart className="text-dark" size={20} fill="#0b0e14" />
              </div>
              <span className="text-lg md:text-xl font-black font-heading tracking-tighter uppercase text-white">
                Game<span className="text-accent">Hub</span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center space-x-1 text-[13px] font-bold text-gray-400">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-xl transition-all hover:text-white flex items-center space-x-2 ${
                      isActive ? 'bg-white/5 text-white' : ''
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-accent' : ''} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              href="/steam"
              className="hidden sm:flex items-center space-x-2 bg-accent hover:opacity-90 px-5 py-2.5 rounded-xl text-sm font-black text-dark transition-all shadow-lg active:scale-95"
            >
              <ShoppingCart size={18} />
              <span>Пополнить</span>
            </Link>

            {isLoading ? (
              <div className="w-24 h-10 bg-white/5 rounded-xl animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-300 transition-all"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                      <User size={14} className="text-accent" />
                    </div>
                  )}
                  <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-card p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                      <p className="font-bold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm">Профиль</span>
                    </Link>
                    
                    <Link
                      href="/profile/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <History size={16} className="text-gray-400" />
                      <span className="text-sm">История заказов</span>
                    </Link>
                    
                    {user.is_admin && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Settings size={16} className="text-gray-400" />
                        <span className="text-sm">Админ-панель</span>
                      </Link>
                    )}
                    
                    <div className="border-t border-white/5 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                      >
                        <LogOut size={16} />
                        <span className="text-sm">Выйти</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-300 transition-all"
              >
                <User size={18} />
                <span className="hidden md:inline">Войти</span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0d1117] border-b border-white/10 p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left p-4 glass-card flex items-center space-x-4"
                >
                  <Icon size={20} className="text-accent" />
                  <span className="font-bold">{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
