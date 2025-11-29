export type Position = {
  x: number;
  y: number;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum TileType {
  EMPTY = 'EMPTY',
  WALL = 'WALL', // Obstacle like a rock
  START = 'START',
  GOAL = 'GOAL', // The House
  STAR = 'STAR', // Collectible battery/star
}

export interface LevelConfig {
  id: number;
  name: string;
  gridSize: number;
  layout: TileType[][]; // [y][x]
  startPos: Position;
  maxCommands: number;
  minStarsToWin: number;
  description: string;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  RUNNING = 'RUNNING', // Executing commands
  WON = 'WON',
  LOST = 'LOST',
}

export interface Command {
  id: string;
  direction: Direction;
}