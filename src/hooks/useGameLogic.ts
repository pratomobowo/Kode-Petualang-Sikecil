import { useState, useRef, useCallback, useEffect } from 'react';
import { Command, Direction, GameState, Position, TileType, Level } from '../types';
import { getRoboHint, getWinMessage } from '../services/geminiService';

export const useGameLogic = (currentLevel: Level | undefined, maxUnlockedLevel: number, setMaxUnlockedLevel: (level: number) => void) => {
    // Game Logic State
    const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
    const [commands, setCommands] = useState<Command[]>([]);
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);
    const [collectedStars, setCollectedStars] = useState<string[]>([]);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [hintMessage, setHintMessage] = useState<string>('');
    const [isMuted, setIsMuted] = useState(false);

    // References for game loop
    const playerPosRef = useRef(playerPos);
    const collectedStarsRef = useRef(collectedStars);
    const isRunningRef = useRef(false);

    // Initialize level
    useEffect(() => {
        if (currentLevel) {
            setPlayerPos(currentLevel.startPos);
            playerPosRef.current = currentLevel.startPos;
            setCommands([]);
            setCollectedStars([]);
            collectedStarsRef.current = [];
            setGameState(GameState.PLAYING);
            setModalMessage('');
            setHintMessage('');
        }
    }, [currentLevel]);

    // Command handlers
    const addCommand = (direction: Direction) => {
        if (commands.length < (currentLevel?.maxCommands || 10)) {
            const newCmd: Command = { id: Math.random().toString(36).substr(2, 9), direction };
            setCommands(prev => [...prev, newCmd]);
        }
    };

    const clearCommands = () => setCommands([]);

    const resetLevel = () => {
        if (currentLevel) {
            setPlayerPos(currentLevel.startPos);
            playerPosRef.current = currentLevel.startPos;
            setCollectedStars([]);
            collectedStarsRef.current = [];
            setGameState(GameState.PLAYING);
        }
    };

    // The Game Loop (Execution)
    const runCommands = useCallback(async () => {
        if (!currentLevel) return;

        setGameState(GameState.RUNNING);
        isRunningRef.current = true;
        resetLevel();

        // Small delay before starting
        await new Promise(r => setTimeout(r, 500));

        let failed = false;
        let failureReason = '';

        for (let i = 0; i < commands.length; i++) {
            if (!isRunningRef.current) break; // Emergency stop

            const cmd = commands[i];
            const current = playerPosRef.current;
            let next = { ...current };

            if (cmd.direction === Direction.UP) next.y -= 1;
            if (cmd.direction === Direction.DOWN) next.y += 1;
            if (cmd.direction === Direction.LEFT) next.x -= 1;
            if (cmd.direction === Direction.RIGHT) next.x += 1;

            // Check Bounds
            if (next.x < 0 || next.x >= currentLevel.gridSize || next.y < 0 || next.y >= currentLevel.gridSize) {
                failed = true;
                failureReason = "Robot menabrak dinding batas area.";
            }
            // Check Obstacles
            else if (currentLevel.layout[next.y][next.x] === TileType.WALL) {
                failed = true;
                failureReason = "Robot menabrak batu besar.";
            }

            if (failed) {
                break;
            }

            // Move Success
            setPlayerPos(next);
            playerPosRef.current = next;

            // Check Collectibles
            const tileType = currentLevel.layout[next.y][next.x];
            if (tileType === TileType.STAR) {
                const key = `${next.x},${next.y}`;
                if (!collectedStarsRef.current.includes(key)) {
                    const newStars = [...collectedStarsRef.current, key];
                    setCollectedStars(newStars);
                    collectedStarsRef.current = newStars;
                }
            }

            // Wait for animation
            await new Promise(r => setTimeout(r, 600));
        }

        // End Condition Check
        const finalPos = playerPosRef.current;
        const tileAtEnd = currentLevel.layout[finalPos.y][finalPos.x];

        if (failed) {
            setGameState(GameState.LOST);
            setModalMessage("Aduh! Robot tidak bisa lewat.");
            const hint = await getRoboHint(currentLevel, commands, failureReason, finalPos);
            setHintMessage(hint);
        } else if (tileAtEnd === TileType.GOAL) {
            if (collectedStarsRef.current.length >= currentLevel.minStarsToWin) {
                // WIN CONDITION
                setGameState(GameState.WON);
                const msg = await getWinMessage(collectedStarsRef.current.length);
                setModalMessage(msg);

                // Unlock next level
                if (currentLevel.id >= maxUnlockedLevel) {
                    const nextLevel = currentLevel.id + 1;
                    setMaxUnlockedLevel(nextLevel);
                    localStorage.setItem('kode-petualang-level', nextLevel.toString());
                }

            } else {
                setGameState(GameState.LOST);
                setModalMessage(`Kamu butuh ${currentLevel.minStarsToWin} bintang lagi!`);
                setHintMessage("Cari jalan yang melewati bintang ya!");
            }
        } else {
            setGameState(GameState.LOST);
            setModalMessage("Robot belum sampai di rumah.");
            setHintMessage(await getRoboHint(currentLevel, commands, "Robot berhenti di tengah jalan.", finalPos));
        }

        isRunningRef.current = false;
    }, [commands, currentLevel, maxUnlockedLevel, setMaxUnlockedLevel]);

    return {
        playerPos,
        commands,
        gameState,
        collectedStars,
        modalMessage,
        hintMessage,
        isMuted,
        setIsMuted,
        setGameState,
        addCommand,
        clearCommands,
        resetLevel,
        runCommands
    };
};
