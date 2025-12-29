import { useState, useMemo, useEffect, useRef } from 'react';
import type { ReactNode } from 'react'; // Importamos el tipo específico para evitar errores
import { UserPlus, Play, RotateCcw, Skull, HelpCircle, Swords, PartyPopper, Zap, AlertTriangle, Volume2, VolumeX, Crown, History, Camera, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// --- DEFINICIONES DE TIPOS (TYPESCRIPT) ---
interface Character {
  id: string;
  name: string;
  color: string;
  render: () => ReactNode; // Usamos ReactNode en lugar de JSX.Element
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
  timer?: number; // Reincorporado como opcional por compatibilidad
  actionText?: string;
  answer?: string;
}

interface CurrentEvent {
  data: GameEventData;
  typeData: TileType;
}

// --- AVATARES PERSONALIZADOS (SVG EN CÓDIGO) ---
const CHARACTERS: Character[] = [
  { 
    id: 'link', name: 'Link', color: '#10b981', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <path d="M20,80 L50,10 L80,80 Z" fill="#10b981" /> 
        <circle cx="50" cy="70" r="20" fill="#fcd34d" /> 
        <rect x="45" y="10" width="10" height="90" fill="#fbbf24" transform="rotate(-45 50 50)" /> 
      </svg>
    )
  },
  { 
    id: 'titan', name: 'Titán', color: '#ef4444', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <rect x="20" y="20" width="60" height="70" rx="10" fill="#991b1b" /> 
        <rect x="25" y="25" width="50" height="60" rx="5" fill="#ef4444" /> 
        <circle cx="35" cy="45" r="5" fill="white" /> 
        <circle cx="65" cy="45" r="5" fill="white" /> 
        <rect x="35" y="70" width="30" height="5" fill="white" /> 
      </svg>
    )
  },
  { 
    id: 'trump', name: 'Presi', color: '#3b82f6', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="35" fill="#fdba74" /> 
        <path d="M20,40 Q50,0 80,40" fill="#fcd34d" stroke="#f59e0b" strokeWidth="3" /> 
        <rect x="40" y="75" width="20" height="25" fill="#ef4444" /> 
      </svg>
    )
  },
  { 
    id: 'peach', name: 'Princesa', color: '#ec4899', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="60" r="30" fill="#fbcfe8" />
        <path d="M30,30 L40,50 L50,20 L60,50 L70,30 L50,50 Z" fill="#fbbf24" /> 
        <circle cx="50" cy="60" r="5" fill="#db2777" /> 
      </svg>
    )
  },
  { 
    id: 'monk', name: 'Monje', color: '#f97316', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="35" fill="#fdba74" />
        <path d="M20,80 Q50,100 80,80" fill="none" stroke="#ea580c" strokeWidth="8" /> 
        <circle cx="50" cy="45" r="3" fill="#000" /> 
      </svg>
    )
  },
  { 
    id: 'japan', name: 'Japón', color: '#ffffff', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="40" fill="white" stroke="#ef4444" strokeWidth="2" />
        <circle cx="50" cy="50" r="15" fill="#ef4444" /> 
        <rect x="20" y="40" width="60" height="10" fill="#ef4444" opacity="0.3" /> 
      </svg>
    )
  },
  { 
    id: 'lara', name: 'Lara', color: '#a855f7', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="50" r="35" fill="#d4a373" />
        <rect x="30" y="45" width="40" height="10" fill="#1e293b" /> 
        <rect x="45" y="20" width="10" height="80" fill="#3f2c22" rx="5" /> 
      </svg>
    )
  },
  { 
    id: 'goku', name: 'Saiyan', color: '#f59e0b', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="60" r="25" fill="#fdba74" />
        <path d="M20,50 L10,20 L40,30 L50,5 L60,30 L90,20 L80,50 Z" fill="#000" /> 
        <rect x="25" y="80" width="50" height="20" fill="#f97316" /> 
      </svg>
    )
  },
  { 
    id: 'buu', name: 'Buu', color: '#f472b6', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="50" cy="60" r="35" fill="#f472b6" />
        <path d="M50,30 Q80,10 90,30" fill="none" stroke="#f472b6" strokeWidth="12" strokeLinecap="round" /> 
        <rect x="35" y="55" width="30" height="5" fill="black" rx="2" /> 
      </svg>
    )
  },
  { 
    id: 'panda', name: 'Panda', color: '#1f2937', 
    render: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <circle cx="30" cy="30" r="12" fill="black" /> 
        <circle cx="70" cy="30" r="12" fill="black" /> 
        <circle cx="50" cy="55" r="35" fill="white" />
        <circle cx="35" cy="50" r="8" fill="black" /> 
        <circle cx="65" cy="50" r="8" fill="black" /> 
        <circle cx="50" cy="65" r="4" fill="black" /> 
      </svg>
    )
  }
];

