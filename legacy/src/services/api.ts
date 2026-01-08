/**
 * GreenGamePay API Service
 * Интеграция с API для пополнения Steam, Telegram Stars, Gift Games
 * Документация: https://greengamepay.readme.io/reference
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.greengamepay.com';
const API_VERSION = 'v1';

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TokenResponse {
  token: string;
  expires_at: number;
}

export interface SteamAccountInfo {
  login: string;
  country: string;
  country_code: string;
  avatar?: string;
  nickname?: string;
  valid: boolean;
}

export interface OrderCreateRequest {
  service: 'steam' | 'telegram_stars' | 'telegram_premium' | 'gift_game' | 'gift_card';
  login?: string; // Steam login or Telegram username
  amount?: number;
  currency?: string;
  product_id?: string;
  region?: string;
}

export interface OrderResponse {
  order_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  amount_usdt: number;
  payment_address?: string;
  payment_network?: string;
  expires_at?: number;
}

export interface Product {
  id: string;
  service_id: string;
  name: string;
  description?: string;
  price: number;
  price_usdt: number;
  currency: string;
  category: string;
  image?: string;
  region?: string;
  available: boolean;
}

export interface BalanceResponse {
  balance: number;
  currency: string;
  balance_usdt: number;
}

export interface CalculateResponse {
  amount_rub: number;
  amount_usd: number;
  rate: number;
  commission: number;
  total_usdt: number;
}

export interface TelegramStarsRequest {
  username: string;
  stars_count: number;
}

export interface TelegramStarsResponse {
  price_rub: number;
  price_usdt: number;
  commission_percent: number;
}

export interface GameInfo {
  app_id: string;
  sub_id: string;
  name: string;
  description?: string;
  header_image?: string;
  price_by_region: Record<string, number>;
  available_regions: string[];
}

export interface GiftGameOrderRequest {
  sub_id: string;
  steam_login: string;
  region: string;
}

// API Token Management
class TokenManager {
  private token: string | null = null;
  private expiresAt: number = 0;

  async getToken(): Promise<string> {
    if (this.token && Date.now() < this.expiresAt - 60000) {
      return this.token;
    }
    await this.refreshToken();
    return this.token!;
  }

  private async refreshToken(): Promise<void> {
    const apiKey = import.meta.env.VITE_GREENGAMEPAY_API_KEY;
    const apiSecret = import.meta.env.VITE_GREENGAMEPAY_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('API credentials not configured');
    }

    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        api_secret: apiSecret,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to obtain API token');
    }

    const data: ApiResponse<TokenResponse> = await response.json();
    if (data.success && data.data) {
      this.token = data.data.token;
      this.expiresAt = data.data.expires_at * 1000;
    } else {
      throw new Error(data.error || 'Token request failed');
    }
  }

  clearToken(): void {
    this.token = null;
    this.expiresAt = 0;
  }
}

const tokenManager = new TokenManager();

// API Request Helper
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  body?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const token = await tokenManager.getToken();
    
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ============================================
// STEAM API
// ============================================

/**
 * Проверка Steam логина на существование и получение информации
 */
export async function checkSteamLogin(login: string): Promise<ApiResponse<SteamAccountInfo>> {
  return apiRequest<SteamAccountInfo>('/login/check', 'POST', { login });
}

/**
 * Расчет стоимости пополнения Steam (RUB -> USD)
 */
export async function calculateSteamTopup(amountRub: number): Promise<ApiResponse<CalculateResponse>> {
  return apiRequest<CalculateResponse>('/calculate', 'POST', { 
    amount: amountRub,
    currency: 'RUB',
    service: 'steam'
  });
}

/**
 * Создание заказа на пополнение Steam
 */
export async function createSteamOrder(
  login: string, 
  amountRub: number
): Promise<ApiResponse<OrderResponse>> {
  return apiRequest<OrderResponse>('/order/create', 'POST', {
    service: 'steam',
    login,
    amount: amountRub,
    currency: 'RUB',
  });
}

/**
 * Оплата заказа
 */
export async function payOrder(orderId: string): Promise<ApiResponse<OrderResponse>> {
  return apiRequest<OrderResponse>('/order/pay', 'POST', { order_id: orderId });
}

/**
 * Получение статуса заказа
 */
export async function getOrderStatus(orderId: string): Promise<ApiResponse<OrderResponse>> {
  return apiRequest<OrderResponse>('/order/status', 'POST', { order_id: orderId });
}

