
import React from 'react';
import { Game, GiftCard } from './types';

export const REVIEWS = [
  {
    id: '1',
    user: 'Александра К.',
    rating: 5,
    text: 'Беру тут игры уже полгода. Всегда приходят гифтом вовремя. Спасибо за отличный сервис!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    date: 'Сегодня, 14:20'
  },
  {
    id: '2',
    user: 'BeautyGamer',
    rating: 5,
    text: 'Пополнила Steam через СБП, деньги упали на кошелек через 2 минуты. Очень удобно!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    date: 'Вчера, 18:45'
  },
  {
    id: '3',
    user: 'Elena_S',
    rating: 5,
    text: 'Лучший курс на Telegram Stars. Рекомендую всем, кто не хочет переплачивать в сторах.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    date: '15 янв, 12:00'
  }
];

export const GAMES: Game[] = [
  { id: '1', title: 'The Sims 4: Luxury Stuff', price: 990, image: 'https://images.unsplash.com/photo-1605898965922-383789397621?auto=format&fit=crop&q=80&w=400', region: 'Global' },
  { id: '2', title: 'Hogwarts Legacy', price: 2490, oldPrice: 3990, discount: 37, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400', region: 'CIS' },
  { id: '3', title: 'Baldur\'s Gate 3', price: 1990, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400', region: 'CIS' },
  { id: '4', title: 'Stardew Valley', price: 290, image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=400', region: 'Global' },
];

export const GIFT_CARDS: GiftCard[] = [
  { id: 's1', brand: 'Steam', value: '1000 RUB', price: 1120, image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg' },
  { id: 's2', brand: 'PlayStation', value: '500 TL', price: 1540, image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_logo_colour.svg' },
  { id: 's3', brand: 'Xbox', value: '$25', price: 2300, image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg' },
];

/* Fix: Exporting SERVERS constant to resolve the error in ServerCards.tsx */
export const SERVERS = [
  { id: '1', name: 'AESTHETIC #1', players: 45, max: 100, image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'COZY #2', players: 84, max: 100, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'GIRLS #3', players: 12, max: 100, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'DREAM #4', players: 67, max: 100, image: 'https://images.unsplash.com/photo-1605898965922-383789397621?auto=format&fit=crop&q=80&w=400' },
];