// --- UTILIDAD DE AUDIO Y HÁPTICA ---
const triggerFeedback = (type: string, audioEnabled = true) => {
  if (audioEnabled) {
    try {
      const Win = window as any;
      const AudioContext = Win.AudioContext || Win.webkitAudioContext;
      
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'win') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.linearRampToValueAtTime(800, now + 0.2);
          osc.frequency.linearRampToValueAtTime(600, now + 0.4);
          osc.frequency.linearRampToValueAtTime(1200, now + 0.6);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.8);
          osc.start(now);
          osc.stop(now + 0.8);
        } else if (type === 'camera') {
          const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < noiseBuffer.length; i++) {
             output[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const noiseGain = ctx.createGain();
          noise.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          noiseGain.gain.setValueAtTime(0.5, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          noise.start(now);
        } else if (type === 'bad') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100, now);
          osc.frequency.linearRampToValueAtTime(50, now + 0.4);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (type === 'step') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(200, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'roll') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(100, now);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'alarm') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.linearRampToValueAtTime(400, now + 0.2);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
        }
      }
    } catch (e) {}
  }

  if (navigator.vibrate) {
    if (type === 'click') navigator.vibrate(10);
    else if (type === 'step') navigator.vibrate(5);
    else if (type === 'bad' || type === 'alarm') navigator.vibrate([100, 50, 100, 50, 100]);
    else if (type === 'win') navigator.vibrate([200, 100, 200, 100, 400]);
    else if (type === 'roll') navigator.vibrate([10, 30, 10]);
    else if (type === 'camera') navigator.vibrate(50);
  }
};

const TIPOS_CASILLA: TileType[] = [
  { color: '#ef4444', type: 'PELIGRO', icon: Skull, label: 'Castigo Físico' }, 
  { color: '#3b82f6', type: 'TRIVIA', icon: HelpCircle, label: 'Cultura General' }, 
  { color: '#eab308', type: 'CHAMUYO', icon: Zap, label: 'Reto Social' }, 
  { color: '#22c55e', type: 'SUERTE', icon: PartyPopper, label: 'Bonus/Malus' }, 
  { color: '#a855f7', type: 'VS', icon: Swords, label: 'Duelo Grupal' }, 
];

