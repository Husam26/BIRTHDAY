import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// === CURSOR GLOW ===
export function CursorGlow() {
  const cursorRef = useRef(null);
  const [hearts, setHearts] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
      // Spawn heart trail occasionally
      if (Math.random() > 0.85) {
        const id = idRef.current++;
        setHearts(h => [...h, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => setHearts(h => h.filter(hh => hh.id !== id)), 1200);
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-glow" />
      {hearts.map(h => (
        <motion.div
          key={h.id}
          style={{ position: 'fixed', left: h.x, top: h.y, pointerEvents: 'none', zIndex: 9997, fontSize: '16px', transform: 'translate(-50%,-50%)' }}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -60, scale: 0.4 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          ❤️
        </motion.div>
      ))}
    </>
  );
}

// === FLOATING HEARTS BACKGROUND ===
export function FloatingHearts() {
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 12 + Math.random() * 20,
    emoji: ['❤️', '💕', '💗', '💖', '💓'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map(h => (
        <div
          key={h.id}
          className="float-heart absolute bottom-0 select-none"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: 0.4,
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
}

// === STAR PARTICLES ===
export function StarParticles() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationName: 'twinkle',
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        />
      ))}
    </div>
  );
}

// === MUSIC TOGGLE ===
export function MusicToggle({ playing, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-pink-300 border border-pink-500/30"
    >
      {playing ? (
        <>
          <span className="flex gap-0.5 items-end h-4">
            {[1, 2, 3, 4].map(i => (
              <span key={i} className="wave-bar" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
          <span>Music On</span>
        </>
      ) : (
        <>
          <span>🎵</span>
          <span>Music Off</span>
        </>
      )}
    </motion.button>
  );
}

// === SECTION WRAPPER with fade-in ===
export function Section({ children, className = '', id = '' }) {
  return (
    <section id={id} className={`relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}>
      {children}
    </section>
  );
}

// === SECTION HEADING ===
export function SectionHeading({ emoji, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mb-16"
    >
      <div className="text-5xl mb-4">{emoji}</div>
      <h2 className="text-4xl sm:text-5xl font-bold gradient-text font-['Playfair_Display',serif] mb-4">{title}</h2>
      <div className="divider mb-4" />
      {subtitle && <p className="text-gray-400 text-lg max-w-xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}
