
import React, { useState } from 'react';
import { User, Wallet, Shield, Zap, Sparkles } from 'lucide-react';

const TopUpForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [amount, setAmount] = useState<string>('316');
  const [paymentMethod, setPaymentMethod] = useState<'sbp' | 'cards'>('sbp');

  const getCalculated = () => {
    const val = parseFloat(amount) || 0;
    const cashback = Math.round(val * 0.2);
    const bankCommission = Math.round(val * 0.1); 
    const total = Math.round(val + bankCommission);
    return { received: val, cashback, commission: bankCommission, total };
  };

  const { received, cashback, commission, total } = getCalculated();

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full mb-16">
      <div className="flex-grow space-y-6">
        <div className="glass-card p-10">
          <div className="flex items-center space-x-3 mb-4">
             <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Wallet className="text-blue-500" size={24} />
             </div>
            <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tight">Пополнить баланс Steam</h1>
          </div>
          <p className="text-gray-500 text-sm mb-10">Аккаунты РФ и стран СНГ. Средства поступают на баланс мгновенно.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Логин Steam</label>
                 <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Ваш логин Steam" 
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700"
                    />
                    <button className="absolute inset-y-2 right-2 px-4 bg-white/5 text-blue-400 text-[10px] font-bold uppercase rounded-xl hover:bg-white/10 transition-all">Где найти?</button>
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Сумма пополнения</label>
                 <div className="relative group">
                    <input 
                      type="number" 
                      placeholder="316" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                 </div>
                 <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Мин: 100Р</p>
               </div>
            </div>
            
            <div className="bg-black/20 rounded-3xl p-6 border border-white/5 h-full flex flex-col justify-center">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                     <Sparkles size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Спецпредложение</p>
                     <p className="text-sm font-bold text-white leading-tight">Получай <span className="text-blue-400">20% кэшбэк</span> при пополнении от 1000Р</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px]">
        <div className="glass-card p-10 h-full flex flex-col">
          <h2 className="text-xl font-black font-heading text-white mb-8 uppercase tracking-tight">К оплате</h2>
          
          <div className="flex p-1.5 bg-black/40 rounded-2xl mb-8">
            <button 
              onClick={() => setPaymentMethod('sbp')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === 'sbp' ? 'bg-[#1e2329] text-white shadow-lg border border-white/5' : 'text-gray-600 hover:text-gray-400'}`}
            >
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-[8px] font-black">СБП</div>
              <span>СБП (-2%)</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('cards')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === 'cards' ? 'bg-[#1e2329] text-white shadow-lg border border-white/5' : 'text-gray-600 hover:text-gray-400'}`}
            >
              <Shield size={14} />
              <span>Карты</span>
            </button>
          </div>

          <div className="space-y-4 text-xs font-bold uppercase tracking-widest flex-grow">
            <div className="flex justify-between text-gray-600">
              <span>Steam кошелек:</span>
              <span className="text-white">{received}P</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Кэшбэк:</span>
              <span className="text-green-400">{cashback}P</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Комиссия:</span>
              <span className="text-red-400">{commission}P</span>
            </div>
            <div className="h-px bg-white/5 my-4"></div>
            <div className="flex justify-between text-base font-black">
              <span className="text-gray-200">Итого:</span>
              <span className="text-white">{total}P</span>
            </div>
          </div>

          <button className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-black py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-xl mt-8">
            <Zap size={24} fill="currentColor" />
            <span>Оплатить {total}P</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpForm;