const EVENTOS_DB: Record<string, GameEventData[]> = {
  PELIGRO: [
    { text: "¡TERREMOTO! Todos cambian de asiento hacia la izquierda.", penalty: 0 },
    { text: "Haz 10 flexiones o retrocede 3 casillas.", penalty: -3, actionText: "Si fallas: -3" },
    { text: "Mantén una sentadilla isométrica hasta tu próximo turno.", penalty: -2, actionText: "Si caes: -2" },
    { text: "El suelo es lava: Súbete a una silla YA.", penalty: -5, actionText: "El último: -5" },
    { text: "Haz el puente (yoga) por 10 segundos.", penalty: -2, actionText: "Falla y retrocede 2" },
    { text: "Camina como cangrejo alrededor de la mesa.", penalty: 0 },
    { text: "Debes jugar con los ojos cerrados hasta tu próximo turno.", penalty: 0 }
  ],
  TRIVIA: [
    { text: "¿Cuál es la capital de Australia?", answer: "Canberra", bonus: 1, actionText: "Acierta y avanza 1" },
    { text: "¿En qué año llegó el hombre a la luna?", answer: "1969", penalty: -2, actionText: "Falla y retrocede 2" },
    { text: "¿Quién canta 'Thriller'?", answer: "Michael Jackson", bonus: 2, actionText: "Bonus +2 cantando" },
    { text: "¿Cuántos corazones tiene un pulpo?", answer: "Tres", bonus: 2, actionText: "Acierta y avanza 2" },
    { text: "¿Qué ingrediente NO lleva la pizza Hawaiana?", answer: "El buen gusto (es broma, Piña)", penalty: 0 },
    { text: "Completa: 'Camarón que se duerme...'", answer: "...se lo lleva la corriente", bonus: 1, actionText: "Avanza 1" }
  ],
  CHAMUYO: [
    { text: "Envía un audio cantando a tu ex (o a tu madre).", penalty: -5, actionText: "Hazlo o -5 casillas" },
    { text: "Deja que el grupo lea tu último WhatsApp.", penalty: -3, actionText: "Hazlo o -3 casillas" },
    { text: "Imita a otro jugador. Si adivinan quién es, avanzas.", bonus: 2, actionText: "Avanza 2 si adivinan" },
    { text: "Llama a una pizzería y pide una hamburguesa.", penalty: -4, actionText: "Hazlo o -4 casillas" },
    { text: "Debes hablar con acento extranjero hasta tu próximo turno.", penalty: 0 },
    { text: "Elige a alguien para que te haga cosquillas por 10 seg.", penalty: -2, actionText: "Aguanta o -2" }
  ],
  SUERTE: [
    { text: "¡Un taxi te lleva! Avanza rápido.", bonus: 3, actionText: "¡Avanzas 3!" },
    { text: "Olvidaste la billetera. Vuelve a buscarla.", penalty: -2, actionText: "Retrocedes 2" },
    { text: "Te encontraste dinero.", bonus: 1, actionText: "Avanzas 1 casilla" },
    { text: "Atajo secreto desbloqueado.", bonus: 5, actionText: "¡MEGA SALTO +5!" },
    { text: "Pinchaste rueda. Pierdes un turno.", penalty: 0, actionText: "Pasa el dado" }, 
    { text: "Intercambia lugar con el jugador que va último.", penalty: 0, actionText: "¡Cambio de lugares!" }
  ],
  VS: [
    { text: "Piedra, Papel o Tijera con el de tu derecha.", penalty: -2, actionText: "El perdedor retrocede 2" },
    { text: "Duelo de miradas con el de la izquierda.", penalty: 0, actionText: "El que parpadea pierde" },
    { text: "Pulseada china (pulgares) con quien elijas.", bonus: 2, actionText: "Ganador avanza 2" },
    { text: "Todos votan: ¿Quién es el más chamuyero?", penalty: -3, actionText: "El elegido retrocede 3" }
  ]
};

// --- COMPONENTES UI ---

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

// --- CÁMARA DEL GANADOR ---
const WinnerCamera = ({ onCapture, audioEnabled }: { onCapture: (data: string) => void, audioEnabled: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                setError("No se pudo acceder a la cámara.");
            }
        };
        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
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
            
            const dataUrl = canvasRef.current.toDataURL('image/png');
            triggerFeedback('camera', audioEnabled);
            onCapture(dataUrl);
        }
    };

    if (error) return <div className="text-red-400 p-4">{error}</div>;

    return (
        <div className="relative w-full max-w-xs mx-auto rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl mb-4 bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button 
                    onClick={takePhoto}
                    className="bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    <Camera size={32} />
                </button>
            </div>
            {/* Overlay de Corona */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <Crown size={80} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-bounce" />
            </div>
        </div>
    );
};

interface Dice3DProps {
    rolling: boolean;
    value: number;
    onRoll: () => void;
    audioEnabled: boolean;
}

