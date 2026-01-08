import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/auth';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

const montserrat = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  weight: ['700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'GamePay Hub — Пополнение Steam, Telegram Stars, Игры',
    template: '%s | GamePay Hub',
  },
  description: 'Быстрое пополнение Steam кошелька, покупка Telegram Stars, игр в подарок и подарочных карт. Оплата картой, криптовалютой.',
  keywords: ['пополнение steam', 'telegram stars', 'купить игру steam', 'подарочные карты', 'gamepay'],
  authors: [{ name: 'GamePay Hub' }],
  creator: 'GamePay Hub',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'GamePay Hub',
    title: 'GamePay Hub — Пополнение Steam, Telegram Stars, Игры',
    description: 'Быстрое пополнение Steam кошелька, покупка Telegram Stars, игр в подарок и подарочных карт.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GamePay Hub',
    description: 'Пополнение Steam, Telegram Stars, игры и подарочные карты',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-dark-900 text-white antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-20 md:pt-24">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
