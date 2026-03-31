import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { vaultPassword, loveLetter } from '../data';

// --- 1. ADVANCED UTILS: MOUSE PERSPECTIVE ---
const useMousePerspective = (active) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  useEffect(() => {
    if (!active) return;
    const handleMouse = (e) => {
      x.set((e.clientX / window.innerWidth) - 0.5);
      y.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [active, x, y]);

  return { rotateX, rotateY };
};

// --- 2. ADVANCED UTILS: VARIABLE RHYTHM TYPEWRITER ---
const useTypewriter = (text, active, speed = 30) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, speed + (Math.random() * 35));
      return () => clearTimeout(timeout);
    } else {
      setIsDone(true);
    }
  }, [currentIndex, active, speed, text]);

  return { displayedText, isDone };
};

// --- 3. COMPONENT: SHATTERING WAX SEAL ---
function PhysicalSeal({ isCracked, onClick }) {
  return (
    <motion.div
      className="relative z-50 cursor-none"
      whileHover={{ scale: 1.1, filter: "brightness(1.2) drop-shadow(0 0 20px rgba(212,175,55,0.4))" }}
      onClick={onClick}
    >
      <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-2xl">
        <defs>
          <radialGradient id="waxBase" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a31a12" />
            <stop offset="100%" stopColor="#4a0404" />
          </radialGradient>
          <filter id="roughEdge">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </defs>

        <AnimatePresence>
          {!isCracked ? (
            <motion.g key="whole-seal" exit={{ opacity: 0, scale: 1.2 }}>
              <circle cx="50" cy="50" r="45" fill="url(#waxBase)" filter="url(#roughEdge)" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
              <text x="50" y="58" textAnchor="middle" fill="rgba(212,175,55,0.7)" fontSize="28" className="font-serif italic" style={{ userSelect: 'none' }}>V</text>
            </motion.g>
          ) : (
            <motion.g key="shattered-seal">
              <motion.path
                initial={{ x: 0, rotate: 0 }}
                animate={{ x: -40, y: 15, rotate: -35, opacity: 0 }}
                transition={{ duration: 0.9, ease: "circOut" }}
                d="M50 5 L10 30 L15 80 L50 95 Z" fill="url(#waxBase)"
              />
              <motion.path
                initial={{ x: 0, rotate: 0 }}
                animate={{ x: 40, y: -15, rotate: 30, opacity: 0 }}
                transition={{ duration: 0.9, ease: "circOut" }}
                d="M50 5 L90 30 L85 80 L50 95 Z" fill="url(#waxBase)"
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

// --- 4. COMPONENT: THE CIPHER LOCK GATE ---
function CipherGate({ onUnlock }) {
  const [val, setVal] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (val.toLowerCase() === vaultPassword) onUnlock();
    else {
      setIsError(true);
      setTimeout(() => setIsError(false), 600);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}} className="relative group text-center">
        <input
          autoFocus
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
          placeholder="IDENTITY"
          className="bg-transparent border-none text-center text-3xl md:text-5xl font-serif tracking-[0.5em] text-white/90 outline-none w-full max-w-lg placeholder:text-white/5 uppercase transition-all"
        />
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-champagne/40 to-transparent mt-8" />
        <p className="mt-8 font-mono text-[9px] tracking-[0.4em] text-white/20 uppercase">Awaiting Decryption Key</p>
      </motion.div>
    </div>
  );
}

// --- 5. COMPONENT: TYPEWRITTEN LETTER ---
function TypewrittenLetter({ text, onClose }) {
  const { displayedText, isDone } = useTypewriter(text, true);
  const scrollRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col h-[75vh]">
      {/* Stationery Header */}
      <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
        <div className="space-y-1 text-left">
          <p className="font-mono text-[10px] tracking-[0.3em] text-champagne/50 uppercase">Archive Record // 001</p>
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">Access: Decrypted</p>
        </div>
        <div className="text-right font-mono text-[10px] tracking-[0.2em] text-white/10 uppercase">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Scrolling Text Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-6 custom-scrollbar scroll-smooth">
        <div className="font-serif text-lg md:text-2xl leading-[2.1] text-white/80 whitespace-pre-wrap italic text-left pb-12">
          {displayedText}
          {!isDone && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "steps(2)" }}
              className="inline-block w-[10px] h-[1.3em] bg-champagne align-middle ml-2 shadow-[0_0_12px_rgba(212,175,55,0.6)]"
            />
          )}
        </div>

        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="mt-8 pt-12 border-t border-white/5 text-left pb-20"
          >
            <p className="font-serif italic text-champagne/40 text-xl">Forever,</p>
            <p className="font-serif text-3xl tracking-tighter text-white/30 mt-4">— The Silent One</p>

            {/* THE BACK BUTTON */}
            <motion.button
              whileHover={{ x: -10 }}
              onClick={onClose}
              className="mt-20 flex items-center space-x-4 group cursor-none"
            >
              <div className="w-12 h-[1px] bg-champagne/30 group-hover:w-16 transition-all duration-500" />
              <span className="font-mono text-[10px] tracking-[0.4em] text-champagne group-hover:text-white uppercase transition-colors">
                Return to Surface
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Decorative mechanical footer */}
      <div className="mt-8 flex items-center opacity-20 pointer-events-none">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-champagne/40 to-transparent" />
        <p className="font-mono text-[8px] tracking-[0.6em] uppercase mx-8">End of Message</p>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-champagne/40 to-transparent" />
      </div>
    </div>
  );
}