const Dice3D = ({ rolling, value, onRoll }: Dice3DProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faces: any = {
    1: 'rotateX(0deg) rotateY(0deg)',
    2: 'rotateX(-90deg) rotateY(0deg)',
    3: 'rotateX(0deg) rotateY(-90deg)',
    4: 'rotateX(0deg) rotateY(90deg)',
    5: 'rotateX(90deg) rotateY(0deg)',
    6: 'rotateX(180deg) rotateY(0deg)',
  };

  const currentRotation = rolling 
    ? `rotateX(${Math.random() * 1080 + 720}deg) rotateY(${Math.random() * 1080 + 720}deg)`
    : faces[value] || faces[1];

  return (
    <div className="relative w-28 h-28 perspective-1000 group cursor-pointer" onClick={onRoll}>
        <div 
            className="w-full h-full relative transform-style-3d transition-transform duration-[800ms] ease-out"
            style={{ transform: currentRotation }}
        >
            {[
              { id: 1, rot: 'translateZ(56px)', dots: [4] },
              { id: 6, rot: 'rotateY(180deg) translateZ(56px)', dots: [0,2,3,5,6,8] },
              { id: 2, rot: 'rotateX(90deg) translateZ(56px)', dots: [0,8] },
              { id: 5, rot: 'rotateX(-90deg) translateZ(56px)', dots: [0,2,4,6,8] },
              { id: 3, rot: 'rotateY(-90deg) translateZ(56px)', dots: [0,4,8] },
              { id: 4, rot: 'rotateY(90deg) translateZ(56px)', dots: [0,2,6,8] }
            ].map(face => (
               <div key={face.id} 
                    className="absolute w-28 h-28 bg-white border-2 border-slate-300 rounded-2xl grid grid-cols-3 grid-rows-3 p-3 gap-1 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] backface-hidden"
                    style={{ transform: face.rot }}
               >
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`rounded-full transition-all ${face.dots.includes(i) ? 'bg-black shadow-inner scale-100' : 'bg-transparent scale-0'}`} />
                  ))}
               </div>
            ))}
        </div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/40 blur-lg rounded-full transition-all duration-300" 
             style={{ transform: rolling ? 'translateX(-50%) scale(0.6)' : 'translateX(-50%) scale(1)', opacity: rolling ? 0.4 : 0.6 }} 
        />
    </div>
  );
};

const Casilla = ({ x, y, index, typeData, isTarget }: { x: number; y: number; index: number; typeData: TileType; isTarget: boolean }) => {
  const Icon = typeData.icon;
  return (
    <div
      className="flex items-center justify-center transition-all duration-500"
      style={{
        position: 'absolute',
        left: `50%`,
        top: `50%`,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isTarget ? 1.4 : 1})`,
        width: '45px',
        height: '45px',
        backgroundColor: typeData.color,
        borderRadius: isTarget ? '50%' : '14px',
        boxShadow: isTarget 
            ? `0 0 35px ${typeData.color}, inset 0 0 10px rgba(0,0,0,0.5)` 
            : '0 8px 10px rgba(0,0,0,0.3)',
        zIndex: isTarget ? 30 : 10,
        border: isTarget ? '4px solid white' : '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <Icon size={24} className="text-black/20 absolute" />
      <span className="relative text-white font-bold text-lg drop-shadow-md z-10">{index + 1}</span>
    </div>
  );
};

interface FichaProps {
    x: number;
    y: number;
    color: string;
    isActive: boolean;
    character: Character;
}

const Ficha = ({ x, y, color, isActive, character }: FichaProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `50%`,
        top: `50%`,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y - 45}px))`, // Ajuste de altura
        width: '48px',
        height: '48px',
        backgroundColor: color,
        borderRadius: '50%',
        border: '3px solid white',
        boxShadow: isActive ? `0 0 30px ${color}, 0 10px 20px rgba(0,0,0,0.5)` : '0 4px 6px rgba(0,0,0,0.5)',
        zIndex: isActive ? 50 : 40,
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <div className="w-8 h-8">
        {character.render()}
      </div>
      {isActive && (
        <div className="absolute -top-6 animate-bounce">
           <Crown size={20} className="text-yellow-400 fill-yellow-400 drop-shadow-lg" />
        </div>
      )}
    </div>
  );
};

interface EventModalProps {
    event: GameEventData;
    typeData: TileType;
    onApply: (applyConsequence: boolean) => void;
    audioEnabled: boolean;
}

