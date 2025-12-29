import { useState, useMemo, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { UserPlus, Play, RotateCcw, Skull, HelpCircle, Swords, PartyPopper, Zap, AlertTriangle, Volume2, VolumeX, Crown, History, Camera, Trash2, ArrowLeft, Users, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// --- TIPOS ---
interface Character {
  id: string;
  name: string;
  color: string;
  render: () => ReactNode;
}

interface Player {
  id: number;
  name: string;
  positionIndex: number;
  character: Character; 
}

interface TileType {
  color: string;
  type: string;
  icon: LucideIcon;
  label: string;
}

interface TileData {
  x: number;
  y: number;
  typeData: TileType;
  index: number;
}

interface GameEventData {
  text: string;
  penalty?: number;
  bonus?: number;
  timer?: number;
  actionText?: string;
  answer?: string;
}

interface CurrentEvent {
  data: GameEventData;
  typeData: TileType;
}

// --- AVATARES PREMIUM ---
const CHARACTERS: Character[] = [
  { 
    id: 'link', name: 'Héroe', color: '#10b981', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="45" fill="#a7f3d0" />
        <path d="M20,40 L50,5 L80,40 L80,50 L20,50 Z" fill="#047857" /> 
        <path d="M50,5 L80,40 L20,40 Z" fill="#10b981" />
        <rect x="25" y="40" width="10" height="40" fill="#fcd34d" /> 
        <rect x="65" y="40" width="10" height="40" fill="#fcd34d" />
        <path d="M35,50 Q50,80 65,50" fill="none" stroke="#065f46" strokeWidth="3" /> 
      </svg>
    )
  },
  { 
    id: 'titan', name: 'Colosal', color: '#ef4444', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="15" y="10" width="70" height="80" rx="15" fill="#7f1d1d" /> 
        <path d="M15,30 L85,30" stroke="#fecaca" strokeWidth="4" /> 
        <path d="M15,50 L85,50" stroke="#fecaca" strokeWidth="4" />
        <path d="M15,70 L85,70" stroke="#fecaca" strokeWidth="4" />
        <rect x="25" y="35" width="20" height="15" fill="white" /> 
        <rect x="55" y="35" width="20" height="15" fill="white" />
        <rect x="30" y="75" width="40" height="10" fill="#fff" /> 
        <path d="M30,75 L30,85 M40,75 L40,85 M50,75 L50,85 M60,75 L60,85 M70,75 L70,85" stroke="#7f1d1d" strokeWidth="2" />
      </svg>
    )
  },
  { 
    id: 'trump', name: 'Presi', color: '#3b82f6', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="40" fill="#fdba74" /> 
        <path d="M10,40 Q30,10 50,30 T90,20" fill="#fcd34d" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" /> 
        <rect x="30" y="80" width="40" height="20" fill="#1e3a8a" /> 
        <path d="M45,80 L55,80 L50,100 Z" fill="#ef4444" /> 
      </svg>
    )
  },
  { 
    id: 'peach', name: 'Reina', color: '#ec4899', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="55" r="35" fill="#fbcfe8" />
        <path d="M25,25 L35,45 L50,15 L65,45 L75,25 L65,55 L35,55 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" /> 
        <circle cx="50" cy="55" r="5" fill="#3b82f6" /> 
        <circle cx="25" cy="55" r="10" fill="#fcd34d" /> 
        <circle cx="75" cy="55" r="10" fill="#fcd34d" />
      </svg>
    )
  },
  { 
    id: 'monk', name: 'Zen', color: '#f97316', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="45" r="30" fill="#fdba74" /> 
        <circle cx="50" cy="35" r="3" fill="#dc2626" /> 
        <path d="M10,80 Q50,110 90,80" fill="#ea580c" /> 
        <path d="M10,80 L90,80" stroke="#f97316" strokeWidth="5" />
        <path d="M30,80 L50,100 L70,80" fill="#fb923c" /> 
      </svg>
    )
  },
  { 
    id: 'japan', name: 'Nipón', color: '#ffffff', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="40" fill="white" stroke="#e5e5e5" strokeWidth="2" />
        <rect x="20" y="30" width="60" height="15" fill="white" stroke="#ef4444" strokeWidth="2" /> 
        <circle cx="50" cy="37" r="5" fill="#ef4444" /> 
        <path d="M30,60 L40,65 L50,60 L60,65 L70,60" fill="none" stroke="#000" strokeWidth="2" /> 
      </svg>
    )
  },
  { 
    id: 'lara', name: 'Exploradora', color: '#a855f7', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="35" fill="#d4a373" />
        <rect x="25" y="45" width="50" height="12" fill="#1e293b" rx="2" /> 
        <circle cx="35" cy="51" r="4" fill="#38bdf8" opacity="0.5" />
        <circle cx="65" cy="51" r="4" fill="#38bdf8" opacity="0.5" />
        <rect x="42" y="10" width="16" height="90" fill="#503830" rx="8" /> 
        <rect x="20" y="80" width="60" height="20" fill="#06b6d4" /> 
      </svg>
    )
  },
  { 
    id: 'goku', name: 'Saiyan', color: '#f59e0b', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M20,50 L10,20 L30,35 L50,5 L70,35 L90,20 L80,50 Z" fill="#000" /> 
        <circle cx="50" cy="60" r="28" fill="#fdba74" />
        <path d="M35,65 L45,70 L35,70 Z" fill="#000" /> 
        <path d="M65,65 L55,70 L65,70 Z" fill="#000" />
        <rect x="20" y="85" width="60" height="15" fill="#f97316" /> 
        <rect x="40" y="85" width="20" height="15" fill="#1e40af" /> 
      </svg>
    )
  },
  { 
    id: 'buu', name: 'Gordito', color: '#f472b6', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="60" r="35" fill="#f9a8d4" /> 
        <path d="M50,25 Q80,5 90,30" fill="none" stroke="#f9a8d4" strokeWidth="14" strokeLinecap="round" /> 
        <rect x="30" y="80" width="40" height="20" fill="#1f2937" /> 
        <circle cx="50" cy="85" r="5" fill="#fcd34d" /> 
        <path d="M35,55 Q50,65 65,55" fill="none" stroke="#000" strokeWidth="2" /> 
      </svg>
    )
  },
  { 
    id: 'panda', name: 'Panda', color: '#1f2937', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="40" fill="white" stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="25" r="12" fill="black" /> 
        <circle cx="75" cy="25" r="12" fill="black" />
        <ellipse cx="35" cy="45" rx="10" ry="8" fill="black" transform="rotate(-20 35 45)" /> 
        <ellipse cx="65" cy="45" rx="10" ry="8" fill="black" transform="rotate(20 65 45)" />
        <circle cx="37" cy="43" r="3" fill="white" />
        <circle cx="63" cy="43" r="3" fill="white" />
        <ellipse cx="50" cy="60" rx="6" ry="4" fill="black" /> 
      </svg>
    )
  }
];

