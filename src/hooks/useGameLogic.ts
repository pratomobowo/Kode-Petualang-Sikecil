import { useState, useEffect, useCallback } from 'react';
import { LevelConfig, Position, Direction, TileType, GameState, Command } from '../types';
import { ICONS } from '../constants';
import { getRoboHint, getWinMessage } from '../services/geminiService';
import { playSound } from '../utils/sound';

export const useGameLogic = (initialLevel: LevelConfig, isMuted: boolean = false) => {
    const [level, setLevel] = useState<LevelConfig>(initialLevel);
    const [playerPos, setPlayerPos] = useState<Position>(initialLevel.startPos);
    const [playerRotation, setPlayerRotation] = useState<number>(0); // 0: Up, 90: Right, 180: Down, 270: Left
    const [commands, setCommands] = useState<Command[]>([]);
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);
    const [collectedStars, setCollectedStars] = useState<string[]>([]);
    const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(-1);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [hintMessage, setHintMessage] = useState<string>('');

    // Reset state when level changes
    useEffect(() => {
        setLevel(initialLevel);
        resetLevel();
    }, [initialLevel]);

    const resetLevel = () => {
        setPlayerPos(initialLevel.startPos);
        setPlayerRotation(0);
        setCollectedStars([]);
        setGameState(GameState.PLAYING);
        setCurrentCommandIndex(-1);
        setModalMessage('');
        setHintMessage('');
    };

    const addCommand = (direction: Direction) => {
        if (gameState !== GameState.PLAYING) return;
        if (commands.length >= level.maxCommands) {
            playSound('BUMP', isMuted);
            return;
        }

        playSound('CLICK', isMuted);
        const newCommand: Command = {
            id: Math.random().toString(36).substr(2, 9),
            direction,
        };
        setCommands([...commands, newCommand]);
    };

    const clearCommands = () => {
        if (gameState !== GameState.PLAYING) return;
        playSound('CLICK', isMuted);
        setCommands([]);
    };

    const runCommands = () => {
        if (commands.length === 0) return;
        setGameState(GameState.RUNNING);
        setCurrentCommandIndex(-1);
        playSound('CLICK', isMuted);
    };

    // Game Loop
    useEffect(() => {
        if (gameState !== GameState.RUNNING) return;

        let step = 0;
        const interval = setInterval(async () => {
            if (step >= commands.length) {
                clearInterval(interval);
                handleGameOver(false, "Yah, perintahnya sudah habis tapi belum sampai rumah.");
                return;
            }

            setCurrentCommandIndex(step);
            const cmd = commands[step];

            // Calculate new position
            let newPos = { ...playerPos };
            let newRotation = playerRotation;

            // Update rotation based on direction for visual flair
            switch (cmd.direction) {
                case Direction.UP: newRotation = 0; break;
                case Direction.RIGHT: newRotation = 90; break;
                case Direction.DOWN: newRotation = 180; break;
                case Direction.LEFT: newRotation = 270; break;
            }
            setPlayerRotation(newRotation);

            if (cmd.direction === Direction.UP) newPos.y -= 1;
            if (cmd.direction === Direction.DOWN) newPos.y += 1;
            if (cmd.direction === Direction.LEFT) newPos.x -= 1;
            if (cmd.direction === Direction.RIGHT) newPos.x += 1;

            // Check collisions
            if (
                newPos.x < 0 || newPos.x >= level.gridSize ||
                newPos.y < 0 || newPos.y >= level.gridSize
            ) {
                clearInterval(interval);
                playSound('BUMP', isMuted);
                handleGameOver(false, "Aduh! Robo menabrak batas dunia!");
                return;
            }

            const tile = level.layout[newPos.y][newPos.x];

            if (tile === TileType.WALL) {
                clearInterval(interval);
                playSound('BUMP', isMuted);
                handleGameOver(false, "Dug! Ada batu besar menghalangi jalan.");
                return;
            }

            // Valid move
            setPlayerPos(newPos);
            playSound('MOVE', isMuted);

            // Check collectibles
            if (tile === TileType.STAR) {
                const starKey = `${newPos.x},${newPos.y}`;
                if (!collectedStars.includes(starKey)) {
                    setCollectedStars(prev => [...prev, starKey]);
                    playSound('COLLECT', isMuted);
                }
            }

            // Check Goal
            if (tile === TileType.GOAL) {
                clearInterval(interval);

                // Hack: check if we JUST collected a star on this tile
                const currentStarsCount = collectedStars.length;

                if (currentStarsCount >= level.minStarsToWin) {
                    handleGameOver(true, await getWinMessage(currentStarsCount));
                } else {
                    handleGameOver(false, `Yah! Kamu butuh ${level.minStarsToWin} bintang, tapi baru punya ${currentStarsCount}.`);
                }
                return;
            }

            step++;
        }, 800); // Speed of steps

        return () => clearInterval(interval);
    }, [gameState, commands, playerPos, level, collectedStars, playerRotation, isMuted]);

    const handleGameOver = async (win: boolean, message: string) => {
        if (win) {
            setGameState(GameState.WON);
            playSound('WIN', isMuted);

            // Update max unlocked level
            const currentMax = parseInt(localStorage.getItem('kode-petualang-level') || '1');
            if (level.id >= currentMax) {
                localStorage.setItem('kode-petualang-level', (level.id + 1).toString());
            }
        } else {
            setGameState(GameState.LOST);
            playSound('LOSE', isMuted);
            const hint = await getRoboHint(level, commands, message, playerPos);
            setHintMessage(hint);
        }
        setModalMessage(message);
    };

    return {
        level,
        playerPos,
        playerRotation,
        commands,
        gameState,
        collectedStars,
        currentCommandIndex,
        modalMessage,
        hintMessage,
        addCommand,
        runCommands,
        resetLevel,
        clearCommands,
        setGameState,
    };
};
