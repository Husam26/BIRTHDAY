import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * 🌠 THE FINAL RITUAL: CELESTIAL UNION
 */
export default function FinalSection({ onRestart }) {
  const [isIgnited, setIsIgnited] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Track the star's position for "Gravity" effects
  const starY = useMotionValue(0);
  const bgOpacity = useTransform(starY, [0, -300], [0.1, 0.5]);
  const starScale = useTransform(starY, [0, -300], [1, 2.5]);

  const handleIgnition = () => {
    setIsIgnited(true);

    // 🎇 THE SUPERNOVA CONFETTI
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#D4AF37', '#ffffff'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#D4AF37', '#ffffff'] });
    }, 250);

    if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none">

      {/* 1. DYNAMIC NEBULA BACKGROUND */}
      <motion.div
        style={{ opacity: isIgnited ? 0.6 : bgOpacity }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,#590d22_0%,transparent_70%)] pointer-events-none"
      />

      <AnimatePresence>
        {!isIgnited ? (
          <div className="relative flex flex-col items-center justify-center w-full h-screen">

            {/* THE LUNAR CRADLE (The Target) */}
            <motion.div
              animate={{
                scale: isDragging ? 1.1 : 1,
                borderColor: isDragging ? "rgba(212,175,55,0.6)" : "rgba(212,175,55,0.2)"
              }}
              className="absolute top-1/3 w-32 h-32 md:w-48 md:h-48 border-2 border-dashed rounded-full flex items-center justify-center"
            >
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="font-mono text-[8px] tracking-[0.5em] text-[#D4AF37] text-center px-4"
              >
                PLACE THE STAR HERE
              </motion.div>
            </motion.div>

            {/* THE DRAGGABLE STAR */}
            <div className="absolute bottom-20 flex flex-col items-center gap-6">
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, info) => {
                  setIsDragging(false);
                  // If dragged high enough, ignite
                  if (info.point.y < window.innerHeight / 2) {
                    handleIgnition();
                  }
                }}
                style={{ y: starY, scale: starScale }}
                className="cursor-grab active:cursor-grabbing z-50"
              >
                <div className="relative">
                  {/* The Star Body */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-10 h-10 bg-white rounded-full shadow-[0_0_40px_#D4AF37]"
                  />
                  {/* Aura */}
                  <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-xl opacity-50" />
                </div>
              </motion.div>

              <motion.p
                animate={{ opacity: isDragging ? 0 : 0.4 }}
                className="font-serif italic text-white/60 text-sm"
              >
                "Bring the star to the sky"
              </motion.p>
            </div>
          </div>
        ) : (
          /* 2. THE CELEBRATION REVEAL */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 text-center px-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-6xl md:text-9xl font-serif text-[#D4AF37] italic">Always.</h2>
            </motion.div>

            <div className="space-y-6 max-w-2xl mx-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-white text-xl md:text-3xl font-serif italic"
              >
                "In every version of reality, <br />
                in every corner of the universe... <br />
                it was always you."
              </motion.p>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 2, duration: 1.5 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"
              />

              <motion.h1
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 2.5, duration: 2 }}
                className="text-3xl md:text-5xl font-serif text-white tracking-widest uppercase"
              >
                Happy Birthday, <br />
                <span className="text-[#D4AF37]">My Eternal Soul.</span>
              </motion.h1>
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-20 font-mono text-[9px] tracking-[0.6em] text-white/30 uppercase border-b border-white/10 pb-2 hover:text-[#D4AF37] transition-colors"
            >
              Rewatch Our Story
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. PERSISTENT FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -window.innerHeight],
              opacity: [0, 0.8, 0],
              scale: [0, Math.random() * 1, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%'
            }}
          />
        ))}
      </div>

      {/* NOISE GRAIN */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}