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
    <div className="grid grid-cols-[1fr_auto] md:flex md:flex-col gap-3 w-full md:w-80 h-full md:h-auto">

      {/* Command Palette */}
      <div className="order-2 md:order-1 bg-white rounded-2xl p-2 md:p-4 shadow-sm md:shadow-xl border-b-4 border-purple-200 md:flex-shrink-0">
        <h3 className="hidden md:block text-center font-bold text-gray-500 mb-3 text-lg">Pilih Gerakan</h3>
        <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-3 h-full md:h-auto">
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
      <div className="order-1 md:order-2 col-span-2 bg-white/90 rounded-2xl p-3 md:p-4 shadow-sm md:shadow-xl flex-grow flex flex-col min-h-[90px] md:min-h-[200px] border-b-4 border-yellow-200">
        <div className="flex justify-between items-center mb-1 md:mb-2">
          <h3 className="font-bold text-gray-500 text-sm md:text-sm">Program ({commands.length}/{maxCommands})</h3>
        </div>

        <div className="bg-gray-50 rounded-xl p-2 flex-grow overflow-x-auto md:overflow-y-auto md:overflow-x-hidden custom-scroll flex flex-row md:flex-col gap-3 items-center md:items-stretch">
          {commands.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm md:text-sm text-center italic whitespace-nowrap md:whitespace-normal px-4">
              Klik panah untuk mulai
            </div>
          )}
          {commands.map((cmd, idx) => (
            <div key={cmd.id} className="flex-shrink-0 flex items-center gap-2 bg-white p-2 md:p-2 rounded-lg shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="w-6 h-6 md:w-6 md:h-6 rounded-full bg-brand-yellow flex items-center justify-center text-xs md:text-xs font-bold text-white">
                {idx + 1}
              </div>
              <div className="text-gray-700 font-bold flex items-center gap-1 md:gap-2 text-sm md:text-sm whitespace-nowrap">
                {cmd.direction === Direction.UP && <span className="text-brand-blue flex items-center gap-1">{ICONS.UP} <span className="hidden md:inline">Atas</span></span>}
                {cmd.direction === Direction.DOWN && <span className="text-brand-blue flex items-center gap-1">{ICONS.DOWN} <span className="hidden md:inline">Bawah</span></span>}
                {cmd.direction === Direction.LEFT && <span className="text-brand-blue flex items-center gap-1">{ICONS.LEFT} <span className="hidden md:inline">Kiri</span></span>}
                {cmd.direction === Direction.RIGHT && <span className="text-brand-blue flex items-center gap-1">{ICONS.RIGHT} <span className="hidden md:inline">Kanan</span></span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-3 md:order-3 flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-3 w-20 md:w-auto">
        <button
          onClick={onReset}
          className="col-span-1 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl md:rounded-2xl p-2 md:p-4 flex items-center justify-center shadow-sm md:shadow-lg border-b-2 md:border-b-4 border-gray-300 active:border-b-0 active:translate-y-0.5 md:active:translate-y-1 transition-all h-10 md:h-auto"
        >
          <RotateCcw size={20} className="md:w-7 md:h-7" />
        </button>
        <button
          onClick={onRun}
          disabled={isRunning || commands.length === 0}
          className={`
            col-span-3 flex-1 rounded-xl md:rounded-2xl p-2 md:p-4 flex items-center justify-center gap-1 md:gap-2 shadow-md md:shadow-lg border-b-4 transition-all
            ${isRunning ? 'bg-gray-400 border-gray-500 cursor-not-allowed' : 'bg-brand-green hover:bg-green-500 border-green-700 active:border-b-0 active:translate-y-1'}
          `}
        >
          <span className="text-white font-bold text-xl hidden md:inline">{isRunning ? 'Jalan...' : 'Jalankan!'}</span>
          {!isRunning && <Play size={24} className="fill-white text-white" />}
          {isRunning && <span className="animate-spin md:hidden">⏳</span>}
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
      aspect-square md:aspect-video rounded-xl flex items-center justify-center shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all
      ${disabled ? 'bg-gray-200 border-gray-300 opacity-50' : 'bg-white border-blue-200 hover:bg-blue-50 text-brand-blue'}
    `}
  >
    {icon}
  </button>
);