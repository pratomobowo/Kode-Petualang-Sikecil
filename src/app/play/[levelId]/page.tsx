"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { LEVELS } from '@/constants';
import { GameState } from '@/types';
import { Grid } from '@/components/Grid';
import { Controls } from '@/components/Controls';
import { Modal } from '@/components/Modal';
import { useGameLogic } from '@/hooks/useGameLogic';
import { BookOpen, Home, Star, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

export default function GamePage({ params }: { params: Promise<{ levelId: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const levelId = parseInt(resolvedParams.levelId, 10);
    const currentLevel = LEVELS.find(l => l.id === levelId);

    const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<number>(1);

    useEffect(() => {
        const savedProgress = localStorage.getItem('kode-petualang-level');
        if (savedProgress) {
            const level = parseInt(savedProgress, 10);
            if (!isNaN(level)) {
                setMaxUnlockedLevel(level);
            }
        }
    }, []);

    const handleSetMaxUnlockedLevel = (level: number) => {
        setMaxUnlockedLevel(level);
        localStorage.setItem('kode-petualang-level', level.toString());
    };

    const {
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
    } = useGameLogic(currentLevel, maxUnlockedLevel, handleSetMaxUnlockedLevel);

    if (!currentLevel) {
        return <div className="p-8 text-center">Level tidak ditemukan! <Link href="/levels" className="text-blue-500 underline">Kembali</Link></div>;
    }

    return (
        <div className="min-h-screen bg-sky-100 font-sans flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <Link
                        href="/levels"
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-600 transition-colors"
                    >
                        <BookOpen size={24} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 leading-none">{currentLevel.name} <span className="text-gray-400 text-sm font-normal">#{currentLevel.id}</span></h1>
                        <div className="flex gap-1 text-sm text-gray-500 items-center mt-1">
                            <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                <Home size={12} /> Pulang
                            </span>
                            {currentLevel.minStarsToWin > 0 && (
                                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                    <Star size={12} /> Ambil {currentLevel.minStarsToWin}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-gray-600">
                    {isMuted ? <VolumeX /> : <Volume2 />}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-8 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full items-start justify-center">

                {/* Game Area */}
                <div className="flex-grow flex flex-col items-center justify-center w-full max-w-lg mx-auto md:mx-0">
                    <div className="relative w-full">
                        <Grid level={currentLevel} playerPos={playerPos} collectedStars={collectedStars} />
                    </div>

                    <div className="mt-6 bg-white p-4 rounded-2xl shadow-sm w-full border-l-4 border-blue-400">
                        <h4 className="font-bold text-gray-700 mb-1 flex items-center gap-2">
                            <span className="text-2xl">💡</span> Misi:
                        </h4>
                        <p className="text-gray-600">{currentLevel.description}</p>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <Controls
                    onAddCommand={addCommand}
                    onRun={runCommands}
                    onReset={resetLevel}
                    onClear={clearCommands}
                    commands={commands}
                    gameState={gameState}
                    maxCommands={currentLevel.maxCommands}
                />

            </main>

            {/* Modals */}
            <Modal
                gameState={gameState}
                message={modalMessage}
                hint={hintMessage}
                onRetry={() => {
                    setGameState(GameState.PLAYING);
                    resetLevel();
                }}
                onHome={() => router.push('/levels')}
                onNextLevel={() => {
                    // Find next level
                    const nextId = (currentLevel.id || 0) + 1;
                    const exists = LEVELS.find(l => l.id === nextId);

                    if (exists) {
                        router.push(`/play/${nextId}`);
                    } else {
                        // Game Completed
                        router.push('/levels');
                    }
                }}
            />
        </div>
    );
}
