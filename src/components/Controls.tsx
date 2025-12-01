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
    <div className="flex flex-col gap-3 w-full md:w-80">

      {/* Program List (Horizontal on Mobile, Vertical on Desktop) */}
      <div className="bg-white/90 rounded-2xl p-3 shadow-sm flex-grow flex flex-col min-h-[80px] md:min-h-[200px] border-b-4 border-yellow-200">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-gray-500 text-xs md:text-sm">Program ({commands.length}/{maxCommands})</h3>
          <button onClick={onClear} disabled={isRunning} className="text-red-400 hover:text-red-600 p-1">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-2 flex-grow overflow-x-auto md:overflow-y-auto md:overflow-x-hidden custom-scroll flex flex-row md:flex-col gap-2 items-center md:items-stretch">
          {commands.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center italic whitespace-nowrap px-4">
              Klik panah untuk mulai
            </div>
          )}
          {commands.map((cmd, idx) => (
            <div key={cmd.id} className="flex-shrink-0 flex items-center gap-2 bg-white p-1.5 md:p-2 rounded-lg shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-brand-yellow flex items-center justify-center text-[10px] md:text-xs font-bold text-white">
                {idx + 1}
              </div>
              <div className="text-gray-700 font-bold flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
                {cmd.direction === Direction.UP && <span className="text-brand-blue">{ICONS.UP}</span>}
                {cmd.direction === Direction.DOWN && <span className="text-brand-blue">{ICONS.DOWN}</span>}
                {cmd.direction === Direction.LEFT && <span className="text-brand-blue">{ICONS.LEFT}</span>}
                {cmd.direction === Direction.RIGHT && <span className="text-brand-blue">{ICONS.RIGHT}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {/* Command Palette (Compact Grid) */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border-b-4 border-purple-200 flex-1">
          <div className="grid grid-cols-4 gap-2 h-full">
            <ControlButton
              dir={Direction.LEFT}
              icon={ICONS.LEFT}
              color="bg-brand-blue"
              onClick={() => onAddCommand(Direction.LEFT)}
              disabled={isRunning || isFull}
            />
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
              dir={Direction.RIGHT}
              icon={ICONS.RIGHT}
              color="bg-brand-blue"
              onClick={() => onAddCommand(Direction.RIGHT)}
              disabled={isRunning || isFull}
            />
          </div>
        </div>

        {/* Action Buttons (Compact) */}
        <div className="flex flex-col gap-2 w-20 md:w-auto">
          <button
            onClick={onReset}
            disabled={isRunning}
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl p-2 flex items-center justify-center shadow-sm border-b-2 border-gray-300 active:border-b-0 active:translate-y-0.5 transition-all h-10"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={onRun}
            disabled={isRunning || commands.length === 0}
            className={`
                flex-1 rounded-xl p-2 flex items-center justify-center gap-1 shadow-md border-b-4 transition-all
                ${isRunning ? 'bg-gray-400 border-gray-500 cursor-not-allowed' : 'bg-brand-green hover:bg-green-500 border-green-700 active:border-b-0 active:translate-y-1'}
            `}
          >
            {!isRunning && <Play size={24} className="fill-white text-white" />}
            {isRunning && <span className="animate-spin">⏳</span>}
          </button>
        </div>
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