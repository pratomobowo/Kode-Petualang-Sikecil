
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS } from './constants';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { Modal } from './components/Modal';
import { Command, Direction, GameState, Position, TileType } from './types';
import { getRoboHint, getWinMessage } from './services/geminiService';
import { Rocket, Star, Volume2, VolumeX, BookOpen, Play, Home, Lock } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<number>(1);
  
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

  const currentLevel = LEVELS.find(l => l.id === currentLevelId);

  // Load progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('kode-petualang-level');
    if (savedProgress) {
      const level = parseInt(savedProgress, 10);
      if (!isNaN(level)) {
        setMaxUnlockedLevel(level);
      }
    }
  }, []);

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
  }, [commands, currentLevel, maxUnlockedLevel]);


  // -- RENDER: MENU --
  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 text-white font-sans overflow-y-auto custom-scroll">
        <div className="w-full max-w-5xl py-12 flex flex-col items-center">
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 opacity-20 animate-bounce-slow pointer-events-none fixed"><Rocket size={80} /></div>
          <div className="absolute bottom-20 right-10 opacity-20 animate-pulse-slow pointer-events-none fixed"><Star size={60} /></div>
          
          <div className="text-center z-10 max-w-2xl w-full mb-12">
            <h1 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-lg tracking-tight text-brand-yellow">
              Kode<br/>Petualang
            </h1>
            <p className="text-xl mb-4 font-medium opacity-90 bg-white/10 p-4 rounded-xl backdrop-blur-sm inline-block">
              Belajar berpikir kritis sambil bermain! 🚀
            </p>
            <div className="text-sm font-bold bg-black/20 px-4 py-2 rounded-full inline-block">
              Progres: Level {maxUnlockedLevel} / {LEVELS.length}
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full px-4">
            {LEVELS.map((lvl, idx) => {
              const isLocked = lvl.id > maxUnlockedLevel;
              return (
                <button
                  key={lvl.id}
                  onClick={() => !isLocked && setCurrentLevelId(lvl.id)}
                  disabled={isLocked}
                  className={`
                    group relative rounded-3xl p-5 text-left transition-all border-4 
                    flex flex-col h-full min-h-[140px] justify-between
                    ${isLocked 
                      ? 'bg-gray-800/40 border-gray-600/50 cursor-not-allowed opacity-70 grayscale' 
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/40 hover:scale-105 active:scale-95 cursor-pointer shadow-lg'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg
                      ${isLocked ? 'bg-gray-600 text-gray-400' : 'bg-brand-yellow text-brand-purple'}
                    `}>
                      {isLocked ? <Lock size={18}/> : lvl.id}
                    </div>
                    {/* Stars Requirement Indicator */}
                    <div className="flex gap-0.5">
                       {Array.from({length: Math.max(1, lvl.minStarsToWin)}).map((_, i) => (
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
                </button>
              );
            })}
          </div>
          
          <div className="mt-12 text-xs opacity-50 font-medium">
             Dibuat untuk Liburan Sekolah • v1.1
          </div>
        </div>
      </div>
    );
  }

  // -- RENDER: GAME --
  return (
    <div className="min-h-screen bg-sky-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setCurrentLevelId(null)}
             className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl text-gray-600 transition-colors"
           >
             <BookOpen size={24} />
           </button>
           <div>
             <h1 className="text-xl font-bold text-gray-800 leading-none">{currentLevel.name} <span className="text-gray-400 text-sm font-normal">#{currentLevel.id}</span></h1>
             <div className="flex gap-1 text-sm text-gray-500 items-center mt-1">
                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                   <Home size={12}/> Pulang
                </span>
                {currentLevel.minStarsToWin > 0 && (
                  <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    <Star size={12}/> Ambil {currentLevel.minStarsToWin}
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
        onHome={() => setCurrentLevelId(null)}
        onNextLevel={() => {
           // Find next level
           const nextId = (currentLevelId || 0) + 1;
           const exists = LEVELS.find(l => l.id === nextId);
           
           if (exists) {
             setCurrentLevelId(nextId);
           } else {
             // Game Completed
             setGameState(GameState.MENU);
             setCurrentLevelId(null);
           }
        }}
      />
    </div>
  );
};

export default App;
