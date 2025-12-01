"use client";

import React, { useState, useEffect } from 'react';
import { Rocket, Star, Lock, Home } from 'lucide-react';
import Link from 'next/link';
import { LEVELS } from '@/constants';

export default function LevelsPage() {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 text-white font-sans overflow-y-auto custom-scroll">
            <div className="w-full max-w-5xl py-12 flex flex-col items-center">

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 opacity-20 animate-bounce-slow pointer-events-none fixed"><Rocket size={80} /></div>
                <div className="absolute bottom-20 right-10 opacity-20 animate-pulse-slow pointer-events-none fixed"><Star size={60} /></div>

                <div className="text-center z-10 max-w-2xl w-full mb-12">
                    <h1 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-lg tracking-tight text-yellow-300">
                        Pilih Level
                    </h1>
                    <div className="mb-4">
                        <p className="text-xl font-medium opacity-90 bg-white/10 p-4 rounded-xl backdrop-blur-sm inline-block">
                            Pilih petualangan yang ingin kamu mainkan! 🎮
                        </p>
                    </div>
                    <div>
                        <div className="text-sm font-bold bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full inline-block">
                            📊 Progres: Level {maxUnlockedLevel} / {LEVELS.length}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full px-4">
                    {LEVELS.map((lvl, idx) => {
                        const isLocked = lvl.id > maxUnlockedLevel;
                        const content = (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg
                      ${isLocked ? 'bg-gray-600 text-gray-400' : 'bg-yellow-300 text-purple-600'}
                    `}>
                                        {isLocked ? <Lock size={18} /> : lvl.id}
                                    </div>
                                    {/* Stars Requirement Indicator */}
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: Math.max(1, lvl.minStarsToWin) }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={lvl.minStarsToWin > 0 ? "fill-white/80 text-transparent" : "opacity-0"}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-lg font-bold leading-tight mb-1 ${isLocked ? 'text-gray-400' : 'text-white'}`}>
                                        {lvl.name}
                                    </h3>
                                    {!isLocked && (
                                        <p className="text-xs opacity-80 line-clamp-2 leading-relaxed">
                                            {lvl.description}
                                        </p>
                                    )}
                                </div>
                            </>
                        );

                        if (isLocked) {
                            return (
                                <div
                                    key={lvl.id}
                                    className={`
                    group relative rounded-3xl p-5 text-left transition-all border-4 
                    flex flex-col h-full min-h-[140px] justify-between
                    bg-gray-800/40 border-gray-600/50 cursor-not-allowed opacity-70 grayscale
                  `}
                                >
                                    {content}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={lvl.id}
                                href={`/robo/play/${lvl.id}`}
                                className={`
                    group relative rounded-3xl p-5 text-left transition-all border-4 
                    flex flex-col h-full min-h-[140px] justify-between
                    bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/40 hover:scale-105 active:scale-95 cursor-pointer shadow-lg
                  `}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </div>

                {/* Back to Game Selection Button */}
                <Link
                    href="/games"
                    className="mt-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <Home size={20} />
                    Kembali ke Pilihan Game
                </Link>

                <div className="mt-6 text-xs opacity-50 font-medium">
                    Dibuat untuk Liburan Sekolah • v1.2
                </div>
            </div>
        </div>
    );
}
