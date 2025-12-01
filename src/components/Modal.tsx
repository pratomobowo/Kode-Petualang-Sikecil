import React from 'react';
import { GameState } from '../types';
import { RefreshCw, Play, Home } from 'lucide-react';

interface ModalProps {
  gameState: GameState;
  onRetry: () => void;
  onNextLevel: () => void;
  onHome: () => void;
  message: string;
  hint?: string;
}

export const Modal: React.FC<ModalProps> = ({ gameState, onRetry, onNextLevel, onHome, message, hint }) => {
  if (gameState !== GameState.WON && gameState !== GameState.LOST) return null;

  const isWin = gameState === GameState.WON;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`
        max-w-md w-full rounded-3xl p-8 shadow-2xl text-center border-8 transform transition-all scale-100
        ${isWin ? 'bg-white border-brand-yellow' : 'bg-white border-brand-orange'}
      `}>
        
        <div className="mb-6">
          <div className={`
            w-24 h-24 mx-auto rounded-full flex items-center justify-center text-6xl mb-4 shadow-inner
            ${isWin ? 'bg-brand-yellow/20' : 'bg-brand-orange/20'}
          `}>
            {isWin ? '🏆' : '🔧'}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${isWin ? 'text-brand-yellow' : 'text-brand-orange'}`}>
            {isWin ? 'Berhasil!' : 'Ups!'}
          </h2>
          <p className="text-gray-600 text-lg font-medium">{message}</p>
          
          {!isWin && hint && (
            <div className="mt-4 bg-blue-50 p-4 rounded-xl border-l-4 border-brand-blue text-left">
              <p className="text-xs font-bold text-brand-blue uppercase mb-1">Tips dari Robo:</p>
              <p className="text-sm text-gray-700 italic">"{hint}"</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
           <button 
            onClick={onHome}
            className="p-4 rounded-2xl bg-gray-100 text-gray-500 hover:bg-gray-200 font-bold border-b-4 border-gray-300 active:border-b-0 active:translate-y-1"
          >
            <Home />
          </button>
          <button 
            onClick={onRetry}
            className="flex-1 py-3 rounded-2xl bg-brand-blue text-white font-bold text-lg hover:brightness-110 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} /> Coba Lagi
          </button>
          {isWin && (
             <button 
              onClick={onNextLevel}
              className="flex-1 py-3 rounded-2xl bg-brand-green text-white font-bold text-lg hover:brightness-110 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
            >
              Lanjut <Play size={20} className="fill-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};