// --- 6. TRIGGER SECTION ---
export function VaultTrigger({ onOpen }) {
  const [phase, setPhase] = useState('idle');
  const { rotateX, rotateY } = useMousePerspective(phase === 'idle');

  const handleOpen = () => {
    setPhase('cracking');
    setTimeout(() => {
      onOpen();
      setTimeout(() => setPhase('idle'), 500);
    }, 900);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#050505] py-20 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,10,5,0.4)_0%,transparent_70%)] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} className="text-center z-10 mb-20 space-y-4">
        <span className="font-mono text-[11px] tracking-[0.6em] text-champagne/50 uppercase block">Archive Section 06</span>
        <h2 className="text-5xl md:text-8xl font-serif text-white/90 italic tracking-tight">The <span className="text-champagne">Vault.</span></h2>
      </motion.div>

      <div className="perspective-1000 relative z-20">
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative w-[320px] h-[200px] md:w-[500px] md:h-[300px]">
          <div className="absolute inset-0 bg-[#0f0f0f] border border-white/10 rounded-sm shadow-[0_60px_100px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')]" />
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 500 300">
              <path d="M0 0 L250 150 L500 0" fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
              <path d="M0 300 L250 150 L500 300" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
            </svg>
            <PhysicalSeal isCracked={phase === 'cracking'} onClick={handleOpen} />
          </div>
        </motion.div>
      </div>

      <motion.p
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="mt-16 font-mono text-[10px] tracking-[0.5em] text-champagne/60 uppercase cursor-default"
      >
        Shatter the seal to enter
      </motion.p>
    </section>
  );
}

// --- 7. THE FULLSCREEN MODAL ---
export function VaultModal({ open, onClose }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setUnlocked(false), 500);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(35,20,10,0.4)_0%,rgba(3,3,3,1)_100%)]" />

          {/* Persistent Close Button (Top Right) */}
          <button onClick={onClose} className="absolute top-12 right-12 z-[100] group">
            <span className="font-mono text-[10px] tracking-[0.5em] text-white/20 group-hover:text-champagne transition-colors uppercase cursor-none">
              [ Terminate Session ]
            </span>
          </button>

          <motion.div layoutId="vault-container" className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center p-8 md:p-20">
            <AnimatePresence mode="wait">
              {!unlocked ? (
                <motion.div key="lock" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.05, opacity: 0, filter: "blur(20px)" }}>
                  <CipherGate onUnlock={() => setUnlocked(true)} />
                </motion.div>
              ) : (
                <motion.div key="letter" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="w-full">
                  <TypewrittenLetter text={loveLetter} onClose={onClose} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="absolute inset-4 border border-white/5 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}