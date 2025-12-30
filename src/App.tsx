import { useState, useMemo, useEffect } from 'react';
import { UserPlus, Play, Skull, HelpCircle, Swords, PartyPopper, Zap, AlertTriangle, Trophy, Trash2, Users, Smartphone, X, ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// --- CONFIGURACIÓN & DATOS ---
const TOTAL_TILES = 50;

interface Player {
  id: number;
  name: string;
  positionIndex: number;
  color: string;
}

interface TileType {
  id: string;
  color: string;
  icon: LucideIcon;
  label: string;
}

interface TileData {
  x: number;
  y: number;
  type: TileType;
  index: number;
}

const TILE_TYPES: TileType[] = [
  { id: 'PELIGRO', color: '#ef4444', icon: Skull, label: 'Peligro' },     // Rojo
  { id: 'TRIVIA', color: '#3b82f6', icon: HelpCircle, label: 'Trivia' },  // Azul
  { id: 'CHAMUYO', color: '#eab308', icon: Zap, label: 'Reto' },          // Amarillo
  { id: 'SUERTE', color: '#22c55e', icon: PartyPopper, label: 'Suerte' }, // Verde
  { id: 'VS', color: '#a855f7', icon: Swords, label: 'Versus' },          // Morado
];

const EVENTS_DB: Record<string, { text: string; actionText?: string; penalty?: number; bonus?: number; answer?: string }[]> = {
  PELIGRO: [
    { text: "Todos cambian de lugar a la izquierda.", penalty: 0 },
    { text: "10 flexiones o retrocede 3.", penalty: -3, actionText: "Fallo: -3" },
    { text: "El suelo es lava. El último en subirse a algo pierde.", penalty: -2, actionText: "Perdedor: -2" },
  ],
  TRIVIA: [
    { text: "¿Capital de Francia?", answer: "París", bonus: 1, actionText: "Acierta: +1" },
    { text: "¿Cuántos lados tiene un hexágono?", answer: "6", bonus: 1, actionText: "Acierta: +1" },
  ],
  CHAMUYO: [
    { text: "Cuenta un chiste. Si nadie se ríe, retrocede 2.", penalty: -2 },
    { text: "Envía un audio cantando al grupo de la familia.", penalty: -3 },
  ],
  SUERTE: [
    { text: "Avanza 2 casillas gratis.", bonus: 2 },
    { text: "Te perdiste. Retrocede 1.", penalty: -1 },
  ],
  VS: [
    { text: "Piedra, Papel o Tijera con el de la derecha.", penalty: -1, actionText: "Perdedor: -1" },
    { text: "Miradas fijas con el de la izquierda.", penalty: 0, actionText: "El que parpadea pierde" },
  ]
};

// --- COMPONENTE: RULETA ---
const Roulette = ({ onSpinComplete }: { onSpinComplete: (num: number) => void }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const spin = () => {
    if (spinning || result) return;
    setSpinning(true);
    
    const randomValue = Math.floor(Math.random() * 6) + 1;
    const segmentAngle = 360 / 6;
    const targetAngle = 1800 + (6 - randomValue) * segmentAngle + segmentAngle / 2; 
    
    setRotation(targetAngle);

    setTimeout(() => {
      setResult(randomValue);
      setSpinning(false);
    }, 3000); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border-4 border-yellow-500 rounded-3xl p-8 flex flex-col items-center shadow-2xl max-w-sm w-full">
        {!result ? (
          <>
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">¡GIRA LA RULETA!</h2>
            <div className="relative w-64 h-64 mb-8">
              {/* Flecha indicadora */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-white drop-shadow-md" />
              
              {/* Rueda */}
              <div 
                className="w-full h-full rounded-full border-8 border-slate-700 overflow-hidden shadow-xl relative transition-transform duration-[3000ms] cubic-bezier(0.15, 0.80, 0.15, 1)"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Segmentos */}
                <div className="w-full h-full rounded-full" style={{ 
                  background: `conic-gradient(
                    #ef4444 0deg 60deg, 
                    #3b82f6 60deg 120deg, 
                    #eab308 120deg 180deg, 
                    #22c55e 180deg 240deg, 
                    #a855f7 240deg 300deg, 
                    #f97316 300deg 360deg
                  )` 
                }}></div>
                
                {/* Números sobre los segmentos */}
                {[1, 2, 3, 4, 5, 6].map((num, i) => (
                   <span 
                    key={num}
                    className="absolute text-2xl font-black text-white drop-shadow-md"
                    style={{ 
                      top: '15%', left: '50%', 
                      transform: `translateX(-50%) rotate(${i * 60}deg) translateY(-20px)`, 
                      transformOrigin: '0 110px' 
                    }}
                   >
                     {num}
                   </span>
                ))}
                
                {/* Centro decorativo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-4 border-slate-300" />
              </div>
            </div>
            <button 
              onClick={spin}
              disabled={spinning}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {spinning ? 'GIRANDO...' : 'GIRAR AHORA'}
            </button>
          </>
        ) : (
          <div className="text-center animate-in zoom-in duration-300">
             <p className="text-slate-400 font-bold uppercase tracking-widest mb-2">SALIO EL</p>
             <div className="text-9xl font-black text-yellow-400 mb-6 drop-shadow-lg">{result}</div>
             <button 
               onClick={() => onSpinComplete(result)}
               className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-black text-xl rounded-xl shadow-lg transition-transform active:scale-95"
             >
               CONTINUAR
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  // ESTADOS
  const [view, setView] = useState<'menu' | 'add-players' | 'game' | 'win'>('menu');
  const [players, setPlayers] = useState<Player[]>([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const audioEnabled = true; // Audio siempre activo por defecto
  
  // Game Flow States
  const [phase, setPhase] = useState<'turn_start' | 'spinning' | 'moving' | 'event'>('turn_start');
  const [stepsToMove, setStepsToMove] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Form States
  const [newPlayerName, setNewPlayerName] = useState('');

  // --- RESPONSIVENESS & AUDIO ---
  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const playSound = (type: 'click' | 'step' | 'win') => {
    if (!audioEnabled) return;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const now = ctx.currentTime;
        if (type === 'click') {
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'step') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(200, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.05);
            osc.start(now); osc.stop(now + 0.05);
        }
    } catch(e) {
      // Ignorar errores de audio
    }
  };

  // --- GENERACIÓN DE TABLERO 2D (Path Serpiente SVG) ---
  const tilesData = useMemo(() => {
    const tiles: TileData[] = [];
    const rows = 5; 
    const cols = 10; // 50 casillas total
    // Dimensiones relativas para SVG (viewBox 0 0 1000 500)
    const boardWidth = 1000;
    const boardHeight = 500;
    
    const xStep = boardWidth / cols;
    const yStep = boardHeight / rows;
    const xOffset = xStep / 2;
    const yOffset = yStep / 2;

    for (let i = 0; i < TOTAL_TILES; i++) {
      const row = Math.floor(i / cols);
      const colInRow = i % cols;
      // Serpiente: filas pares ->, impares <-
      const col = row % 2 === 0 ? colInRow : (cols - 1 - colInRow);
      
      const x = col * xStep + xOffset;
      const y = row * yStep + yOffset;
      
      const type = i === TOTAL_TILES - 1 
        ? { id: 'META', color: '#ffffff', icon: Trophy, label: 'Final' } 
        : TILE_TYPES[i % TILE_TYPES.length];

      tiles.push({ x, y, type, index: i });
    }
    return tiles;
  }, []);

  // --- GAME LOGIC ---

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const colors = ['#ef4444', '#3b82f6', '#eab308', '#a855f7', '#f97316', '#10b981'];
    setPlayers([...players, { 
        id: Date.now(), 
        name: newPlayerName, 
        positionIndex: 0, 
        color: colors[players.length % colors.length] 
    }]);
    setNewPlayerName('');
    playSound('click');
  };

  const handleRemovePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
    playSound('click');
  };

  const startGame = () => {
    setView('game');
    setPhase('turn_start');
  };

  const resetGame = () => {
    setPlayers([]);
    setView('menu');
    setTurnIndex(0);
    setPhase('turn_start');
  };

  // Movimiento paso a paso
  useEffect(() => {
    if (phase === 'moving' && stepsToMove > 0) {
        const timer = setTimeout(() => {
            setPlayers(prev => {
                const newPlayers = [...prev];
                const player = newPlayers[turnIndex];
                
                if (player.positionIndex >= TOTAL_TILES - 1) {
                    // Ya ganó
                    return newPlayers; 
                }

                player.positionIndex += 1;
                playSound('step');
                return newPlayers;
            });
            setStepsToMove(s => s - 1);
        }, 400); // Velocidad del paso

        return () => clearTimeout(timer);
    } else if (phase === 'moving' && stepsToMove === 0) {
        // Terminó de moverse, chequear casilla
        const player = players[turnIndex];
        if (player.positionIndex >= TOTAL_TILES - 1) {
            setView('win');
        } else {
            // Activar evento
            const tile = tilesData[player.positionIndex];
            const eventList = EVENTS_DB[tile.type.id] || EVENTS_DB['SUERTE'];
            const randomEvent = eventList[Math.floor(Math.random() * eventList.length)];
            setCurrentEvent({ data: randomEvent, tileType: tile.type });
            setPhase('event');
        }
    }
  }, [phase, stepsToMove, players, turnIndex, tilesData]);

  const handleSpinComplete = (num: number) => {
      setStepsToMove(num);
      setPhase('moving');
  };

  const handleEventClose = (moveBonus: number = 0) => {
      if (moveBonus !== 0) {
         // Si hay penalización o bonus, aplicarlo instantáneamente (sin paso a paso para agilizar)
         setPlayers(prev => {
             const newPlayers = [...prev];
             let newPos = newPlayers[turnIndex].positionIndex + moveBonus;
             if (newPos < 0) newPos = 0;
             if (newPos >= TOTAL_TILES - 1) newPos = TOTAL_TILES - 1;
             newPlayers[turnIndex].positionIndex = newPos;
             return newPlayers;
         });
      }
      
      setCurrentEvent(null);
      // Siguiente turno
      setTurnIndex(prev => (prev + 1) % players.length);
      setPhase('turn_start');
  };

  // --- VISTAS ---

  // 1. PANTALLA GIRA TU MÓVIL
  if (isPortrait && view === 'game') {
    return (
        <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
            <Smartphone className="w-24 h-24 mb-6 animate-spin text-yellow-400" style={{ animationDuration: '3s' }} />
            <h1 className="text-3xl font-black mb-4">MODO HORIZONTAL</h1>
            <p className="text-slate-400">Gira tu dispositivo para ver el tablero completo.</p>
        </div>
    );
  }

  // 2. MENÚ PRINCIPAL
  if (view === 'menu') {
      return (
          <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/50 via-slate-900 to-black -z-10" />
              
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-600 mb-4 tracking-tighter drop-shadow-xl text-center">
                  QUE DESCONTROL
              </h1>
              <p className="text-slate-400 text-xl tracking-[0.5em] mb-12 uppercase">Board Game Edition</p>

              <div className="w-full max-w-md space-y-4">
                  <button onClick={() => setView('add-players')} className="w-full py-6 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-xl border border-white/10 shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
                      <Users /> JUGADORES ({players.length})
                  </button>
                  <button onClick={startGame} disabled={players.length === 0} className={`w-full py-6 rounded-2xl font-black text-2xl shadow-xl flex items-center justify-center gap-3 transition-all ${players.length > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] shadow-blue-500/30' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                      <Play fill="currentColor" /> JUGAR
                  </button>
              </div>
          </div>
      );
  }

  // 3. AGREGAR JUGADORES (Diseño Simple)
  if (view === 'add-players') {
      return (
          <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 flex flex-col items-center">
               <div className="w-full max-w-2xl">
                   <header className="flex items-center justify-between mb-8">
                       <button onClick={() => setView('menu')} className="p-3 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft /></button>
                       <h2 className="text-3xl font-black uppercase">Configurar Partida</h2>
                       <div className="w-10" /> 
                   </header>

                   <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 mb-6 flex gap-4">
                       <input 
                         type="text" 
                         value={newPlayerName}
                         onChange={(e) => setNewPlayerName(e.target.value)}
                         placeholder="Nombre del jugador..."
                         className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-xl px-4 text-lg focus:border-yellow-500 outline-none text-white transition-colors"
                         onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                       />
                       <button onClick={handleAddPlayer} disabled={!newPlayerName} className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50">
                           <UserPlus />
                       </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {players.map((p) => (
                           <div key={p.id} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border-l-8 animate-in slide-in-from-bottom-2" style={{ borderColor: p.color }}>
                               <span className="font-bold text-xl">{p.name}</span>
                               <button onClick={() => handleRemovePlayer(p.id)} className="text-red-400 hover:bg-red-400/20 p-2 rounded-lg transition-colors"><Trash2 size={20} /></button>
                           </div>
                       ))}
                       {players.length === 0 && <div className="col-span-full text-center text-slate-500 py-10 italic">Añade jugadores para comenzar...</div>}
                   </div>
               </div>
          </div>
      );
  }

  // 4. JUEGO (TABLERO 2D)
  const activePlayer = players[turnIndex];

  return (
      <div className="fixed inset-0 bg-[#1e293b] text-white font-sans overflow-hidden">
          {/* AVISO DE TURNO / RULETA */}
          {phase === 'turn_start' && (
             <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                 <div className="bg-slate-900 border-4 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full" style={{ borderColor: activePlayer.color }}>
                     <p className="text-slate-400 font-bold uppercase tracking-widest mb-2">TURNO DE</p>
                     <h2 className="text-5xl font-black mb-8 truncate" style={{ color: activePlayer.color }}>{activePlayer.name}</h2>
                     <button 
                        onClick={() => setPhase('spinning')}
                        className="w-full py-4 bg-white text-black font-black text-xl rounded-xl hover:scale-105 transition-transform shadow-lg"
                     >
                        TIRAR RULETA
                     </button>
                 </div>
             </div>
          )}

          {/* RULETA */}
          {phase === 'spinning' && <Roulette onSpinComplete={handleSpinComplete} />}

          {/* TARJETA DE EVENTO */}
          {phase === 'event' && currentEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in">
                 <div className="w-full max-w-lg bg-slate-900 rounded-3xl border-4 p-8 text-center shadow-2xl relative" style={{ borderColor: currentEvent.tileType.color }}>
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg bg-slate-800">
                         <currentEvent.tileType.icon size={40} style={{ color: currentEvent.tileType.color }} />
                     </div>
                     <div className="mt-8 mb-6">
                        <h3 className="text-4xl font-black uppercase italic mb-1" style={{ color: currentEvent.tileType.color }}>{currentEvent.tileType.label}</h3>
                     </div>
                     <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 mb-6">
                         <p className="text-2xl font-medium leading-relaxed">{currentEvent.data.text}</p>
                         {currentEvent.data.actionText && <div className="mt-4 inline-block bg-black/40 px-3 py-1 rounded-lg text-yellow-400 text-sm font-bold uppercase"><AlertTriangle size={14} className="inline mr-1"/>{currentEvent.data.actionText}</div>}
                         {currentEvent.data.answer && (
                            <details className="mt-4 pt-4 border-t border-white/10 cursor-pointer text-slate-500 hover:text-white">
                                <summary className="text-sm italic list-none">Ver respuesta</summary>
                                <p className="mt-2 text-green-400 font-bold text-xl">{currentEvent.data.answer}</p>
                            </details>
                         )}
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <button onClick={() => handleEventClose(0)} className="py-3 rounded-xl bg-slate-700 font-bold hover:bg-slate-600">Saltar</button>
                         <button onClick={() => handleEventClose((currentEvent.data.bonus || 0) + (currentEvent.data.penalty || 0))} className="py-3 rounded-xl font-black text-black bg-white hover:scale-105 transition-transform">LISTO</button>
                     </div>
                 </div>
              </div>
          )}

          {/* TABLERO SVG FONDO */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full max-w-6xl aspect-video bg-slate-800/50 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                  {/* Textura de fondo */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`, backgroundSize: '200px' }}></div>
                  
                  <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                      {/* CAMINO CONECTOR */}
                      <path 
                        d={tilesData.map((t, i) => (i === 0 ? `M ${t.x} ${t.y}` : `L ${t.x} ${t.y}`)).join(' ')} 
                        fill="none" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />

                      {/* CASILLAS */}
                      {tilesData.map((tile) => (
                          <g key={tile.index}>
                              {/* Sombra base */}
                              <circle cx={tile.x} cy={tile.y + 4} r="22" fill="rgba(0,0,0,0.5)" />
                              {/* Casilla */}
                              <circle cx={tile.x} cy={tile.y} r="22" fill={tile.type.color} stroke="white" strokeWidth={activePlayer.positionIndex === tile.index ? 3 : 0} />
                              {/* Número */}
                              {tile.type.id !== 'META' && (
                                  <text x={tile.x} y={tile.y} dy="5" textAnchor="middle" fill="rgba(0,0,0,0.5)" fontSize="14" fontWeight="900">{tile.index + 1}</text>
                              )}
                              {tile.type.id === 'META' && (
                                  <g transform={`translate(${tile.x - 12}, ${tile.y - 12})`}>
                                      <Trophy className="text-yellow-200" size={24} />
                                  </g>
                              )}
                          </g>
                      ))}

                      {/* JUGADORES (Fichas) */}
                      {players.map((p, i) => {
                          const tile = tilesData[p.positionIndex];
                          // Offset ligero si hay varios jugadores en la misma casilla
                          const offsetX = (i % 2) * 10 - 5;
                          const offsetY = Math.floor(i / 2) * 10 - 5;

                          return (
                              <g key={p.id} style={{ transition: 'all 0.4s ease-in-out' }} transform={`translate(${tile.x + offsetX}, ${tile.y + offsetY})`}>
                                  <circle r="12" fill={p.color} stroke="white" strokeWidth="2" className="drop-shadow-lg" />
                                  {turnIndex === i && <circle r="16" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 2" className="animate-spin-slow" />}
                              </g>
                          );
                      })}
                  </svg>
                  
                  <style>{`.animate-spin-slow { animation: spin 4s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
          </div>

          {/* BOTÓN SALIR DISCRETO */}
          <button onClick={() => setView('menu')} className="absolute top-4 right-4 p-2 bg-slate-900/50 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors">
              <X size={20} />
          </button>

          {/* PANTALLA VICTORIA */}
          {view === 'win' && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-yellow-500/90 backdrop-blur-md animate-in zoom-in">
                  <div className="text-center text-black">
                      <Trophy size={100} className="mx-auto mb-4 animate-bounce" />
                      <h1 className="text-8xl font-black uppercase mb-4">¡GANADOR!</h1>
                      <p className="text-4xl font-bold mb-12">{activePlayer.name}</p>
                      <button onClick={resetGame} className="px-12 py-6 bg-black text-white font-black text-2xl rounded-2xl hover:scale-105 transition-transform shadow-2xl">VOLVER AL MENÚ</button>
                  </div>
              </div>
          )}
      </div>
  );
}