const EventModal = ({ event, typeData, onApply, audioEnabled }: EventModalProps) => {
  if (!event) return null;
  const Icon = typeData.icon;

  useEffect(() => {
    if (typeData.type === 'PELIGRO') triggerFeedback('bad', audioEnabled);
    else triggerFeedback('click', audioEnabled);

    if (audioEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${typeData.type}`);
      utterance.lang = 'es-ES';
      utterance.rate = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  }, [typeData, audioEnabled]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-sm bg-slate-900 rounded-3xl border-4 p-6 text-center shadow-2xl overflow-hidden"
        style={{ borderColor: typeData.color }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]" />

        <div 
          className="mx-auto w-24 h-24 rounded-full flex items-center justify-center border-4 border-slate-900 mb-4 shadow-lg transform hover:scale-110 transition-transform"
          style={{ backgroundColor: typeData.color }}
        >
          <Icon size={48} className="text-white animate-pulse" />
        </div>

        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-1 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
          {typeData.type}
        </h3>
        <p className="text-slate-400 text-xs font-bold mb-4 uppercase tracking-[0.2em]">{typeData.label}</p>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 mb-6 shadow-inner relative z-10 min-h-[100px] flex flex-col justify-center">
          <p className="text-white text-xl font-medium leading-relaxed">
            {event.text}
          </p>
          
          {event.actionText && (
            <div className="mt-4 inline-block bg-black/40 px-3 py-1 rounded-lg text-yellow-400 text-xs font-bold uppercase border border-yellow-400/20 mx-auto">
              <AlertTriangle size={12} className="inline mr-1 mb-0.5" />
              {event.actionText}
            </div>
          )}

          {event.answer && (
            <div className="mt-4 pt-4 border-t border-white/10">
               <details className="cursor-pointer group select-none">
                  <summary className="text-slate-500 text-sm italic list-none hover:text-white transition-colors">
                    ( Toca para ver respuesta )
                  </summary>
                  <p className="mt-2 text-green-400 font-bold text-lg animate-in slide-in-from-top-2">
                    {event.answer}
                  </p>
               </details>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
            {(event.penalty || event.bonus) ? (
                <>
                    <button 
                        onClick={() => { triggerFeedback('click', audioEnabled); onApply(false); }} 
                        className="py-4 rounded-xl bg-slate-700 text-slate-300 font-bold hover:bg-slate-600 transition-colors active:scale-95"
                    >
                        {event.penalty ? 'Cumplido' : 'Saltar'}
                    </button>
                    <button 
                        onClick={() => { triggerFeedback(event.bonus ? 'win' : 'bad', audioEnabled); onApply(true); }}
                        className="py-4 rounded-xl font-black text-xl hover:scale-105 active:scale-95 transition-transform text-white shadow-lg"
                        style={{ backgroundColor: event.bonus ? '#22c55e' : '#ef4444' }}
                    >
                        {event.bonus ? '¡SÍ!' : 'FALLÉ'}
                    </button>
                </>
            ) : (
                <button 
                    onClick={() => { triggerFeedback('click', audioEnabled); onApply(false); }}
                    className="col-span-2 py-4 rounded-xl bg-white text-slate-900 font-black text-xl hover:scale-105 active:scale-95 transition-transform shadow-lg"
                >
                    CONTINUAR
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState('setup'); 
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
  
  // --- CONFIGURACIÓN DE MODOS (25/50) ---
  const [totalTiles, setTotalTiles] = useState(50); // Default: NORMAL

  // --- PERSISTENCIA DE DATOS (Auto-Save) ---
  useEffect(() => {
    const savedState = localStorage.getItem('que-descontrol-state');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            setPlayers(parsed.players || []);
            setTurnIndex(parsed.turnIndex || 0);
            setGameState(parsed.gameState || 'setup');
            setTotalTiles(parsed.totalTiles || 50);
            setLastLog(parsed.lastLog || "");
        } catch(e) { console.error("Error loading state", e); }
    }
  }, []);

  useEffect(() => {
    if (players.length > 0) {
        const stateToSave = { players, turnIndex, gameState, totalTiles, lastLog };
        localStorage.setItem('que-descontrol-state', JSON.stringify(stateToSave));
    }
  }, [players, turnIndex, gameState, totalTiles, lastLog]);


  // --- GENERACIÓN DEL TABLERO ---
  const tilesData = useMemo(() => {
    const tiles: TileData[] = [];
    let angle = 0;
    
    let maxRadius = 160; 
    let minRadius = 20;
    
    if (totalTiles <= 25) maxRadius = 120;

    const angleIncrement = 0.45;

    for (let i = 0; i < totalTiles; i++) {
      const t = i / (totalTiles - 1);
      const currentRadius = maxRadius - (maxRadius - minRadius) * t;

      const x = Math.cos(angle) * currentRadius;
      const y = Math.sin(angle) * currentRadius;
      
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

  // --- LÓGICA DEL JUEGO ---
  const addPlayer = () => {
    if (newPlayerName.trim() === '' || !selectedCharId) return;
    
    const character = CHARACTERS.find(c => c.id === selectedCharId);
    if (!character) return;

    setPlayers([
        ...players, 
        { 
            id: Date.now(), 
            name: newPlayerName, 
            positionIndex: 0, 
            character: character // Asignamos el personaje completo
        }
    ]);
    setNewPlayerName('');
    setSelectedCharId(null);
    triggerFeedback('click', audioEnabled);
  };

  const startGame = () => { if (players.length > 0) setGameState('playing'); triggerFeedback('win', audioEnabled); };

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
        setGameState('win');
        triggerFeedback('win', audioEnabled);
        return;
    }
    updatePlayerPosition(newPos);
    setTimeout(() => { triggerEvent(newPos); }, 1500); 
  };

  const updatePlayerPosition = (newPos: number) => {
    const newPlayers = [...players];
    const oldPos = newPlayers[turnIndex].positionIndex;
    newPlayers[turnIndex].positionIndex = newPos;
    setPlayers(newPlayers);
    triggerFeedback('step', audioEnabled);
    
    const diff = newPos - oldPos;
    if(diff !== 0) setLastLog(`${newPlayers[turnIndex].name} se movió ${diff > 0 ? '+' : ''}${diff}`);
  };

  const triggerEvent = (posIndex: number) => {
      const tile = tilesData[posIndex];
      const type = tile.typeData.type;
      if (type === 'META') return;
      const availableEvents = EVENTOS_DB[type] || EVENTOS_DB['SUERTE'];
      const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      setCurrentEvent({ data: randomEvent, typeData: tile.typeData });
  };

  const handleEventDecision = (applyConsequence: boolean) => {
      if (!currentEvent) return;
      const { data } = currentEvent;
      let nextTurnDelay = 0;

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
          nextTurnDelay = 1000; 
      }

      setCurrentEvent(null);
      setTimeout(() => {
          setTurnIndex((prev) => (prev + 1) % players.length);
      }, nextTurnDelay);
  };

  const resetGame = () => {
      localStorage.removeItem('que-descontrol-state');
      setGameState('setup');
      setPlayers([]);
      setTurnIndex(0);
      setDiceValue(1);
      setCurrentEvent(null);
      setLastLog("");
      setWinnerPhoto(null);
  };

  const activePlayer = players[turnIndex];
  const boardTransform = useMemo(() => {
      if (!activePlayer) return { x: 0, y: 0 };
      const tile = tilesData[activePlayer.positionIndex];
      return { x: -tile.x, y: -tile.y };
  }, [activePlayer, tilesData]);

  const gameProgress = useMemo(() => {
      if (!players.length) return 0;
      const maxPos = Math.max(...players.map(p => p.positionIndex));
      return Math.min(maxPos / totalTiles, 1);
  }, [players, totalTiles]);

  const styles = `
    .transform-style-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }
    .translate-z-12 { transform: translateZ(56px); } 
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
  `;

  if (gameState === 'setup') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white font-sans p-6 overflow-hidden relative">
        <button onClick={() => setAudioEnabled(!audioEnabled)} className="absolute top-4 right-4 p-3 bg-slate-800 rounded-full hover:bg-slate-700 z-50 transition-colors">
            {audioEnabled ? <Volume2 size={24} className="text-green-400" /> : <VolumeX size={24} className="text-red-400" />}
        </button>

        <h1 className="text-6xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 uppercase text-center tracking-tighter drop-shadow-sm animate-in slide-in-from-top duration-700">
            Que DESCONTROL
        </h1>
        <p className="text-slate-400 mb-8 text-xl font-medium tracking-widest uppercase">Edición Fiesta</p>
        
        <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/5 z-10 overflow-y-auto max-h-[80vh] custom-scrollbar">
          
          <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6 border border-white/5 shrink-0">
            <button 
                onClick={() => setTotalTiles(25)}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${totalTiles === 25 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                RÁPIDO (25)
            </button>
            <button 
                onClick={() => setTotalTiles(50)}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${totalTiles === 50 ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                NORMAL (50)
            </button>
          </div>

          <div className="mb-6 space-y-4">
            <input 
              type="text" 
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Escribe tu nombre..."
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-lg focus:outline-none focus:border-yellow-500 transition-colors"
            />
            
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">Elige tu Personaje</p>
            
            <div className="grid grid-cols-5 gap-2">
              {CHARACTERS.map((char) => {
                const isTaken = players.some(p => p.character.id === char.id);
                const isSelected = selectedCharId === char.id;
                
                return (
                  <button 
                    key={char.id}
                    disabled={isTaken}
                    onClick={() => setSelectedCharId(char.id)}
                    className={`
                      relative aspect-square rounded-xl p-1 flex items-center justify-center transition-all
                      ${isTaken ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
                      ${isSelected ? 'bg-yellow-500 scale-110 shadow-lg ring-2 ring-yellow-300' : 'bg-slate-700'}
                    `}
                  >
                    <div className="w-8 h-8 pointer-events-none">
                      {char.render()}
                    </div>
                  </button>
                );
              })}
            </div>

            <button 
                onClick={addPlayer} 
                disabled={!newPlayerName || !selectedCharId}
                className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${(!newPlayerName || !selectedCharId) ? 'bg-slate-700 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'}`}
            >
              <UserPlus size={24} /> Agregar Jugador
            </button>
          </div>

          <div className="space-y-3 mb-8">
            {players.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-slate-700/50 p-3 px-5 rounded-xl border-l-8 transition-all hover:translate-x-1" style={{ borderColor: p.character.color }}>
                <span className="font-bold text-lg text-white">{p.name}</span>
                <div className="w-8 h-8">{p.character.render()}</div>
              </div>
            ))}
            {players.length === 0 && <p className="text-center text-slate-500 py-4 italic text-sm">Ingresa nombre y personaje arriba</p>}
          </div>
          
          {localStorage.getItem('que-descontrol-state') && players.length === 0 && (
             <div className="mb-4 text-center">
                <button onClick={() => { localStorage.removeItem('que-descontrol-state'); window.location.reload(); }} className="text-red-400 text-xs flex items-center justify-center gap-1 mx-auto hover:text-red-300">
                    <Trash2 size={12} /> Borrar partida anterior guardada
                </button>
             </div>
          )}

          <button 
            onClick={startGame} 
            disabled={players.length === 0}
            className={`w-full py-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 transition-all ${players.length > 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 hover:scale-[1.02] hover:shadow-orange-500/50' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
          >
            <Play fill="currentColor" size={24} /> ¡A JUGAR!
          </button>
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950" />
      </div>
    );
  }

  const backgroundGradient = `radial-gradient(circle at center, 
    rgba(${15 + gameProgress * 60}, ${23 - gameProgress * 20}, ${42 - gameProgress * 40}, 1) 0%, 
    rgba(${15 + gameProgress * 20}, ${23 - gameProgress * 10}, ${42 - gameProgress * 30}, 1) 100%)`;

  return (
    <div 
        className={`relative w-full h-screen overflow-hidden font-sans select-none text-white transition-colors duration-200 ${screenFlash || ''}`}
        style={{ background: backgroundGradient }}
    >
        <style>{styles}</style>
        
        {gameState === 'win' && <Confetti />}

        {currentEvent && (
            <EventModal 
                event={currentEvent.data} 
                typeData={currentEvent.typeData} 
                onApply={handleEventDecision}
                audioEnabled={audioEnabled}
            />
        )}

        <div className="absolute top-0 left-0 w-full p-4 z-40 flex justify-between items-start pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-xl flex items-center gap-3 animate-in slide-in-from-top-10">
                <div className="w-12 h-12 animate-bounce">{players[turnIndex]?.character.render()}</div>
                <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Turno actual</p>
                    {players[turnIndex] && (
                        <h2 className="text-2xl font-black leading-none" style={{ color: players[turnIndex].character.color }}>
                            {players[turnIndex].name}
                        </h2>
                    )}
                </div>
            </div>
            
            <button onClick={() => setAudioEnabled(!audioEnabled)} className="pointer-events-auto p-3 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 border border-white/10 transition-transform active:scale-90">
                {audioEnabled ? <Volume2 size={24} className="text-green-400" /> : <VolumeX size={24} className="text-red-400" />}
            </button>
        </div>

        <div 
            className="absolute left-1/2 top-1/2 w-0 h-0 transition-transform duration-1000 cubic-bezier(0.25, 1, 0.5, 1)"
            style={{ 
                transform: `translate(${boardTransform.x}px, ${boardTransform.y}px) scale(1)` 
            }}
        >
            <svg className="absolute overflow-visible opacity-40" style={{ left: 0, top: 0, zIndex: 0 }}>
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <path 
                    d={`M ${tilesData.map(t => `${t.x},${t.y}`).join(' L ')}`}
                    fill="none"
                    stroke={gameProgress > 0.7 ? '#ef4444' : 'cyan'} 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="animate-pulse"
                />
            </svg>

            {tilesData.map((tile, i) => (
                <Casilla 
                    key={i} 
                    {...tile} 
                    index={i} 
                    isTarget={players[turnIndex]?.positionIndex === i}
                />
            ))}
            {players.map((p, i) => {
                const tile = tilesData[p.positionIndex];
                return (
                    <Ficha 
                        key={p.id} 
                        x={tile.x} 
                        y={tile.y} 
                        color={p.character.color} 
                        isActive={i === turnIndex}
                        character={p.character}
                    />
                );
            })}
        </div>

        <div className="absolute bottom-8 left-0 w-full flex flex-col items-center justify-center z-40 pointer-events-none">
            {gameState === 'win' && players[turnIndex] && (
                <div className="mb-6 bg-yellow-400 text-black p-6 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-20 pointer-events-auto text-center border-4 border-black max-w-xs mx-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    
                    {!winnerPhoto ? (
                        <div className="mb-4">
                            <WinnerCamera onCapture={setWinnerPhoto} audioEnabled={audioEnabled} />
                            <p className="text-xs font-bold uppercase tracking-widest">¡Foto del Campeón!</p>
                        </div>
                    ) : (
                        <div className="relative mb-4">
                            <img src={winnerPhoto} alt="Winner" className="w-full h-64 object-cover rounded-2xl border-4 border-black rotate-2" />
                            <Crown size={64} className="absolute -top-8 -right-8 text-yellow-400 fill-yellow-400 drop-shadow-lg animate-bounce" />
                        </div>
                    )}

                    <h2 className="text-4xl font-black mb-1 uppercase tracking-tighter">¡Campeón!</h2>
                    <p className="text-lg mb-4 font-bold leading-tight">{players[turnIndex].name}</p>
                    <button onClick={resetGame} className="w-full bg-black text-white px-6 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg">
                        <RotateCcw size={20} /> OTRA VEZ
                    </button>
                </div>
            )}

            {gameState === 'playing' && !currentEvent && (
               <div className="pointer-events-auto mb-4 animate-in slide-in-from-bottom-10 duration-500 relative">
                 <Dice3D rolling={isRolling} value={diceValue} onRoll={rollDice} audioEnabled={audioEnabled} />
                 
                 {!isRolling && (
                    <>
                        <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mt-4 opacity-50 animate-pulse">Toca el dado</p>
                        {lastLog && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/50 px-3 py-1 rounded-full text-xs text-white/80 border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
                                <History size={10} className="inline mr-1" />
                                {lastLog}
                            </div>
                        )}
                    </>
                 )}
               </div>
            )}
        </div>
        
        <div className={`absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_0%,_rgba(0,0,0,${0.5 + gameProgress * 0.4})_100%)] z-30`} />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] -z-50" />
    </div>
  );
}