// --- UTILIDAD DE AUDIO ---
const triggerFeedback = (type: string, audioEnabled = true) => {
  if (!audioEnabled) return;
  
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    if (type === 'click') navigator.vibrate(10);
    else if (type === 'bad') navigator.vibrate([50, 50, 50]);
    else if (type === 'win') navigator.vibrate([100, 50, 100]);
  }

  try {
    const Win = window as any;
    const AudioContext = Win.AudioContext || Win.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'click') {
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'bad') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    // Silently fail
  }
};

const TIPOS_CASILLA: TileType[] = [
  { color: '#ef4444', type: 'PELIGRO', icon: Skull, label: 'Castigo' }, 
  { color: '#3b82f6', type: 'TRIVIA', icon: HelpCircle, label: 'Trivia' }, 
  { color: '#eab308', type: 'CHAMUYO', icon: Zap, label: 'Reto' }, 
  { color: '#22c55e', type: 'SUERTE', icon: PartyPopper, label: 'Suerte' }, 
  { color: '#a855f7', type: 'VS', icon: Swords, label: 'Versus' }, 
];

const EVENTOS_DB: Record<string, GameEventData[]> = {
  PELIGRO: [
    { text: "¡TERREMOTO! Todos cambian de asiento a la izquierda.", penalty: 0 },
    { text: "Haz 10 flexiones o retrocede 3.", penalty: -3, actionText: "Fallo: -3" },
    { text: "Sentadilla isométrica hasta tu próximo turno.", penalty: -2, actionText: "Fallo: -2" },
    { text: "Súbete a una silla YA. El último pierde.", penalty: -5, actionText: "Último: -5" },
    { text: "Camina como cangrejo alrededor de la mesa.", penalty: 0 },
    { text: "Juega con los ojos cerrados un turno.", penalty: 0 }
  ],
  TRIVIA: [
    { text: "¿Capital de Australia?", answer: "Canberra", bonus: 1, actionText: "Acierta: +1" },
    { text: "¿Año llegada a la luna?", answer: "1969", penalty: -2, actionText: "Fallo: -2" },
    { text: "¿Quién canta 'Thriller'?", answer: "Michael Jackson", bonus: 2, actionText: "Canta: +2" },
    { text: "¿Corazones de un pulpo?", answer: "Tres", bonus: 2, actionText: "Acierta: +2" },
    { text: "Completa: 'A caballo regalado...'", answer: "...no se le miran los dientes", bonus: 1, actionText: "Acierta: +1" }
  ],
  CHAMUYO: [
    { text: "Audio cantando a tu ex.", penalty: -5, actionText: "O -5 casillas" },
    { text: "Lee tu último WhatsApp en voz alta.", penalty: -3, actionText: "O -3 casillas" },
    { text: "Imita a otro jugador.", bonus: 2, actionText: "Si adivinan: +2" },
    { text: "Llama a una pizzería y pide hamburguesa.", penalty: -4, actionText: "O -4 casillas" },
    { text: "Habla con acento extranjero un turno.", penalty: 0 }
  ],
  SUERTE: [
    { text: "¡Taxi! Avanza rápido.", bonus: 3, actionText: "Avanzas 3" },
    { text: "Olvidaste la billetera.", penalty: -2, actionText: "Retrocedes 2" },
    { text: "Encontraste dinero.", bonus: 1, actionText: "Avanzas 1" },
    { text: "¡Atajo secreto!", bonus: 5, actionText: "¡MEGA SALTO +5!" },
    { text: "Intercambia lugar con el último.", penalty: 0, actionText: "Cambio de lugar" }
  ],
  VS: [
    { text: "Piedra, Papel o Tijera (Derecha).", penalty: -2, actionText: "Perdedor: -2" },
    { text: "Duelo de miradas (Izquierda).", penalty: 0, actionText: "Parpadea: Pierde" },
    { text: "Pulseada china.", bonus: 2, actionText: "Ganador: +2" },
    { text: "Votación: ¿Quién es el más chamuyero?", penalty: -3, actionText: "Elegido: -3" }
  ]
};

