
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  { question: 'Что такое логин Steam?', answer: 'Логин Steam — это имя пользователя, которое вы вводите при входе в свой аккаунт. Это НЕ ваш текущий никнейм.' },
  { question: 'Аккаунты Steam каких стран можно пополнить?', answer: 'Мы поддерживаем пополнение аккаунтов России (РФ) и стран СНГ.' },
  { question: 'В какой валюте деньги зачисляются на кошелек Steam?', answer: 'Деньги зачисляются в валюте вашего региона Steam с автоматической конвертацией.' },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-[1400px] mx-auto w-full pt-12 pb-24">
      <h2 className="text-3xl font-black font-heading mb-8 text-white uppercase tracking-tight">Часто задаваемые вопросы</h2>
      <div className="grid grid-cols-1 gap-3">
        {FAQ_DATA.map((item, idx) => (
          <div key={idx} className="glass-card overflow-hidden">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-8 py-5 flex items-center justify-between text-left transition-colors"
            >
              <span className="text-[15px] font-bold text-gray-200">{item.question}</span>
              <div className={`p-2 bg-white/5 rounded-xl text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                <ChevronDown size={18} />
              </div>
            </button>
            <div className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-8 pb-6 text-gray-500 text-sm leading-relaxed">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
