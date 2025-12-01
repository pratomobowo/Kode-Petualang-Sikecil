import React from 'react';
import { Command, Direction, GameState } from '../types';
import { ICONS } from '../constants';
import { Play, RotateCcw, Trash2 } from 'lucide-react';

interface ControlsProps {
  onAddCommand: (dir: Direction) => void;
  onRun: () => void;
  onReset: () => void;
  onClear: () => void;
  commands: Command[];
  gameState: GameState;
  maxCommands: number;
}

export const Controls: React.FC<ControlsProps> = ({ 
  onAddCommand, 
  onRun, 
  onReset, 
  onClear,
  commands, 
  gameState,
  maxCommands 
}) => {
  
  const isRunning = gameState === GameState.RUNNING;
  const isFull = commands.length >= maxCommands;

  return (
    <div className="flex flex-col gap-4 w-full md:w-80">
      
      {/* Command Palette */}
      <div className="bg-white rounded-3xl p-4 shadow-xl border-b-8 border-purple-200">
        <h3 className="text-center font-bold text-gray-500 mb-3 text-lg">Pilih Gerakan</h3>
        <div className="grid grid-cols-2 gap-3">
          <ControlButton 
            dir={Direction.UP} 
            icon={ICONS.UP} 
            color="bg-brand-blue" 
            onClick={() => onAddCommand(Direction.UP)}
            disabled={isRunning || isFull}
          />
          <ControlButton 
            dir={Direction.DOWN} 
            icon={ICONS.DOWN} 
            color="bg-brand-blue" 
            onClick={() => onAddCommand(Direction.DOWN)}
            disabled={isRunning || isFull}
          />
          <ControlButton 
            dir={Direction.LEFT} 
            icon={ICONS.LEFT} 
            color="bg-brand-blue" 
            onClick={() => onAddCommand(Direction.LEFT)}
            disabled={isRunning || isFull}
          />
          <ControlButton 
            dir={Direction.RIGHT} 
            icon={ICONS.RIGHT} 
            color="bg-brand-blue" 
            onClick={() => onAddCommand(Direction.RIGHT)}
            disabled={isRunning || isFull}
          />
        </div>
      </div>

      {/* Program List */}
      <div className="bg-white/90 rounded-3xl p-4 shadow-xl flex-grow flex flex-col min-h-[200px] border-b-8 border-yellow-200">
        <div className="flex justify-between items-center mb-2">
           <h3 className="font-bold text-gray-500">Program Robot ({commands.length}/{maxCommands})</h3>
           <button onClick={onClear} disabled={isRunning} className="text-red-400 hover:text-red-600">
             <Trash2 size={20} />
           </button>
        </div>
        
        <div className="bg-gray-100 rounded-xl p-2 flex-grow overflow-y-auto custom-scroll space-y-2">
          {commands.length === 0 && (
             <div className="h-full flex items-center justify-center text-gray-400 text-sm text-center italic">
               Klik panah untuk memberi perintah
             </div>
          )}
          {commands.map((cmd, idx) => (
            <div key={cmd.id} className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center text-xs font-bold text-white">
                {idx + 1}
              </div>
              <div className="text-gray-700 font-bold flex items-center gap-2">
                {cmd.direction === Direction.UP && <span className="text-brand-blue">{ICONS.UP} Atas</span>}
                {cmd.direction === Direction.DOWN && <span className="text-brand-blue">{ICONS.DOWN} Bawah</span>}
                {cmd.direction === Direction.LEFT && <span className="text-brand-blue">{ICONS.LEFT} Kiri</span>}
                {cmd.direction === Direction.RIGHT && <span className="text-brand-blue">{ICONS.RIGHT} Kanan</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-3">
        <button 
          onClick={onReset}
          disabled={isRunning}
          className="col-span-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl p-4 flex items-center justify-center shadow-lg border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all"
        >
          <RotateCcw size={28} />
        </button>
        <button 
          onClick={onRun}
          disabled={isRunning || commands.length === 0}
          className={`
            col-span-3 rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg border-b-4 transition-all
            ${isRunning ? 'bg-gray-400 border-gray-500 cursor-not-allowed' : 'bg-brand-green hover:bg-green-500 border-green-700 active:border-b-0 active:translate-y-1'}
          `}
        >
          <span className="text-white font-bold text-xl">{isRunning ? 'Jalan...' : 'Jalankan!'}</span>
          {!isRunning && <Play size={24} className="fill-white text-white" />}
        </button>
      </div>

    </div>
  );
};

const ControlButton: React.FC<{ dir: Direction, icon: React.ReactNode, color: string, onClick: () => void, disabled: boolean }> = ({ icon, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      aspect-video rounded-xl flex items-center justify-center shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all
      ${disabled ? 'bg-gray-200 border-gray-300 opacity-50' : 'bg-white border-blue-200 hover:bg-blue-50 text-brand-blue'}
    `}
  >
    {icon}
  </button>
);