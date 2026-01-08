import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Shield, Zap, Info, ChevronRight, Globe, CheckCircle2, AlertCircle, Loader2, Copy, ExternalLink } from 'lucide-react';
import { useSteamLoginCheck, useSteamCalculate, useSteamOrder } from '../src/hooks/useApi';

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

const SteamView: React.FC = () => {
  const [login, setLogin] = useState('');
  const [amount, setAmount] = useState<string>('1000');
  const [orderStep, setOrderStep] = useState<OrderStep>('form');
  const [copied, setCopied] = useState(false);

  // API Hooks
  const { 
    data: accountInfo, 
    loading: verifying, 
    error: verifyError, 
    execute: checkLogin,
    reset: resetVerify 
  } = useSteamLoginCheck();

  const { 
    data: calcData, 
    loading: calculating, 
    execute: calculatePrice 
  } = useSteamCalculate();

  const { 
    orderData, 
    loading: orderLoading, 
    error: orderError, 
    createOrder, 
    payOrder,
    checkStatus 
  } = useSteamOrder();

  // Calculate price when amount changes
  useEffect(() => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 100) {
      const debounce = setTimeout(() => {
        calculatePrice(numAmount);
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [amount, calculatePrice]);

  // Handle login verification
  const handleVerify = useCallback(async () => {
    if (!login.trim()) return;
    await checkLogin(login.trim());
  }, [login, checkLogin]);

  // Handle order creation
  const handleCreateOrder = useCallback(async () => {
    if (!accountInfo?.valid || !login) return;
    
    const numAmount = parseFloat(amount);
    if (numAmount < 100) return;

    const response = await createOrder(login, numAmount);
    if (response.success) {
      setOrderStep('payment');
    }
  }, [accountInfo, login, amount, createOrder]);

  // Handle payment confirmation
  const handleConfirmPayment = useCallback(async () => {
    if (!orderData?.order_id) return;
    
    const response = await payOrder(orderData.order_id);
    if (response.success && response.data?.status === 'completed') {
      setOrderStep('success');
    }
  }, [orderData, payOrder]);

  // Copy payment address
  const handleCopyAddress = useCallback(() => {
    if (orderData?.payment_address) {
      navigator.clipboard.writeText(orderData.payment_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [orderData]);

  // Reset form
  const handleReset = useCallback(() => {
    setLogin('');
    setAmount('1000');
    setOrderStep('form');
    resetVerify();
  }, [resetVerify]);

  // Render payment step
  if (orderStep === 'payment' && orderData) {
    return (
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
          <div className="bg-[#7e9dff]/10 border border-[#7e9dff]/20 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-gray-500">К зачислению:</span>
              <span className="text-xl font-black text-white">{parseFloat(amount).toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-gray-500">К оплате:</span>
              <span className="text-xl font-black text-[#7e9dff]">${orderData.amount_usdt} USDT</span>
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
              className="flex-1 bg-[#7e9dff] py-5 rounded-2xl font-black text-[#0b0e14] text-lg uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50"
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
    );
  }

  // Render success step
  if (orderStep === 'success') {
    return (
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
            className="bg-[#7e9dff] px-12 py-5 rounded-2xl font-black text-[#0b0e14] text-lg uppercase tracking-widest shadow-xl transition-all active:scale-95"
          >
            Новое пополнение
          </button>
        </div>
      </div>
    );
  }

  // Render main form
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tight text-white">
          Пополнение Steam <span className="text-[#7e9dff]">0%</span>
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
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:border-[#7e9dff]/50 outline-none transition-all placeholder:text-gray-700"
                />
                <button 
                  onClick={handleVerify}
                  disabled={!login.trim() || verifying}
                  className="absolute inset-y-2 right-2 px-6 bg-white/5 hover:bg-white/10 text-[#7e9dff] text-[10px] font-black uppercase rounded-xl transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {verifying ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : accountInfo?.valid ? (
                    <CheckCircle2 size={14} className="text-green-500" />
                  ) : null}
                  <span>{verifying ? 'Проверка...' : accountInfo?.valid ? 'ОК' : 'Проверить'}</span>
                </button>
              </div>
              
              {/* Account Info */}
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
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-xl font-black text-white outline-none focus:border-[#7e9dff]/50 transition-all"
              />
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                {AMOUNT_PRESETS.map(val => (
                  <button 
                    key={val} 
                    onClick={() => setAmount(val)}
                    className={`py-2 text-[10px] font-black rounded-lg border transition-all ${
                      amount === val 
                        ? 'bg-[#7e9dff]/20 border-[#7e9dff] text-[#7e9dff]' 
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
                <span className="text-[#7e9dff] text-lg">
                  {calculating ? (
                    <Loader2 className="animate-spin inline" size={16} />
                  ) : (
                    `$${calcData?.total_usdt?.toFixed(2) || '0.00'} (USDT)`
                  )}
                </span>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
                <Info size={16} className="text-[#7e9dff] shrink-0" />
                <p>Курс: 1 USD = {calcData?.rate?.toFixed(2) || '92.50'} RUB • Комиссия: 0%</p>
              </div>
            </div>

            <button 
              onClick={handleCreateOrder}
              disabled={!accountInfo?.valid || orderLoading || parseFloat(amount) < 100}
              className="w-full bg-[#7e9dff] py-5 rounded-2xl font-black text-[#0b0e14] text-lg uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
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
            <div className="w-10 h-10 bg-[#7e9dff]/10 rounded-xl flex items-center justify-center">
              <Globe className="text-[#7e9dff]" size={24} />
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
              <div className="w-8 h-8 bg-[#7e9dff]/20 rounded-xl flex items-center justify-center text-[#7e9dff] text-sm font-black shrink-0">1</div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">Введите логин (не никнейм) и проверьте его доступность в нашей системе.</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#7e9dff]/20 rounded-xl flex items-center justify-center text-[#7e9dff] text-sm font-black shrink-0">2</div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">Выберите удобную сумму для пополнения и оплатите в USDT.</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#7e9dff]/20 rounded-xl flex items-center justify-center text-[#7e9dff] text-sm font-black shrink-0">3</div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">Средства поступят на ваш кошелек в течение 1-5 минут автоматически.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SteamView;
