import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';

/**
 * 🔥 PHYSICS-REACTIVE FLAME
 * The flame tilts and shrinks based on the 'strength' of the user's blow.
 */
const Flame = ({ progress, isBlown }) => {
  // As progress increases (0-100), tilt increases (0-45deg) and scaleY decreases
  const tilt = useTransform(progress, [0, 100], [0, 60]);
  const scaleY = useTransform(progress, [0, 80, 100], [1, 0.4, 0]);
  const opacity = useTransform(progress, [0, 90, 100], [1, 0.8, 0]);

  return (
    <AnimatePresence>
      {!isBlown && (
        <motion.div
          style={{ rotate: tilt, scaleY, opacity, originY: 1 }}
          className="relative flex items-center justify-center mb-1"
        >
          {/* Core Heat */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-4 h-10 bg-gradient-to-t from-orange-600 via-yellow-400 to-transparent rounded-full blur-[1px] z-20 shadow-[0_0_20px_rgba(251,146,60,0.5)]"
          />
          {/* Internal Wick Light */}
          <div className="absolute bottom-0 w-1.5 h-4 bg-white rounded-full blur-[1px] z-30 opacity-80" />
          {/* Volumetric Aura */}
          <div className="absolute w-12 h-20 bg-orange-500/10 rounded-full blur-2xl z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function CakeSection({ onMidnight }) {
  const [isHolding, setIsHolding] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // Motion value for smooth physics tracking
  const blowProgress = useMotionValue(0);
  const smoothProgress = useSpring(blowProgress, { stiffness: 100, damping: 20 });
  const [displayProgress, setDisplayProgress] = useState(0);

  const requestRef = useRef();

  // Logic to handle the "Blowing" physics
  const updatePhysics = useCallback(() => {
    const current = blowProgress.get();
    if (isHolding && current < 100) {
      blowProgress.set(Math.min(current + 1.2, 100));
    } else if (!isHolding && current < 100) {
      blowProgress.set(Math.max(current - 2.5, 0)); // Resets if you let go
    }
    setDisplayProgress(Math.round(blowProgress.get()));
    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [isHolding, blowProgress]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  }, [updatePhysics]);

  // Handle Extinguishing
  useEffect(() => {
    const unsubscribe = blowProgress.on("change", (latest) => {
      if (latest >= 100 && !isBlown) {
        setIsBlown(true);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 1000);
        onMidnight?.(); // Signal for global theme change
      }
    });
    return () => unsubscribe();
  }, [blowProgress, isBlown, onMidnight]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden px-6">

      {/* 1. THE "WISH" FLASH (Cinematic White-out) */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[100] mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* 2. Global Darkness Overlay */}
      <motion.div
        animate={{ opacity: isBlown ? 0.8 : 0 }}
        className="absolute inset-0 bg-black z-40 pointer-events-none"
      />

      {/* 3. Section Header */}
      <div className="text-center mb-20 z-10 relative">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="font-mono text-[9px] tracking-[0.5em] uppercase text-[#D4AF37]/40 mb-4"
        >
          Ceremony // The Wish
        </motion.p>
        <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tighter leading-tight">
          Close your eyes, <br />
          <span className="italic text-[#D4AF37] font-light">Make a Wish.</span>
        </h2>
      </div>

      {/* 4. THE INTERACTIVE CAKE */}
      <div className="relative flex flex-col items-center scale-110 md:scale-125">

        {/* Flame & Candle */}
        <div className="relative flex flex-col items-center z-30 mb-[-5px]">
          <Flame progress={smoothProgress} isBlown={isBlown} />

          {/* Wick Smoke (Visible after blown) */}
          <AnimatePresence>
            {isBlown && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.4, 0], y: -40, x: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-10 w-4 h-10 bg-white/10 blur-xl rounded-full"
              />
            )}
          </AnimatePresence>

          {/* Candle Body */}
          <div className={`w-2.5 h-20 rounded-full shadow-2xl transition-all duration-1000 ${isBlown ? 'bg-zinc-800' : 'bg-gradient-to-b from-[#D4AF37] via-[#8a6d29] to-[#2D0B0B]'}`} />
        </div>

        {/* Isometric 3D Cake */}
        <div className="relative perspective-1000">
          <motion.div style={{ rotateX: 10 }} className="flex flex-col items-center">
            {/* Top Tier */}
            <div className="w-32 h-14 bg-[#2D0B0B] border-x border-[#D4AF37]/20 rounded-t-xl relative">
              <div className="absolute top-0 w-full h-3 bg-white/5 rounded-t-xl border-b border-white/5" />
            </div>
            {/* Middle Tier */}
            <div className="w-48 h-18 bg-[#1a0505] border-x border-[#D4AF37]/10 -mt-1 relative">
              <div className="absolute top-0 w-full h-3 bg-white/5 border-b border-white/5" />
              <div className="absolute inset-0 flex items-center justify-center italic text-[#D4AF37]/10 font-serif text-[10px] tracking-widest">ETERNAL</div>
            </div>
            {/* Bottom Tier */}
            <div className="w-64 h-22 bg-[#0a0505] border-x border-[#D4AF37]/10 -mt-1 rounded-b-xl relative shadow-2xl">
              <div className="absolute top-0 w-full h-3 bg-white/5 border-b border-white/5" />
            </div>
          </motion.div>
          {/* Plate Shadow */}
          <div className="w-80 h-4 bg-black/60 blur-md rounded-full mt-[-10px]" />
        </div>

        {/* Progress Circular Aura */}
        {!isBlown && (
          <div className="absolute -bottom-16 flex flex-col items-center gap-2">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-zinc-900" />
                <motion.circle
                  cx="28" cy="28" r="24" stroke="#D4AF37" strokeWidth="1.5" fill="transparent"
                  strokeDasharray="150.8"
                  strokeDashoffset={150.8 - (150.8 * displayProgress) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-[#D4AF37] tabular-nums">{displayProgress}%</div>
            </div>
          </div>
        )}
      </div>

      {/* 5. INTERACTION BUTTON */}
      <div className="mt-40 z-50">
        <AnimatePresence mode="wait">
          {!isBlown ? (
            <motion.div className="flex flex-col items-center gap-4">
              <motion.button
                onPointerDown={() => setIsHolding(true)}
                onPointerUp={() => setIsHolding(false)}
                onPointerLeave={() => setIsHolding(false)}
                whileTap={{ scale: 0.96 }}
                className={`px-12 py-5 rounded-sm border transition-all duration-700 font-mono text-[10px] tracking-[0.4em] uppercase ${isHolding ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.4)]' : 'bg-transparent text-[#D4AF37] border-[#D4AF37]/30'}`}
              >
                {isHolding ? 'Release Breath...' : 'Hold to Wish'}
              </motion.button>

              {/* Wind Particle Stream (Visible while blowing) */}
              <AnimatePresence>
                {isHolding && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          x: [0, 400],
                          y: [0, (Math.random() - 0.5) * 100],
                          opacity: [0, 0.5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="absolute top-1/2 left-1/2 w-12 h-[1px] bg-gradient-to-r from-white/20 to-transparent"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="font-serif italic text-3xl text-white mb-4">
                "I hope I'm in every single one of your wishes."
              </p>
              <div className="h-[1px] w-16 bg-[#D4AF37] mx-auto mb-4 opacity-40" />
              <p className="font-mono text-[8px] tracking-[0.5em] text-[#D4AF37] uppercase">
                Happy Birthday, Soulmate.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Embers (Background Post-Blow) */}
      {isBlown && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: '100vh', x: `${Math.random() * 100}%` }}
              animate={{ opacity: [0, 1, 0], y: '-10vh' }}
              transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
              className="absolute w-[2px] h-[2px] bg-[#D4AF37] rounded-full"
            />
          ))}
        </div>
      )}

    </section>
  );
}