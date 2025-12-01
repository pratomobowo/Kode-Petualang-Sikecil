import { useState, useEffect, useRef, useCallback } from 'react';
import { LevelConfig, Position, Direction, TileType, GameState, Command } from '../types';
import { ICONS } from '../constants';
import { getRoboHint, getWinMessage } from '../services/geminiService';
import { playSound } from '../utils/sound';

export const useGameLogic = (initialLevel: LevelConfig, isMuted: boolean = false) => {
    const [level, setLevel] = useState<LevelConfig>(initialLevel);
    const [playerPos, setPlayerPos] = useState<Position>(initialLevel.startPos);
    const [playerRotation, setPlayerRotation] = useState<number>(0);
    const [commands, setCommands] = useState<Command[]>([]);
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);
    const [collectedStars, setCollectedStars] = useState<string[]>([]);
    const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(-1);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [hintMessage, setHintMessage] = useState<string>('');

    // Refs for mutable state in loop
    const playerPosRef = useRef(initialLevel.startPos);
    const collectedStarsRef = useRef<string[]>([]);
    const gameStateRef = useRef(GameState.MENU);
    const commandsRef = useRef<Command[]>([]);

    // Sync refs with state
    useEffect(() => {
        commandsRef.current = commands;
    }, [commands]);

    useEffect(() => {
        setLevel(initialLevel);
        resetLevel();
    }, [initialLevel]);

    const resetLevel = () => {
        setPlayerPos(initialLevel.startPos);
        playerPosRef.current = initialLevel.startPos;

        setPlayerRotation(0);

        setCollectedStars([]);
        collectedStarsRef.current = [];

        setGameState(GameState.PLAYING);
        gameStateRef.current = GameState.PLAYING;

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
        setCommands(prev => [...prev, newCommand]);
    };

    const clearCommands = () => {
        if (gameState !== GameState.PLAYING) return;
        playSound('CLICK', isMuted);
        setCommands([]);
    };

    const runCommands = () => {
        if (commands.length === 0) return;
        setGameState(GameState.RUNNING);
        gameStateRef.current = GameState.RUNNING;
        setCurrentCommandIndex(-1);
        playSound('CLICK', isMuted);
    };

    // Game Loop
    useEffect(() => {
        if (gameState !== GameState.RUNNING) return;

        let step = 0;
        const interval = setInterval(async () => {
            // Check if game is still running (might have been stopped by win/loss)
            if (gameStateRef.current !== GameState.RUNNING) {
                clearInterval(interval);
                return;
            }

            if (step >= commandsRef.current.length) {
                clearInterval(interval);
                handleGameOver(false, "Yah, perintahnya sudah habis tapi belum sampai rumah.");
                return;
            }

            setCurrentCommandIndex(step);
            const cmd = commandsRef.current[step];

            // Calculate new position using Ref
            let newPos = { ...playerPosRef.current };
            let newRotation = 0;

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

            // Valid move - Update Ref and State
            playerPosRef.current = newPos;
            setPlayerPos(newPos);
            playSound('MOVE', isMuted);

            // Check collectibles
            if (tile === TileType.STAR) {
                const starKey = `${newPos.x},${newPos.y}`;
                if (!collectedStarsRef.current.includes(starKey)) {
                    collectedStarsRef.current.push(starKey);
                    setCollectedStars([...collectedStarsRef.current]);
                    playSound('COLLECT', isMuted);
                }
            }

            // Check Goal
            if (tile === TileType.GOAL) {
                clearInterval(interval);

                const currentStarsCount = collectedStarsRef.current.length;

                if (currentStarsCount >= level.minStarsToWin) {
                    handleGameOver(true, await getWinMessage(currentStarsCount));
                } else {
                    handleGameOver(false, `Yah! Kamu butuh ${level.minStarsToWin} bintang, tapi baru punya ${currentStarsCount}.`);
                }
                return;
            }

            step++;
        }, 800);

        return () => clearInterval(interval);
    }, [gameState, level, isMuted]); // Removed commands, playerPos, collectedStars from deps

    const handleGameOver = async (win: boolean, message: string) => {
        if (win) {
            setGameState(GameState.WON);
            gameStateRef.current = GameState.WON;
            playSound('WIN', isMuted);

            const currentMax = parseInt(localStorage.getItem('kode-petualang-level') || '1');
            if (level.id >= currentMax) {
                localStorage.setItem('kode-petualang-level', (level.id + 1).toString());
            }
        } else {
            setGameState(GameState.LOST);
            gameStateRef.current = GameState.LOST;
            playSound('LOSE', isMuted);
            const hint = await getRoboHint(level, commandsRef.current, message, playerPosRef.current);
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
