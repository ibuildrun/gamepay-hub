
export interface Review {
  id: string;
  user: string;
  rating: number;
  text: string;
  avatar: string;
  date: string;
}

export interface Donor {
  id: string;
  name: string;
  amount: number;
  avatar: string;
  rank: number;
}

export interface Game {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  region: string;
}

export interface GiftCard {
  id: string;
  brand: string;
  value: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  user: string;
  service: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}

export type ViewType = 'home' | 'steam' | 'telegram' | 'games' | 'giftcards' | 'profile' | 'admin';
