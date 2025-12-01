import React from 'react';
import { LevelConfig, Position, TileType } from '../types';
import { ICONS } from '../constants';
import { Bot } from 'lucide-react';

interface GridProps {
  level: LevelConfig;
  playerPos: Position;
  collectedStars: string[]; // store keys of collected stars "x,y"
}

export const Grid: React.FC<GridProps> = ({ level, playerPos, collectedStars }) => {
  return (
    <div 
      className="grid gap-2 bg-white/30 p-4 rounded-2xl shadow-xl backdrop-blur-sm border-4 border-white/50"
      style={{
        gridTemplateColumns: `repeat(${level.gridSize}, minmax(0, 1fr))`,
      }}
    >
      {level.layout.map((row, y) => (
        row.map((tile, x) => {
          const isPlayerHere = playerPos.x === x && playerPos.y === y;
          const isStarCollected = collectedStars.includes(`${x},${y}`);
          
          let content = null;
          let bgColor = "bg-white/60";
          let borderColor = "border-white";

          if (tile === TileType.WALL) {
            content = ICONS.WALL;
            bgColor = "bg-gray-300";
            borderColor = "border-gray-400";
          } else if (tile === TileType.GOAL) {
            content = ICONS.HOME;
            bgColor = "bg-brand-green";
            borderColor = "border-green-600";
          } else if (tile === TileType.STAR && !isStarCollected) {
            content = ICONS.STAR;
            bgColor = "bg-indigo-100";
          } else if (tile === TileType.START) {
            bgColor = "bg-blue-100";
          }

          return (
            <div
              key={`${x}-${y}`}
              className={`
                aspect-square rounded-xl flex items-center justify-center relative
                border-b-4 ${borderColor} ${bgColor} transition-all duration-300
              `}
            >
              {/* Floor Content (Star, House, Rock) */}
              <div className="absolute inset-0 flex items-center justify-center z-0">
                {content}
              </div>

              {/* Player Character */}
              {isPlayerHere && (
                <div className="z-10 text-brand-blue animate-bounce-slow drop-shadow-lg">
                   <Bot size={40} className="fill-brand-blue text-white" strokeWidth={1.5} />
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                </div>
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};