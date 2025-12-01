"use client";

import React, { useState, useEffect } from 'react';
import { Rocket, Star, Play } from 'lucide-react';
import Link from 'next/link';
import { LEVELS } from '@/constants';

export default function SplashPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center p-4 text-white font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-30 animate-bounce-slow"><Rocket size={120} className="text-yellow-300" /></div>
        <div className="absolute bottom-32 right-16 opacity-30 animate-pulse-slow"><Star size={100} className="text-pink-300" /></div>
        <div className="absolute top-1/3 right-1/4 opacity-20 animate-bounce-slow" style={{ animationDelay: '1s' }}><Star size={80} className="text-blue-300" /></div>
        <div className="absolute bottom-1/4 left-1/4 opacity-20 animate-pulse-slow" style={{ animationDelay: '0.5s' }}><Rocket size={90} className="text-green-300" /></div>
      </div>

      {/* Main Content */}
      <div className="z-10 text-center max-w-2xl px-6">
        {/* Logo/Title */}
        <div className="mb-8 animate-bounce-slow">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-full p-8 mb-6 shadow-2xl">
            <Rocket size={80} className="text-yellow-300" />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl tracking-tight">
          <span className="text-yellow-300">Kode</span>
          <br />
          <span className="text-white">Petualang</span>
        </h1>

        <p className="text-2xl md:text-3xl mb-4 font-bold opacity-90 drop-shadow-lg">
          Belajar Berpikir Kritis 🧠
        </p>

        <p className="text-lg md:text-xl mb-12 opacity-80 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block">
          Petualangan seru untuk belajar coding sambil bermain!
        </p>

        {/* Play Button */}
        <Link
          href="/levels"
          className="group relative bg-white text-purple-600 px-12 py-6 rounded-full text-2xl font-black shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-4 mx-auto overflow-hidden w-fit"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Play size={32} className="relative z-10 fill-current" />
          <span className="relative z-10">MAIN SEKARANG</span>
        </Link>

        {/* Progress Indicator */}
        <div className="mt-8 text-sm font-bold bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full inline-block">
          🎯 Progres: Level {maxUnlockedLevel} / {LEVELS.length}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-sm opacity-50 font-medium">
        Dibuat untuk Liburan Sekolah • v1.2
      </div>
    </div>
  );
}
