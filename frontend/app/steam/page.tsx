'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wallet, Globe, Zap, Info, ChevronRight, CheckCircle2, AlertCircle, Loader2, Copy } from 'lucide-react';
import { steamApi } from '@/lib/api';

const REGIONS = [
  { code: 'RU', name: 'РОССИЯ', flag: '🇷🇺' },
  { code: 'KZ', name: 'КАЗАХСТАН', flag: '🇰🇿' },
  { code: 'BY', name: 'БЕЛАРУСЬ', flag: '🇧🇾' },
  { code: 'UA', name: 'УКРАИНА', flag: '🇺🇦' },
  { code: 'UZ', name: 'УЗБЕКИСТАН', flag: '🇺🇿' },
  { code: 'KG', name: 'КИРГИЗИЯ', flag: '🇰🇬' },
  { code: 'AZ', name: 'АЗЕРБАЙДЖАН', flag: '🇦🇿' },
  { code: 'AM', name: 'АРМЕНИЯ', flag: '🇦🇲' },
  { code: 'TJ', name: 'ТАДЖИКИСТАН', flag: '🇹🇯' },
  { code: 'MD', name: 'МОЛДОВА', flag: '🇲🇩' },
  { code: 'TM', name: 'ТУРКМЕНИСТАН', flag: '🇹🇲' },
  { code: 'GE', name: 'ГРУЗИЯ', flag: '🇬🇪' },
];

const AMOUNT_PRESETS = ['250', '500', '1000', '2000', '5000', '10000'];

type OrderStep = 'form' | 'payment' | 'success';

interface AccountInfo {
  valid: boolean;
  country_code?: string;
  country?: string;
}

interface OrderData {
  order_id: string;
  amount_usdt: string;
  payment_address?: string;
  payment_network?: string;
}

interface CalcData {
  total_usdt: number;
  rate: number;
}