// ============================================
// TELEGRAM API
// ============================================

/**
 * Расчет стоимости Telegram Stars
 */
export async function calculateTelegramStars(
  starsCount: number
): Promise<ApiResponse<TelegramStarsResponse>> {
  return apiRequest<TelegramStarsResponse>('/telegram/stars/calculate', 'POST', {
    stars_count: starsCount,
  });
}

/**
 * Покупка Telegram Stars
 */
export async function buyTelegramStars(
  username: string,
  starsCount: number
): Promise<ApiResponse<OrderResponse>> {
  return apiRequest<OrderResponse>('/telegram/stars', 'POST', {
    username: username.replace('@', ''),
    stars_count: starsCount,
  });
}

// ============================================
// GIFT GAMES API
// ============================================

/**
 * Получить SUB_ID по APP_ID игры
 */
export async function getGameSubId(appId: string): Promise<ApiResponse<{ sub_id: string }>> {
  return apiRequest<{ sub_id: string }>('/games/sub_id', 'POST', { app_id: appId });
}

/**
 * Получить информацию об игре
 */
export async function getGameInfo(subId: string): Promise<ApiResponse<GameInfo>> {
  return apiRequest<GameInfo>('/games/info', 'POST', { sub_id: subId });
}

/**
 * Расчет цены игры по региону
 */
export async function calculateGamePrice(
  subId: string,
  region: string
): Promise<ApiResponse<{ price_rub: number; price_usdt: number }>> {
  return apiRequest('/games/calculate', 'POST', { sub_id: subId, region });
}

/**
 * Создать заказ на покупку игры
 */
export async function createGameOrder(
  request: GiftGameOrderRequest
): Promise<ApiResponse<OrderResponse>> {
  return apiRequest<OrderResponse>('/games/order/create', 'POST', request);
}

/**
 * Оплатить заказ на покупку игры
 */
export async function payGameOrder(orderId: string): Promise<ApiResponse<OrderResponse>> {
  return apiRequest<OrderResponse>('/games/order/pay', 'POST', { order_id: orderId });
}

// ============================================
// PRODUCTS & BALANCE API
// ============================================

/**
 * Получить все доступные товары
 */
export async function getAllProducts(): Promise<ApiResponse<Product[]>> {
  return apiRequest<Product[]>('/products', 'POST');
}

/**
 * Получить товар по service_id
 */
export async function getProductById(serviceId: string): Promise<ApiResponse<Product>> {
  return apiRequest<Product>('/products/get', 'POST', { service_id: serviceId });
}

/**
 * Получить баланс аккаунта
 */
export async function getBalance(): Promise<ApiResponse<BalanceResponse>> {
  return apiRequest<BalanceResponse>('/balance', 'POST');
}

// ============================================
// PAYMENTS API (Эквайринг)
// ============================================

export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  return_url?: string;
  webhook_url?: string;
}

export interface PaymentResponse {
  payment_id: string;
  payment_url: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  expires_at: number;
}

/**
 * Создать платежное поручение
 */
export async function createPayment(
  request: PaymentRequest
): Promise<ApiResponse<PaymentResponse>> {
  return apiRequest<PaymentResponse>('/payments/create', 'POST', request);
}

/**
 * Получить информацию по платежному поручению
 */
export async function getPaymentInfo(
  paymentId: string
): Promise<ApiResponse<PaymentResponse>> {
  return apiRequest<PaymentResponse>('/payments/info', 'POST', { payment_id: paymentId });
}

/**
 * Получить баланс PaymentHub
 */
export async function getPaymentHubBalance(): Promise<ApiResponse<BalanceResponse>> {
  return apiRequest<BalanceResponse>('/payments/balance', 'POST');
}

// ============================================
// STATISTICS API
// ============================================

export interface DailyStats {
  date: string;
  orders_count: number;
  total_amount: number;
  successful_orders: number;
  failed_orders: number;
}

export interface UserStats {
  total_orders: number;
  total_spent: number;
  successful_orders: number;
  average_order: number;
  favorite_service: string;
}

/**
 * Статистика заказов за день
 */
export async function getDailyStats(date?: string): Promise<ApiResponse<DailyStats>> {
  return apiRequest<DailyStats>('/stats/daily', 'GET');
}

/**
 * Получить свою статистику
 */
export async function getUserStats(): Promise<ApiResponse<UserStats>> {
  return apiRequest<UserStats>('/stats/user', 'GET');
}

// Export token manager for manual control if needed
export { tokenManager };
