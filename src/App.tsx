import { useState, useMemo, useEffect } from 'react';
import { UserPlus, Play, Skull, HelpCircle, Swords, PartyPopper, Zap, Trophy, Trash2, Users, Smartphone, X, ArrowLeft, RotateCcw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// --- CONFIGURACIÓN ---
const TOTAL_TILES = 50;
const TILE_SIZE = 70; // Tamaño base (se escalará en móviles)
const ROW_GAP = 30;   // Espacio entre filas

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
  isCorner: boolean; 
}

// Colores vibrantes estilo tablero infantil
const TILE_TYPES: TileType[] = [
  { id: 'PELIGRO', color: '#ff5252', icon: Skull, label: 'Peligro' },     
  { id: 'TRIVIA', color: '#448aff', icon: HelpCircle, label: 'Trivia' },  
  { id: 'CHAMUYO', color: '#ffd600', icon: Zap, label: 'Reto' },          
  { id: 'SUERTE', color: '#69f0ae', icon: PartyPopper, label: 'Suerte' }, 
  { id: 'VS', color: '#e040fb', icon: Swords, label: 'Versus' },          
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-black rounded-3xl p-6 flex flex-col items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xs w-full animate-in zoom-in">
        {!result ? (
          <>
            <h2 className="text-2xl font-black text-black mb-4 uppercase tracking-wider">¡GIRA!</h2>
            <div className="relative w-56 h-56 mb-6">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-black drop-shadow-md" />
              <div 
                className="w-full h-full rounded-full border-4 border-black overflow-hidden relative transition-transform duration-[3000ms] cubic-bezier(0.15, 0.80, 0.15, 1)"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="w-full h-full rounded-full" style={{ 
                  background: `conic-gradient(#ef4444 0deg 60deg, #3b82f6 60deg 120deg, #eab308 120deg 180deg, #22c55e 180deg 240deg, #a855f7 240deg 300deg, #f97316 300deg 360deg)` 
                }}></div>
                {[1, 2, 3, 4, 5, 6].map((num, i) => (
                   <span key={num} className="absolute text-2xl font-black text-white drop-shadow-md" style={{ top: '15%', left: '50%', transform: `translateX(-50%) rotate(${i * 60}deg) translateY(-20px)`, transformOrigin: '0 100px' }}>{num}</span>
                ))}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-black shadow-inner" />
              </div>
            </div>
            <button onClick={spin} disabled={spinning} className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black font-black text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:shadow-none disabled:opacity-50">
              {spinning ? 'GIRANDO...' : 'GIRAR'}
            </button>
          </>
        ) : (
          <div className="text-center w-full">
             <p className="text-slate-500 font-bold uppercase text-xs mb-2">SALIO EL</p>
             <div className="text-9xl font-black text-black mb-6">{result}</div>
             <button onClick={() => onSpinComplete(result)} className="w-full py-4 bg-green-500 hover:bg-green-400 text-white border-2 border-black font-black text-xl rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-1 active:shadow-none">AVANZAR</button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP ---
export default function App() {
  const [view, setView] = useState<'menu' | 'add-players' | 'game' | 'win'>('menu');
  const [players, setPlayers] = useState<Player[]>([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const audioEnabled = true; // Audio siempre activo
  
  const [phase, setPhase] = useState<'ready' | 'turn_start' | 'spinning' | 'moving' | 'event'>('ready');
  const [stepsToMove, setStepsToMove] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [newPlayerName, setNewPlayerName] = useState('');

  const playSound = (type: 'click' | 'step') => {
    if (!audioEnabled) return;
    try {
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
        } else {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.05);
        }
        osc.start(now); osc.stop(now + 0.1);
    } catch(e) {}
  };

  // --- GENERACIÓN TABLERO (10 COLUMNAS) ---
  const { tilesData, bridges } = useMemo(() => {
    const tiles: TileData[] = [];
    const bridgesData: { x: number, y: number, color: string }[] = [];
    
    const cols = 10; // 10 columnas como pediste
    const rows = Math.ceil(TOTAL_TILES / cols); // 5 filas
    
    const boardWidth = cols * TILE_SIZE;
    const boardHeight = rows * (TILE_SIZE + ROW_GAP) - ROW_GAP;
    
    const startX = -boardWidth / 2 + TILE_SIZE / 2;
    const startY = -boardHeight / 2 + TILE_SIZE / 2;

    for (let i = 0; i < TOTAL_TILES; i++) {
      const row = Math.floor(i / cols);
      const colInRow = i % cols;
      // Serpiente: Filas pares (0,2,4) -> Izquierda a Derecha
      // Filas impares (1,3) -> Derecha a Izquierda
      const isEvenRow = row % 2 === 0;
      const col = isEvenRow ? colInRow : (cols - 1 - colInRow);
      
      const x = startX + col * TILE_SIZE;
      const y = startY + row * (TILE_SIZE + ROW_GAP);
      
      const type = i === TOTAL_TILES - 1 
        ? { id: 'META', color: '#ffffff', icon: Trophy, label: 'Final' } 
        : TILE_TYPES[i % TILE_TYPES.length];

      // PUENTES: Conectar bajadas
      // Necesitamos puente si estamos al final visual de la fila y no es el último tile
      // Fin visual fila par: colInRow == 9
      // Fin visual fila impar: colInRow == 9 (porque 9 invertido es 0, el extremo izquierdo)
      if (colInRow === cols - 1 && i < TOTAL_TILES - 1) {
          bridgesData.push({ 
              x: x, 
              y: y + TILE_SIZE/2 + ROW_GAP/2, 
              color: type.color 
          });
      }

      tiles.push({ x, y, type, index: i, isCorner: colInRow === cols - 1 });
    }
    return { tilesData: tiles, bridges: bridgesData };
  }, []);

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const colors = ['#ef4444', '#3b82f6', '#eab308', '#a855f7', '#f97316', '#10b981'];
    setPlayers([...players, { id: Date.now(), name: newPlayerName, positionIndex: 0, color: colors[players.length % colors.length] }]);
    setNewPlayerName('');
    playSound('click');
  };

  const handleRemovePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
    playSound('click');
  };

  const startGame = () => {
    setView('game');
    setPhase('ready');
  };

  const resetGame = () => {
    setPlayers([]);
    setView('menu');
    setTurnIndex(0);
    setPhase('ready');
  };

  useEffect(() => {
    if (phase === 'moving' && stepsToMove > 0) {
        const timer = setTimeout(() => {
            setPlayers(prev => {
                const newPlayers = [...prev];
                const player = newPlayers[turnIndex];
                if (player.positionIndex >= TOTAL_TILES - 1) return newPlayers; 
                player.positionIndex += 1;
                playSound('step');
                return newPlayers;
            });
            setStepsToMove(s => s - 1);
        }, 300);
        return () => clearTimeout(timer);
    } else if (phase === 'moving' && stepsToMove === 0) {
        const player = players[turnIndex];
        if (player.positionIndex >= TOTAL_TILES - 1) {
            setView('win');
        } else {
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
      setTurnIndex(prev => (prev + 1) % players.length);
      setPhase('turn_start');
  };

  if (view === 'menu') {
      return (
          <div className="min-h-screen bg-sky-200 text-slate-900 flex flex-col items-center justify-center p-6 relative font-sans">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
              <h1 className="text-6xl font-black text-white mb-8 tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center text-stroke-3 text-stroke-black" style={{ WebkitTextStroke: '2px black' }}>QUE DESCONTROL</h1>
              <div className="w-full max-w-md bg-white border-4 border-black rounded-3xl p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] z-10">
                  <button onClick={() => setView('add-players')} className="w-full py-4 mb-4 bg-yellow-400 hover:bg-yellow-300 rounded-xl border-2 border-black font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 transition-transform active:translate-y-1 active:shadow-none">
                      <Users className="w-6 h-6" /> JUGADORES ({players.length})
                  </button>
                  <button onClick={startGame} disabled={players.length === 0} className={`w-full py-6 rounded-xl border-2 border-black font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 transition-transform active:translate-y-1 active:shadow-none ${players.length > 0 ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                      <Play fill="currentColor" /> JUGAR
                  </button>
              </div>
          </div>
      );
  }

  if (view === 'add-players') {
      return (
          <div className="min-h-screen bg-sky-200 text-slate-900 p-6 flex flex-col items-center">
               <div className="w-full max-w-md bg-white border-4 border-black rounded-3xl p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] mt-4">
                   <div className="flex items-center justify-between mb-6">
                       <button onClick={() => setView('menu')} className="p-2 bg-gray-200 border-2 border-black rounded-full hover:bg-gray-300"><ArrowLeft /></button>
                       <h2 className="text-2xl font-black uppercase">Jugadores</h2>
                       <div className="w-10" /> 
                   </div>
                   <div className="flex flex-col gap-3 mb-6">
                       <input 
                         type="text" 
                         value={newPlayerName}
                         onChange={(e) => setNewPlayerName(e.target.value)}
                         placeholder="Escribe un nombre..."
                         className="w-full bg-gray-100 border-2 border-black rounded-xl px-4 py-3 text-lg font-bold outline-none focus:bg-white"
                         onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                       />
                       <button onClick={handleAddPlayer} disabled={!newPlayerName} className="w-full bg-blue-500 hover:bg-blue-400 text-white border-2 border-black py-3 rounded-xl font-bold transition-transform active:translate-y-1 disabled:opacity-50 flex items-center justify-center gap-2">
                           <UserPlus /> AÑADIR
                       </button>
                   </div>
                   <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                       {players.map((p) => (
                           <div key={p.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border-2 border-black animate-in slide-in-from-bottom-2">
                               <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full border-2 border-black" style={{ backgroundColor: p.color }} /><span className="font-bold text-lg">{p.name}</span></div>
                               <button onClick={() => handleRemovePlayer(p.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg"><Trash2 size={20} /></button>
                           </div>
                       ))}
                       {players.length === 0 && <div className="text-center text-gray-400 py-8 font-bold italic">¡Lista vacía!</div>}
                   </div>
               </div>
          </div>
      );
  }

  const activePlayer = players[turnIndex];

  return (
      <div className="fixed inset-0 bg-sky-200 font-sans flex flex-col">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

          {/* HUD SUPERIOR */}
          <div className="relative z-30 bg-white border-b-4 border-black p-4 shadow-md flex items-center justify-between">
              <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">TURNO DE</p>
                  <h2 className="text-2xl font-black truncate max-w-[200px]" style={{ color: activePlayer?.color }}>{activePlayer?.name}</h2>
              </div>
              <button onClick={() => setView('menu')} className="p-2 bg-gray-100 border-2 border-black rounded-lg text-black hover:bg-red-100 transition-colors">
                  <X size={20} />
              </button>
          </div>

          {/* TABLERO SCROLLABLE */}
          <div className="flex-1 overflow-auto relative p-8">
             <div className="flex justify-center min-h-full items-start pt-10 pb-32"> 
                 <div className="relative transform scale-[0.6] origin-top"> {/* Escala para que 10 columnas quepan en vertical */}
                    {/* GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 70px)', rowGap: '30px', columnGap: '0px' }}>
                        {tilesData.map((tile) => (
                            <div key={tile.index} className="w-[70px] h-[70px] flex items-center justify-center relative box-border"
                                style={{ 
                                    backgroundColor: tile.type.id === 'META' ? 'white' : tile.type.color,
                                    border: '3px solid black', 
                                    borderRadius: '0px', 
                                }}
                            >
                                {tile.type.id === 'META' ? <Trophy className="text-yellow-500 w-8 h-8" /> : <span className="text-white/80 font-black text-xl drop-shadow-md">{tile.index + 1}</span>}
                            </div>
                        ))}
                    </div>

                    {/* PUENTES */}
                    {bridges.map((bridge, i) => (
                        <div key={i} className="absolute w-[60px] border-x-4 border-black z-0" 
                             style={{ 
                                 left: bridge.x - TILE_SIZE/2 + 5, 
                                 top: bridge.y - ROW_GAP/2 - TILE_SIZE/2, 
                                 height: ROW_GAP + TILE_SIZE, 
                                 backgroundColor: bridge.color 
                             }} 
                        />
                    ))}

                    {/* JUGADORES */}
                    {players.map((p, i) => {
                        const tile = tilesData[p.positionIndex];
                        const offset = (i * 5) - (players.length * 2.5); 
                        return (
                            <div 
                                key={p.id} 
                                className="absolute w-8 h-8 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out z-20 flex items-center justify-center"
                                style={{ 
                                    backgroundColor: p.color, 
                                    left: tile.x - 35 + 35 - 4 + offset, 
                                    top: tile.y - 35 + 35 - 4 + offset 
                                }}
                            >
                                <span className="text-[10px] font-black text-white">{p.name.substring(0, 1)}</span>
                            </div>
                        );
                    })}
                 </div>
             </div>
          </div>

          {/* FASE: READY */}
          {phase === 'ready' && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                  <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in pointer-events-auto">
                      <button onClick={() => setPhase('turn_start')} className="px-10 py-4 bg-green-500 text-white border-2 border-black rounded-xl font-black text-xl hover:bg-green-400 transition-transform active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">EMPEZAR TURNO</button>
                  </div>
              </div>
          )}

          {/* FASE: TURN START */}
          {phase === 'turn_start' && (
             <div className="absolute bottom-0 left-0 right-0 p-6 z-40 bg-white/90 backdrop-blur-md border-t-4 border-black rounded-t-3xl animate-in slide-in-from-bottom-10 flex flex-col items-center">
                 <p className="text-gray-500 font-black uppercase tracking-widest text-xs mb-2">TURNO DE</p>
                 <h2 className="text-3xl font-black mb-4 truncate w-full text-center" style={{ color: activePlayer.color }}>{activePlayer.name}</h2>
                 <button onClick={() => setPhase('spinning')} className="w-full max-w-sm py-4 bg-blue-500 text-white border-2 border-black font-black text-xl rounded-xl hover:bg-blue-400 transition-transform active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none animate-bounce">
                    TIRAR RULETA
                 </button>
             </div>
          )}

          {/* OVERLAYS */}
          {phase === 'spinning' && <Roulette onSpinComplete={handleSpinComplete} />}

          {phase === 'event' && currentEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 animate-in zoom-in">
                 <div className="w-full max-w-sm bg-white rounded-2xl border-4 border-black p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center border-4 border-black shadow-md bg-white">
                         <currentEvent.tileType.icon size={40} style={{ color: currentEvent.tileType.color }} />
                     </div>
                     <div className="mt-10 mb-4">
                        <h3 className="text-3xl font-black uppercase italic" style={{ color: currentEvent.tileType.color }}>{currentEvent.tileType.label}</h3>
                     </div>
                     <div className="bg-gray-100 p-4 rounded-xl border-2 border-black mb-6">
                         <p className="text-xl font-bold leading-tight">{currentEvent.data.text}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                         <button onClick={() => handleEventClose(0)} className="py-3 rounded-xl bg-gray-300 border-2 border-black font-bold hover:bg-gray-200">Saltar</button>
                         <button onClick={() => handleEventClose((currentEvent.data.bonus || 0) + (currentEvent.data.penalty || 0))} className="py-3 rounded-xl bg-black text-white border-2 border-black font-black hover:bg-gray-800">LISTO</button>
                     </div>
                 </div>
              </div>
          )}

          {view === 'win' && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-yellow-400 animate-in zoom-in p-4">
                  <div className="text-center text-black">
                      <Trophy size={80} className="mx-auto mb-4 animate-bounce" />
                      <h1 className="text-6xl font-black uppercase mb-4 drop-shadow-md text-white stroke-black" style={{ WebkitTextStroke: '2px black' }}>¡GANADOR!</h1>
                      <p className="text-4xl font-bold mb-12">{activePlayer?.name}</p>
                      <button onClick={resetGame} className="px-8 py-4 bg-white border-4 border-black text-black font-black text-xl rounded-2xl hover:scale-105 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-2"><RotateCcw className="inline mr-2" /> MENÚ</button>
                  </div>
              </div>
          )}
      </div>
  );
}