export default function SteamPage() {
  const [login, setLogin] = useState('');
  const [amount, setAmount] = useState<string>('1000');
  const [orderStep, setOrderStep] = useState<OrderStep>('form');
  const [copied, setCopied] = useState(false);
  
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  
  const [calcData, setCalcData] = useState<CalcData>({ total_usdt: 0, rate: 92.5 });
  const [calculating, setCalculating] = useState(false);
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Calculate price when amount changes
  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 100 && accountInfo?.valid && login) {
      setCalculating(true);
      const timer = setTimeout(async () => {
        try {
          const response = await steamApi.calculate(login.trim(), numAmount);
          const data = response.data;
          setCalcData({
            total_usdt: data.total / 92.5, // Convert RUB to USDT
            rate: 92.5
          });
        } catch {
          // Fallback to local calculation
          setCalcData({
            total_usdt: numAmount / 92.5,
            rate: 92.5
          });
        } finally {
          setCalculating(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (numAmount >= 100) {
      // Local calculation when account not verified yet
      setCalcData({
        total_usdt: numAmount / 92.5,
        rate: 92.5
      });
    }
  }, [amount, accountInfo, login]);

  const handleVerify = useCallback(async () => {
    if (!login.trim()) return;
    setVerifying(true);
    setVerifyError(null);
    
    try {
      const response = await steamApi.checkLogin(login.trim());
      const data = response.data;
      
      if (data.valid) {
        setAccountInfo({
          valid: true,
          country_code: data.country || data.country_code,
          country: data.country_name || data.country
        });
      } else {
        setVerifyError(data.error || 'Аккаунт не найден');
        setAccountInfo(null);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setVerifyError(err.response?.data?.error || 'Ошибка проверки логина');
      setAccountInfo(null);
    } finally {
      setVerifying(false);
    }
  }, [login]);

  const resetVerify = useCallback(() => {
    setAccountInfo(null);
    setVerifyError(null);
  }, []);

  const handleCreateOrder = useCallback(async () => {
    if (!accountInfo?.valid || !login) return;
    
    const numAmount = parseFloat(amount);
    if (numAmount < 100) return;

    setOrderLoading(true);
    setOrderError(null);
    
    try {
      const response = await steamApi.createOrder(login.trim(), numAmount);
      const data = response.data;
      
      if (data.payment_url) {
        // Redirect to payment page
        window.location.href = data.payment_url;
      } else if (data.order_id) {
        setOrderData({
          order_id: data.order_id,
          amount_usdt: (numAmount / calcData.rate).toFixed(2),
          payment_address: data.payment_address,
          payment_network: data.payment_network || 'TON'
        });
        setOrderStep('payment');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setOrderError(err.response?.data?.error || 'Ошибка создания заказа');
    } finally {
      setOrderLoading(false);
    }
  }, [accountInfo, login, amount, calcData.rate]);

  const handleConfirmPayment = useCallback(async () => {
    if (!orderData?.order_id) return;
    
    setOrderLoading(true);
    setTimeout(() => {
      setOrderStep('success');
      setOrderLoading(false);
    }, 2000);
  }, [orderData]);

  const handleCopyAddress = useCallback(() => {
    if (orderData?.payment_address) {
      navigator.clipboard.writeText(orderData.payment_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [orderData]);

  const handleReset = useCallback(() => {
    setLogin('');
    setAmount('1000');
    setOrderStep('form');
    setAccountInfo(null);
    setOrderData(null);
    setOrderError(null);
  }, []);

  // Payment step
  if (orderStep === 'payment' && orderData) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-black font-heading uppercase tracking-tight text-white">
              Оплата заказа
            </h1>
            <p className="text-gray-400 text-sm uppercase font-bold tracking-[0.2em]">
              Заказ #{orderData.order_id}
            </p>
          </div>

          <div className="glass-card p-8 md:p-12 space-y-8">
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-gray-500">К зачислению:</span>
                <span className="text-xl font-black text-white">{parseFloat(amount).toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-gray-500">К оплате:</span>
                <span className="text-xl font-black text-accent">${orderData.amount_usdt} USDT</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Адрес для оплаты ({orderData.payment_network || 'TON'})
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={orderData.payment_address || ''}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 pr-24 text-sm font-mono text-white"
                />
                <button
                  onClick={handleCopyAddress}
                  className="absolute inset-y-2 right-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center space-x-2 transition-all"
                >
                  <Copy size={14} />
                  <span className="text-[10px] font-bold uppercase">
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-[10px] text-yellow-500 font-bold uppercase bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>Отправьте точную сумму на указанный адрес. После подтверждения транзакции средства будут зачислены автоматически.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleConfirmPayment}
                disabled={orderLoading}
                className="flex-1 bg-accent py-5 rounded-2xl font-black text-dark text-lg uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50"
              >
                {orderLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Я оплатил</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-8 py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Success step
  if (orderStep === 'success') {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="glass-card p-12 text-center space-y-8">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black font-heading uppercase tracking-tight text-white">
                Успешно!
              </h1>
              <p className="text-gray-400 text-sm">
                Средства будут зачислены на ваш Steam кошелек в течение 1-5 минут.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="bg-accent px-12 py-5 rounded-2xl font-black text-dark text-lg uppercase tracking-widest shadow-xl transition-all active:scale-95"
            >
              Новое пополнение
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Main form
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight text-white">
            Пополнение Steam <span className="text-accent">0%</span>
          </h1>
          <p className="text-gray-400 text-sm uppercase font-bold tracking-[0.2em]">Моментально • Безопасно • Выгодно</p>
        </div>

        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Wallet size={120} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              {/* Steam Login Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Steam логин</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ваш логин (не ник)" 
                    value={login}
                    onChange={(e) => { 
                      setLogin(e.target.value); 
                      resetVerify();
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:border-accent/50 outline-none transition-all placeholder:text-gray-700"
                  />
                  <button 
                    onClick={handleVerify}
                    disabled={!login.trim() || verifying}
                    className="absolute inset-y-2 right-2 px-6 bg-white/5 hover:bg-white/10 text-accent text-[10px] font-black uppercase rounded-xl transition-all disabled:opacity-50 flex items-center space-x-2"
                  >
                    {verifying ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : accountInfo?.valid ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : null}
                    <span>{verifying ? 'Проверка...' : accountInfo?.valid ? 'ОК' : 'Проверить'}</span>
                  </button>
                </div>
                
                {accountInfo?.valid && (
                  <div className="flex items-center space-x-2 text-[10px] text-green-500 font-bold uppercase ml-1 animate-in fade-in">
                    <CheckCircle2 size={12} />
                    <span>Аккаунт найден: {accountInfo.country_code} ({accountInfo.country})</span>
                  </div>
                )}
                
                {verifyError && (
                  <div className="flex items-center space-x-2 text-[10px] text-red-500 font-bold uppercase ml-1 animate-in fade-in">
                    <AlertCircle size={12} />
                    <span>{verifyError}</span>
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Сумма пополнения (₽)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  max="100000"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-white outline-none focus:border-accent/50 transition-all"
                />
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                  {AMOUNT_PRESETS.map(val => (
                    <button 
                      key={val} 
                      onClick={() => setAmount(val)}
                      className={`py-2 text-[10px] font-black rounded-lg border transition-all ${
                        amount === val 
                          ? 'bg-accent/20 border-accent text-accent' 
                          : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
                      }`}
                    >
                      {parseInt(val).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-8 flex flex-col justify-between">
              <div className="bg-black/30 border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>К зачислению:</span>
                  <span className="text-white text-lg">{parseFloat(amount || '0').toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>К оплате:</span>
                  <span className="text-accent text-lg">
                    {calculating ? (
                      <Loader2 className="animate-spin inline" size={16} />
                    ) : (
                      `${calcData?.total_usdt?.toFixed(2) || '0.00'} (USDT)`
                    )}
                  </span>
                </div>
                <div className="h-px bg-white/5 w-full"></div>
                <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
                  <Info size={16} className="text-accent shrink-0" />
                  <p>Курс: 1 USD = {calcData?.rate?.toFixed(2) || '92.50'} RUB • Комиссия: 0%</p>
                </div>
              </div>

              <button 
                onClick={handleCreateOrder}
                disabled={!accountInfo?.valid || orderLoading || parseFloat(amount) < 100}
                className="w-full bg-accent py-5 rounded-2xl font-black text-dark text-lg uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {orderLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Пополнить сейчас</span>
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {orderError && (
                <div className="flex items-center space-x-2 text-[10px] text-red-500 font-bold uppercase">
                  <AlertCircle size={12} />
                  <span>{orderError}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {/* Supported Regions */}
          <div className="glass-card p-10">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Globe className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Поддерживаемые регионы</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {REGIONS.map((region) => (
                <div 
                  key={region.code} 
                  className="bg-black/20 border border-white/5 rounded-2xl py-4 px-4 flex flex-col items-center justify-center text-center transition-all hover:bg-white/5 group"
                >
                  <span className="text-lg mb-1">{region.flag}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">
                    {region.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="glass-card p-10">
            <h3 className="text-xl font-black uppercase mb-10 flex items-center tracking-tight">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mr-4">
                <Zap size={24} className="text-yellow-500" />
              </div>
              Как это работает
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center text-accent text-sm font-black shrink-0">1</div>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">Введите логин (не никнейм) и проверьте его доступность в нашей системе.</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center text-accent text-sm font-black shrink-0">2</div>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">Выберите удобную сумму для пополнения и оплатите в USDT.</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center text-accent text-sm font-black shrink-0">3</div>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">Средства поступят на ваш кошелек в течение 1-5 минут автоматически.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
