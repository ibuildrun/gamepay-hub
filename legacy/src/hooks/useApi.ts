/**
 * React Hooks для работы с GreenGamePay API
 */

import { useState, useCallback } from 'react';
import * as api from '../services/api';
import type { 
  ApiResponse, 
  SteamAccountInfo, 
  CalculateResponse, 
  OrderResponse,
  TelegramStarsResponse,
  GameInfo,
  Product,
  BalanceResponse
} from '../services/api';

// Generic hook for API calls with loading and error states
function useApiCall<T, Args extends unknown[]>(
  apiFunction: (...args: Args) => Promise<ApiResponse<T>>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: Args): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(...args);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// ============================================
// STEAM HOOKS
// ============================================

export function useSteamLoginCheck() {
  return useApiCall<SteamAccountInfo, [string]>(api.checkSteamLogin);
}

export function useSteamCalculate() {
  return useApiCall<CalculateResponse, [number]>(api.calculateSteamTopup);
}

export function useSteamOrder() {
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (login: string, amountRub: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.createSteamOrder(login, amountRub);
      
      if (response.success && response.data) {
        setOrderData(response.data);
        return response;
      } else {
        setError(response.error || 'Failed to create order');
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const payOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.payOrder(orderId);
      
      if (response.success && response.data) {
        setOrderData(response.data);
      } else {
        setError(response.error || 'Payment failed');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async (orderId: string) => {
    try {
      const response = await api.getOrderStatus(orderId);
      if (response.success && response.data) {
        setOrderData(response.data);
      }
      return response;
    } catch (err) {
      return { success: false, error: 'Failed to check status' };
    }
  }, []);

  return { orderData, loading, error, createOrder, payOrder, checkStatus };
}

// ============================================
// TELEGRAM HOOKS
// ============================================

export function useTelegramStarsCalculate() {
  return useApiCall<TelegramStarsResponse, [number]>(api.calculateTelegramStars);
}

export function useTelegramStarsPurchase() {
  return useApiCall<OrderResponse, [string, number]>(api.buyTelegramStars);
}

// ============================================
// GAMES HOOKS
// ============================================

export function useGameInfo() {
  return useApiCall<GameInfo, [string]>(api.getGameInfo);
}

export function useGamePriceCalculate() {
  const [priceData, setPriceData] = useState<{ price_rub: number; price_usdt: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (subId: string, region: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.calculateGamePrice(subId, region);
      
      if (response.success && response.data) {
        setPriceData(response.data);
      } else {
        setError(response.error || 'Failed to calculate price');
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { priceData, loading, error, calculate };
}

export function useGameOrder() {
  return useApiCall<OrderResponse, [api.GiftGameOrderRequest]>(api.createGameOrder);
}

// ============================================
// PRODUCTS HOOKS
// ============================================

export function useProducts() {
  return useApiCall<Product[], []>(api.getAllProducts);
}

export function useProduct() {
  return useApiCall<Product, [string]>(api.getProductById);
}

// ============================================
// BALANCE HOOK
// ============================================

export function useBalance() {
  return useApiCall<BalanceResponse, []>(api.getBalance);
}

// ============================================
// ORDER STATUS POLLING HOOK
// ============================================

export function useOrderStatusPolling(orderId: string | null, intervalMs: number = 5000) {
  const [status, setStatus] = useState<OrderResponse | null>(null);
  const [polling, setPolling] = useState(false);

  const startPolling = useCallback(() => {
    if (!orderId) return;
    
    setPolling(true);
    
    const poll = async () => {
      const response = await api.getOrderStatus(orderId);
      if (response.success && response.data) {
        setStatus(response.data);
        
        // Stop polling if order is completed or failed
        if (response.data.status === 'completed' || response.data.status === 'failed') {
          setPolling(false);
          return;
        }
      }
    };

    poll();
    const interval = setInterval(poll, intervalMs);
    
    return () => {
      clearInterval(interval);
      setPolling(false);
    };
  }, [orderId, intervalMs]);

  const stopPolling = useCallback(() => {
    setPolling(false);
  }, []);

  return { status, polling, startPolling, stopPolling };
}
