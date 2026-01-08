import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const steamApi = {
  checkLogin: (login: string) => api.post('/steam/check-login', { login }),
  calculate: (login: string, amount: number) => api.post('/steam/calculate', { login, amount }),
  createOrder: (login: string, amount: number) => api.post('/steam/order', { login, amount }),
};

export const telegramApi = {
  validate: (username: string) => api.post('/telegram/validate', { username }),
  calculate: (stars: number) => api.post('/telegram/calculate', { stars }),
  createOrder: (username: string, stars: number) => api.post('/telegram/order', { username, stars }),
};

export const gamesApi = {
  list: (page = 1, perPage = 20) => api.get('/games', { params: { page, per_page: perPage } }),
  search: (query: string) => api.get('/games/search', { params: { query } }),
  get: (appId: string) => api.get(`/games/${appId}`),
  createOrder: (appId: string, steamLogin: string) => api.post(`/games/${appId}/order`, { steam_login: steamLogin }),
};

export const giftCardsApi = {
  list: (platform?: string) => api.get('/giftcards', { params: { platform } }),
  get: (id: string) => api.get(`/giftcards/${id}`),
  createOrder: (id: string, quantity = 1) => api.post(`/giftcards/${id}/order`, { quantity }),
};

export const ordersApi = {
  list: (params?: { status?: string; type?: string; page?: number }) => api.get('/orders', { params }),
  get: (id: number) => api.get(`/orders/${id}`),
  pay: (id: number) => api.post(`/orders/${id}/pay`),
};

export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};
