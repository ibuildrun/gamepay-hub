
import React from 'react';
import { Gift, X, Loader2, Trophy, Frown, Copy, Check, Heart } from 'lucide-react';
import { GameStatus } from '../types';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: GameStatus;
  onPlay: () => void;
  promoCode: string | null;
  onReset: () => void;
}

const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose, status, onPlay, promoCode, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (promoCode) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose}></div>
      
      <div className="relative w-full max-w-md glass rounded-[2.5rem] p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={handleClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center">
          {status === GameStatus.IDLE && (
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#7e9dff] to-blue-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <Heart className="text-white" size={48} fill="white" />
              </div>
              <div>
                <h2 className="text-3xl font-black font-heading mb-2">Мини-игра</h2>
                <p className="text-gray-400">Испытайте удачу и выиграйте персональную скидку на следующее пополнение!</p>
              </div>
              <button 
                onClick={onPlay}
                className="w-full bg-[#7e9dff] text-[#0b0e14] py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl"
              >
                Испытать удачу
              </button>
            </div>
          )}

          {status === GameStatus.PLAYING && (
            <div className="py-12 flex flex-col items-center space-y-6">
              <Loader2 className="text-[#7e9dff] animate-spin" size={64} />
              <div>
                <h2 className="text-2xl font-black font-heading mb-2">Проверка удачи...</h2>
                <p className="text-gray-400">Генерируем шанс на победу</p>
              </div>
            </div>
          )}

          {status === GameStatus.WON && (
            <div className="space-y-6">
              <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                <Trophy className="text-white" size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black font-heading text-green-400 mb-2">Победа!</h2>
                <p className="text-gray-400">Ваш уникальный промокод готов</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between group">
                <span className="text-3xl font-black tracking-[0.2em] font-mono text-white">{promoCode}</span>
                <button 
                  onClick={handleCopy}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Используйте этот код при следующем пополнении</p>
              <button 
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 py-4 rounded-2xl font-black text-lg shadow-xl"
              >
                Отлично
              </button>
            </div>
          )}

          {status === GameStatus.LOST && (
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gray-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
                <Frown className="text-white" size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black font-heading text-gray-300 mb-2">Не повезло...</h2>
                <p className="text-gray-400">К сожалению, в этот раз удача не на вашей стороне</p>
              </div>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={onReset}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all shadow-xl"
                >
                  Попробовать снова
                </button>
                <button 
                  onClick={handleClose}
                  className="w-full glass py-4 rounded-2xl font-bold text-gray-400 hover:text-white transition-all"
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
