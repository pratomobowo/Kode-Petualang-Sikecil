import { LevelConfig, TileType } from "./types";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, Star, Hexagon } from 'lucide-react';

export const LEVEL_1: LevelConfig = {
  id: 1,
  name: "Langkah Pertama",
  description: "Bantu Robo pulang ke rumah!",
  gridSize: 4,
  startPos: { x: 0, y: 0 },
  maxCommands: 5,
  minStarsToWin: 0,
  layout: [
    [TileType.START, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
    [TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
    [TileType.EMPTY, TileType.EMPTY, TileType.GOAL, TileType.EMPTY],
    [TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
  ],
};

export const LEVEL_2: LevelConfig = {
  id: 2,
  name: "Awas Batu!",
  description: "Hindari batu besar itu!",
  gridSize: 4,
  startPos: { x: 0, y: 1 },
  maxCommands: 8,
  minStarsToWin: 0,
  layout: [
    [TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.GOAL],
    [TileType.START, TileType.WALL, TileType.WALL, TileType.EMPTY],
    [TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
    [TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
  ],
};

export const LEVEL_3: LevelConfig = {
  id: 3,
  name: "Pemburu Bintang",
  description: "Ambil bintang sebelum pulang!",
  gridSize: 5,
  startPos: { x: 0, y: 0 },
  maxCommands: 10,
  minStarsToWin: 1,
  layout: [
    [TileType.START, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
    [TileType.WALL, TileType.WALL, TileType.EMPTY, TileType.WALL, TileType.EMPTY],
    [TileType.EMPTY, TileType.STAR, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
    [TileType.EMPTY, TileType.WALL, TileType.WALL, TileType.WALL, TileType.EMPTY],
    [TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.GOAL],
  ],
};

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3];

export const ICONS = {
  UP: <ArrowUp size={24} strokeWidth={3} />,
  DOWN: <ArrowDown size={24} strokeWidth={3} />,
  LEFT: <ArrowLeft size={24} strokeWidth={3} />,
  RIGHT: <ArrowRight size={24} strokeWidth={3} />,
  HOME: <Home size={28} className="text-white fill-white" />,
  STAR: <Star size={24} className="text-yellow-400 fill-yellow-400 animate-pulse" />,
  WALL: <Hexagon size={28} className="text-gray-600 fill-gray-500" />,
};