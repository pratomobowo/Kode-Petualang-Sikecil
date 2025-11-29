import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS } from './constants';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { Modal } from './components/Modal';
import { Command, Direction, GameState, Position, TileType } from './types';
import { getRoboHint, getWinMessage } from './services/geminiService';
import { Rocket, Star, Volume2, VolumeX, BookOpen, Home } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  
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
        // Shake effect visual logic could go here
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
        setGameState(GameState.WON);
        const msg = await getWinMessage(collectedStarsRef.current.length);
        setModalMessage(msg);
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
  }, [commands, currentLevel]);


  // -- RENDER: MENU --
  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 text-white font-sans overflow-hidden relative">
        {/* Floating Background Elements */}
        <div className="absolute top-10 left-10 opacity-20 animate-bounce-slow"><Rocket size={80} /></div>
        <div className="absolute bottom-20 right-10 opacity-20 animate-pulse-slow"><Star size={60} /></div>
        
        <div className="text-center z-10 max-w-2xl w-full">
          <h1 className="text-6xl md:text-8xl font-black mb-4 drop-shadow-lg tracking-tight text-brand-yellow">
            Kode<br/>Petualang
          </h1>
          <p className="text-xl md:text-2xl mb-12 font-medium opacity-90 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            Belajar berpikir kritis sambil bermain! 🚀
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {LEVELS.map((lvl, idx) => (
              <button
                key={lvl.id}
                onClick={() => setCurrentLevelId(lvl.id)}
                className="group relative bg-white/20 hover:bg-white/30 backdrop-blur-md border-4 border-white/40 rounded-3xl p-6 text-left transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center font-bold text-brand-purple shadow-lg">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold mb-1">{lvl.name}</h3>
                <p className="text-sm opacity-80 mb-4">{lvl.description}</p>
                <div className="flex gap-1">
                  {Array.from({length: lvl.minStarsToWin}).map((_, i) => (
                    <Star key={i} size={16} className="fill-brand-yellow text-brand-yellow" />
                  ))}
                  {lvl.minStarsToWin === 0 && <span className="text-xs bg-brand-green px-2 py-1 rounded-full">Tutorial</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="fixed bottom-4 text-xs opacity-50">
           Dibuat untuk Liburan Sekolah • v1.0
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
             <h1 className="text-xl font-bold text-gray-800 leading-none">{currentLevel.name}</h1>
             <div className="flex gap-1 text-sm text-gray-500 items-center">
                <span>Tujuan:</span>
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
           // Fixed null safety: default to 0 if currentLevelId is somehow null, though flow prevents it
           const nextId = (currentLevelId || 0) + 1;
           const exists = LEVELS.find(l => l.id === nextId);
           if (exists) setCurrentLevelId(nextId);
           else {
             setGameState(GameState.MENU);
             setCurrentLevelId(null);
           }
        }}
      />
    </div>
  );
};

export default App;