// --- COMPONENTES VISUALES ---

const Confetti = () => {
  const particles = useMemo(() => [...Array(50)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    animDuration: 2 + Math.random() * 3,
    bg: ['#FFD700', '#FF6347', '#32CD32', '#1E90FF'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 2
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute top-[-20px] w-3 h-3 rounded-sm animate-fall"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.bg,
            animation: `fall ${p.animDuration}s linear infinite`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(720deg); } }`}</style>
    </div>
  );
};

const WinnerCamera = ({ onCapture, audioEnabled }: { onCapture: (data: string) => void, audioEnabled: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const startCamera = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError("Cámara no soportada.");
                return;
            }
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError("Permiso denegado.");
            }
        };
        startCamera();

        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
        };
    }, []);

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (!context) return;
            const { videoWidth, videoHeight } = videoRef.current;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
            context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
            
            try {
                const dataUrl = canvasRef.current.toDataURL('image/png');
                triggerFeedback('click', audioEnabled);
                onCapture(dataUrl);
            } catch (e) {
                setError("Error al capturar");
            }
        }
    };

    if (error) return <div className="text-red-400 p-4 border border-red-500 rounded bg-red-900/20">{error}</div>;

    return (
        <div className="relative w-full max-w-xs mx-auto rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl mb-4 bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button onClick={takePhoto} className="bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera size={24} />
                </button>
            </div>
        </div>
    );
};

const Dice3D = ({ rolling, value, onRoll }: { rolling: boolean; value: number; onRoll: () => void }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faces: any = {
    1: 'rotateX(0deg) rotateY(0deg)',
    2: 'rotateX(-90deg) rotateY(0deg)',
    3: 'rotateX(0deg) rotateY(-90deg)',
    4: 'rotateX(0deg) rotateY(90deg)',
    5: 'rotateX(90deg) rotateY(0deg)',
    6: 'rotateX(180deg) rotateY(0deg)',
  };

  return (
    <div className="relative w-24 h-24 perspective-1000 group cursor-pointer" onClick={onRoll}>
        <div 
            className="w-full h-full relative transform-style-3d transition-transform duration-[800ms] ease-out"
            style={{ transform: rolling ? `rotateX(${Math.random() * 1000}deg) rotateY(${Math.random() * 1000}deg)` : (faces[value] || faces[1]) }}
        >
            {[
              { id: 1, rot: 'translateZ(48px)', dots: [4] },
              { id: 6, rot: 'rotateY(180deg) translateZ(48px)', dots: [0,2,3,5,6,8] },
              { id: 2, rot: 'rotateX(90deg) translateZ(48px)', dots: [0,8] },
              { id: 5, rot: 'rotateX(-90deg) translateZ(48px)', dots: [0,2,4,6,8] },
              { id: 3, rot: 'rotateY(-90deg) translateZ(48px)', dots: [0,4,8] },
              { id: 4, rot: 'rotateY(90deg) translateZ(48px)', dots: [0,2,6,8] }
            ].map(face => (
               <div key={face.id} className="absolute w-24 h-24 bg-white border-2 border-slate-300 rounded-2xl grid grid-cols-3 grid-rows-3 p-3 gap-1 backface-hidden" style={{ transform: face.rot }}>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`rounded-full transition-all ${face.dots.includes(i) ? 'bg-black shadow-inner scale-100' : 'bg-transparent scale-0'}`} />
                  ))}
               </div>
            ))}
        </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [view, setView] = useState<'menu' | 'add-players' | 'game' | 'win'>('menu');
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [turnIndex, setTurnIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CurrentEvent | null>(null);
  const [screenFlash, setScreenFlash] = useState<string | null>(null); 
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastLog, setLastLog] = useState(""); 
  const [winnerPhoto, setWinnerPhoto] = useState<string | null>(null); 
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [totalTiles, setTotalTiles] = useState(50);
  const [isPortrait, setIsPortrait] = useState(false);

  // Detectar orientación
  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth);
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Carga inicial
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('que-descontrol-state');
        if (saved) {
            try {
                const p = JSON.parse(saved);
                if (p.players && p.players.length > 0) {
                    setPlayers(p.players.map((pl: any) => ({
                        ...pl,
                        character: CHARACTERS.find(c => c.id === pl.character.id) || CHARACTERS[0]
                    })));
                    setTurnIndex(p.turnIndex || 0);
                    setTotalTiles(p.totalTiles || 50);
                    setLastLog(p.lastLog || "");
                    if (p.gameState === 'playing') setView('game');
                }
            } catch (e) { console.error(e); }
        }
    }
  }, []);

  // Auto-guardado
  useEffect(() => {
    if (players.length > 0 && view === 'game') {
        localStorage.setItem('que-descontrol-state', JSON.stringify({ players, turnIndex, gameState: 'playing', totalTiles, lastLog }));
    }
  }, [players, turnIndex, view, totalTiles, lastLog]);

  // Lógica de tablero
  const tilesData = useMemo(() => {
    const tiles: TileData[] = [];
    let angle = 0;
    
    // Ajustes para modo apaisado (elipses en lugar de círculos)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const xRadiusBase = isMobile ? 120 : 250; 
    const yRadiusBase = isMobile ? 120 : 140; // Menor altura en desktop para que quepa en pantalla
    
    const xRadiusEnd = 20;
    const yRadiusEnd = 20;

    const angleIncrement = 0.45;

    for (let i = 0; i < totalTiles; i++) {
      const t = i / (totalTiles - 1);
      const currentXRadius = xRadiusBase - (xRadiusBase - xRadiusEnd) * t;
      const currentYRadius = yRadiusBase - (yRadiusBase - yRadiusEnd) * t;

      const x = Math.cos(angle) * currentXRadius;
      const y = Math.sin(angle) * currentYRadius;
      
      const typeData = TIPOS_CASILLA[i % TIPOS_CASILLA.length];
      
      tiles.push({ 
        x, y, 
        typeData: i === totalTiles - 1 ? { color: '#ffffff', type: 'META', icon: PartyPopper, label: 'Final' } : typeData,
        index: i
      });
      angle += angleIncrement; 
    }
    return tiles;
  }, [totalTiles]);

  // Lógica de juego
  const handleAddPlayer = () => {
    if (!newPlayerName.trim() || !selectedCharId) return;
    const char = CHARACTERS.find(c => c.id === selectedCharId);
    if (!char) return;
    
    setPlayers([...players, { id: Date.now(), name: newPlayerName, positionIndex: 0, character: char }]);
    setNewPlayerName('');
    setSelectedCharId(null);
    triggerFeedback('click', audioEnabled);
  };

  const handleRemovePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startGame = () => {
    setView('game');
    triggerFeedback('win', audioEnabled);
  };

  const resetGame = () => {
    localStorage.removeItem('que-descontrol-state');
    setPlayers([]);
    setTurnIndex(0);
    setView('menu');
    setLastLog("");
    setWinnerPhoto(null);
  };

  const rollDice = () => {
    if (isRolling || currentEvent) return;
    setIsRolling(true);
    triggerFeedback('click', audioEnabled);
    
    let rolls = 0;
    const interval = setInterval(() => {
        rolls++;
        if(rolls % 3 === 0) triggerFeedback('roll', audioEnabled);
        if(rolls > 15) {
            clearInterval(interval);
            executeMove();
        }
    }, 80);
  };

  const executeMove = () => {
    const finalRoll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(finalRoll);
    setIsRolling(false);
    
    const currentPlayer = players[turnIndex];
    let newPos = currentPlayer.positionIndex + finalRoll;
    if (newPos >= totalTiles - 1) {
        newPos = totalTiles - 1;
        updatePlayerPosition(newPos);
        setView('win');
        triggerFeedback('win', audioEnabled);
        return;
    }
    updatePlayerPosition(newPos);
    setTimeout(() => { 
        const tile = tilesData[newPos];
        if (tile.typeData.type !== 'META') {
            const events = EVENTOS_DB[tile.typeData.type] || EVENTOS_DB['SUERTE'];
            const rand = events[Math.floor(Math.random() * events.length)];
            setCurrentEvent({ data: rand, typeData: tile.typeData });
        }
    }, 1000);
  };

  const updatePlayerPosition = (newPos: number) => {
    const newPlayers = [...players];
    const diff = newPos - newPlayers[turnIndex].positionIndex;
    newPlayers[turnIndex].positionIndex = newPos;
    setPlayers(newPlayers);
    triggerFeedback('step', audioEnabled);
    if(diff !== 0) setLastLog(`${newPlayers[turnIndex].name}: ${diff > 0 ? '+' : ''}${diff}`);
  };

  const handleEventDecision = (applyConsequence: boolean) => {
      if (!currentEvent) return;
      const { data } = currentEvent;
      
      if (applyConsequence && (data.penalty || data.bonus)) {
          const moveAmount = (data.bonus || 0) + (data.penalty || 0);
          const currentPlayer = players[turnIndex];
          let newPos = currentPlayer.positionIndex + moveAmount;
          if (newPos < 0) newPos = 0;
          if (newPos >= totalTiles - 1) newPos = totalTiles - 1;

          setScreenFlash(moveAmount > 0 ? 'bg-green-500/30' : 'bg-red-500/30 animate-shake');
          triggerFeedback(moveAmount > 0 ? 'win' : 'bad', audioEnabled);
          setTimeout(() => setScreenFlash(null), 600);
          updatePlayerPosition(newPos);
      }
      setCurrentEvent(null);
      setTimeout(() => setTurnIndex((prev) => (prev + 1) % players.length), 1000);
  };

  // Render variables
  const activePlayer = players[turnIndex] || players[0];
  // Valor por defecto seguro para evitar pantalla negra
  const boardTransform = tilesData[activePlayer?.positionIndex] 
    ? { x: -tilesData[activePlayer.positionIndex].x, y: -tilesData[activePlayer.positionIndex].y }
    : { x: 0, y: 0 };

  const gameProgress = useMemo(() => {
      if (!players.length) return 0;
      const maxPos = Math.max(...players.map(p => p.positionIndex));
      return Math.min(maxPos / totalTiles, 1);
  }, [players, totalTiles]);

  const styles = `
    .transform-style-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .translate-z-12 { transform: translateZ(48px); } 
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .animate-shake { animation: shake 0.4s ease-in-out; }
  `;

  // --- VISTAS ---

  // PANTALLA "GIRA TU MÓVIL"
  if (isPortrait) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <Smartphone className="w-24 h-24 mb-6 animate-spin-slow text-yellow-400" />
        <h1 className="text-3xl font-black mb-4">¡GIRA TU MÓVIL!</h1>
        <p className="text-slate-400 text-lg">Este juego de mesa se disfruta mejor en horizontal, como un tablero real.</p>
        <style>{`.animate-spin-slow { animation: spin 3s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 25% { transform: rotate(90deg); } 100% { transform: rotate(90deg); } }`}</style>
      </div>
    );
  }

  // MENÚ
  if (view === 'menu') {
    return (
      <div className="h-screen bg-slate-900 text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-slate-950" />
        <button onClick={() => setAudioEnabled(!audioEnabled)} className="absolute top-6 right-6 p-3 bg-slate-800/50 rounded-full">{audioEnabled ? <Volume2 /> : <VolumeX className="text-red-400" />}</button>

        <div className="text-center z-10 w-full max-w-lg">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-2 drop-shadow-lg tracking-tighter">QUE DESCONTROL</h1>
            <p className="text-slate-400 text-xl tracking-[0.5em] mb-12 uppercase">Party Edition</p>

            <div className="flex gap-4 justify-center mb-8">
                <button onClick={() => setTotalTiles(25)} className={`px-6 py-3 rounded-xl font-bold transition-all ${totalTiles === 25 ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-800 text-slate-400'}`}>RÁPIDO (25)</button>
                <button onClick={() => setTotalTiles(50)} className={`px-6 py-3 rounded-xl font-bold transition-all ${totalTiles === 50 ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-slate-800 text-slate-400'}`}>NORMAL (50)</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setView('add-players')} className="py-6 rounded-2xl bg-slate-800 font-black text-xl hover:bg-slate-700 transition-all flex flex-col items-center gap-2 border border-white/5">
                    <Users size={32} className="text-blue-400" />
                    JUGADORES ({players.length})
                </button>
                <button onClick={startGame} disabled={players.length === 0} className={`py-6 rounded-2xl font-black text-xl transition-all flex flex-col items-center gap-2 ${players.length > 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white hover:scale-[1.02] shadow-orange-500/30' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'}`}>
                    <Play size={32} fill="currentColor" />
                    ¡JUGAR!
                </button>
            </div>
            
            {localStorage.getItem('que-descontrol-state') && (
                <button onClick={resetGame} className="mt-8 text-red-400 text-sm font-bold hover:text-red-300 flex items-center justify-center gap-2 mx-auto"><Trash2 size={16} /> Borrar datos</button>
            )}
        </div>
      </div>
    );
  }

  // AGREGAR JUGADORES
  if (view === 'add-players') {
    return (
      <div className="h-screen bg-slate-900 text-white p-8 relative flex gap-8 items-start justify-center">
        <button onClick={() => setView('menu')} className="absolute top-6 left-6 p-3 bg-slate-800 rounded-full hover:bg-slate-700"><ArrowLeft /></button>
        
        <div className="w-1/2 max-w-md bg-slate-800/50 p-8 rounded-3xl border border-white/5 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-black mb-6">NUEVO JUGADOR</h2>
            <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="Nombre..." className="w-full p-4 bg-slate-900 rounded-xl border border-slate-700 text-white text-lg focus:border-yellow-500 outline-none mb-6" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Elige un Avatar</p>
            <div className="grid grid-cols-5 gap-3 mb-8">
                {CHARACTERS.map(char => {
                    const isTaken = players.some(p => p.character.id === char.id);
                    const isSelected = selectedCharId === char.id;
                    return (
                        <button key={char.id} disabled={isTaken} onClick={() => setSelectedCharId(char.id)} className={`aspect-square rounded-xl p-1 flex items-center justify-center transition-all ${isSelected ? 'bg-yellow-500 scale-110 shadow-lg' : 'bg-slate-700'} ${isTaken ? 'opacity-20 grayscale' : 'hover:bg-slate-600'}`}>
                            <div className="w-full h-full pointer-events-none">{char.render()}</div>
                        </button>
                    );
                })}
            </div>
            <button onClick={handleAddPlayer} disabled={!newPlayerName || !selectedCharId} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${(!newPlayerName || !selectedCharId) ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'}`}>AGREGAR</button>
        </div>

        <div className="w-1/3 h-full bg-slate-900 p-6 rounded-3xl border border-white/5 overflow-y-auto">
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-4 sticky top-0 bg-slate-900 py-2">Lista ({players.length})</h3>
            <div className="space-y-3">
                {players.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-slate-800 p-3 px-4 rounded-xl border-l-4" style={{ borderColor: p.character.color }}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8">{p.character.render()}</div>
                            <span className="font-bold">{p.name}</span>
                        </div>
                        <button onClick={() => handleRemovePlayer(p.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                    </div>
                ))}
                {players.length === 0 && <p className="text-center text-slate-600 py-10 italic">Vacío...</p>}
            </div>
        </div>
      </div>
    );
  }

  // JUEGO (Horizontal Layout)
  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans select-none text-white transition-colors duration-500 ${screenFlash || ''}`} 
         style={{ background: `radial-gradient(circle at center, rgba(${15 + gameProgress * 60}, ${23 - gameProgress * 20}, ${42 - gameProgress * 40}, 1) 0%, rgba(${15 + gameProgress * 20}, ${23 - gameProgress * 10}, ${42 - gameProgress * 30}, 1) 100%)` }}>
        <style>{styles}</style>
        {view === 'win' && <Confetti />}

        {/* MODAL DE EVENTO */}
        {currentEvent && view === 'game' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in duration-300">
                <div className="w-full max-w-lg bg-slate-900 rounded-3xl border-4 p-8 text-center shadow-2xl flex flex-col gap-6" style={{ borderColor: currentEvent.typeData.color }}>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg" style={{ backgroundColor: currentEvent.typeData.color }}>
                            <currentEvent.typeData.icon size={40} className="text-white animate-pulse" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-4xl font-black uppercase italic">{currentEvent.typeData.type}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{currentEvent.typeData.label}</p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-800 p-6 rounded-2xl border border-white/10">
                        <p className="text-2xl font-medium leading-relaxed">{currentEvent.data.text}</p>
                        {currentEvent.data.actionText && <div className="mt-4 inline-block bg-black/40 px-4 py-1 rounded-lg text-yellow-400 text-sm font-bold uppercase">{currentEvent.data.actionText}</div>}
                        {currentEvent.data.answer && (
                            <details className="mt-4 pt-4 border-t border-white/10 cursor-pointer text-slate-500 hover:text-white">
                                <summary className="text-sm italic list-none">Ver respuesta</summary>
                                <p className="mt-2 text-green-400 font-bold text-xl">{currentEvent.data.answer}</p>
                            </details>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {(currentEvent.data.penalty || currentEvent.data.bonus) ? (
                            <>
                                <button onClick={() => handleEventDecision(false)} className="py-4 rounded-xl bg-slate-700 text-slate-300 font-bold hover:bg-slate-600 text-lg">Saltar</button>
                                <button onClick={() => handleEventDecision(true)} className="py-4 rounded-xl font-black text-xl text-white shadow-lg hover:scale-105 transition-transform" style={{ backgroundColor: currentEvent.data.bonus ? '#22c55e' : '#ef4444' }}>
                                    {currentEvent.data.bonus ? '¡HECHO!' : 'FALLÉ'}
                                </button>
                            </>
                        ) : (
                            <button onClick={() => handleEventDecision(false)} className="col-span-2 py-4 rounded-xl bg-white text-slate-900 font-black text-xl hover:scale-105 transition-transform">CONTINUAR</button>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* HUD IZQUIERDO (Jugador) */}
        <div className="absolute top-6 left-6 z-40 flex flex-col gap-4">
            <div className="bg-slate-900/90 backdrop-blur-md p-4 pr-8 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 animate-in slide-in-from-left-10">
                <div className="w-16 h-16 animate-bounce">{activePlayer?.character.render()}</div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Turno de</p>
                    <h2 className="text-3xl font-black leading-none whitespace-nowrap" style={{ color: activePlayer?.character.color }}>{activePlayer?.name}</h2>
                </div>
            </div>
            {lastLog && (
                <div className="bg-black/50 p-3 rounded-xl border border-white/10 backdrop-blur-sm text-sm text-slate-300 flex items-center gap-2 max-w-[250px]">
                    <History size={14} className="shrink-0" /> {lastLog}
                </div>
            )}
        </div>

        {/* HUD DERECHO (Dado) */}
        <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-4">
            <button onClick={() => setAudioEnabled(!audioEnabled)} className="pointer-events-auto p-3 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 border border-white/10">{audioEnabled ? <Volume2 size={24} className="text-green-400" /> : <VolumeX size={24} className="text-red-400" />}</button>
            
            {view === 'game' && !currentEvent && (
               <div className="pointer-events-auto mt-4 animate-in slide-in-from-right-10 duration-500 flex flex-col items-center gap-2">
                 <Dice3D rolling={isRolling} value={diceValue} onRoll={rollDice} />
                 {!isRolling && <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50 animate-pulse">TIRAR</p>}
               </div>
            )}
        </div>

        {/* TABLERO CENTRAL */}
        <div className="absolute left-1/2 top-1/2 w-0 h-0 transition-transform duration-1000 cubic-bezier(0.25, 1, 0.5, 1)" style={{ transform: `translate(${boardTransform.x}px, ${boardTransform.y}px) scale(1)` }}>
            <svg className="absolute overflow-visible opacity-40" style={{ left: 0, top: 0, zIndex: 0 }}>
                <defs><filter id="glow"><feGaussianBlur stdDeviation="4" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs>
                <path d={`M ${tilesData.map(t => `${t.x},${t.y}`).join(' L ')}`} fill="none" stroke={gameProgress > 0.7 ? '#ef4444' : 'cyan'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" className="animate-pulse" />
            </svg>
            {tilesData.map((tile, i) => (
                <div key={i} className="flex items-center justify-center transition-all duration-500 absolute" style={{ 
                    left: '50%', top: '50%', 
                    transform: `translate(calc(-50% + ${tile.x}px), calc(-50% + ${tile.y}px)) scale(${activePlayer?.positionIndex === i ? 1.4 : 1})`,
                    width: '45px', height: '45px', backgroundColor: tile.typeData.color, borderRadius: activePlayer?.positionIndex === i ? '50%' : '14px',
                    boxShadow: activePlayer?.positionIndex === i ? `0 0 35px ${tile.typeData.color}` : '0 8px 10px rgba(0,0,0,0.3)',
                    zIndex: activePlayer?.positionIndex === i ? 30 : 10, border: activePlayer?.positionIndex === i ? '4px solid white' : '1px solid rgba(255,255,255,0.2)'
                }}>
                    <tile.typeData.icon size={24} className="text-black/20 absolute" />
                    <span className="relative text-white font-bold text-lg drop-shadow-md z-10">{i + 1}</span>
                </div>
            ))}
            {players.map((p) => (
                <div key={p.id} className="absolute left-1/2 top-1/2 w-12 h-12 bg-slate-900 rounded-full border-4 border-white shadow-xl z-50 flex items-center justify-center overflow-hidden transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)" style={{
                    backgroundColor: p.character.color,
                    transform: `translate(calc(-50% + ${tilesData[p.positionIndex]?.x || 0}px), calc(-50% + ${(tilesData[p.positionIndex]?.y || 0) - 45}px))`,
                    boxShadow: `0 0 20px ${p.character.color}`
                }}>
                    <div className="w-8 h-8">{p.character.render()}</div>
                    {activePlayer?.id === p.id && <Crown size={20} className="absolute -top-3 text-yellow-400 fill-yellow-400 drop-shadow-lg animate-bounce" />}
                </div>
            ))}
        </div>

        {/* PANTALLA DE VICTORIA */}
        {view === 'win' && activePlayer && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in">
                <div className="bg-yellow-400 text-black p-8 rounded-3xl shadow-2xl text-center border-4 border-black max-w-sm w-full relative overflow-hidden">
                    {!winnerPhoto ? (
                        <div className="mb-6">
                            <WinnerCamera onCapture={setWinnerPhoto} audioEnabled={audioEnabled} />
                            <p className="text-xs font-bold uppercase tracking-widest mt-2 animate-pulse">¡Foto del Campeón!</p>
                        </div>
                    ) : (
                        <div className="relative mb-6 rotate-2 border-4 border-black rounded-xl overflow-hidden shadow-xl mx-auto w-48 h-48">
                            <img src={winnerPhoto} alt="Winner" className="w-full h-full object-cover" />
                            <Crown size={64} className="absolute -top-6 -right-6 text-yellow-400 fill-yellow-400 drop-shadow-lg animate-bounce" />
                        </div>
                    )}
                    <h2 className="text-5xl font-black mb-2 uppercase tracking-tighter">¡CAMPEÓN!</h2>
                    <p className="text-2xl mb-8 font-bold leading-tight">{activePlayer.name}</p>
                    <button onClick={resetGame} className="w-full bg-black text-white px-6 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"><RotateCcw size={24} /> VOLVER AL INICIO</button>
                </div>
            </div>
        )}
        
        <div className={`absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_0%,_rgba(0,0,0,${0.5 + gameProgress * 0.4})_100%)] z-30`} />
    </div>
  );
}