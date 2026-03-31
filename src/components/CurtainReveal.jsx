import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * 🌌 GOD-TIER DETAIL: ACCORDION FOLD COMPONENT
 * Instead of one flat div, we use multiple "slats" to simulate real fabric bunching.
 */
const CurtainSide = ({ side, isOpen }) => {
  const folds = [0, 1, 2, 3, 4, 5, 6, 7]; // The "Pleats" of the velvet

  return (
    <motion.div
      className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-1/2 h-full flex z-20`}
      style={{ perspective: "1000px" }}
    >
      {folds.map((i) => (
        <motion.div
          key={i}
          initial={false}
          animate={isOpen ? {
            scaleX: 0.1,
            x: side === 'left' ? -100 * (folds.length - i) : 100 * (folds.length - i),
            opacity: 0.8,
            filter: "brightness(0.3) contrast(1.2)",
          } : {
            scaleX: 1,
            x: 0,
            opacity: 1,
            filter: "brightness(1) contrast(1)",
          }}
          transition={{
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.03 // Staggered bunching
          }}
          className="h-full w-full relative origin-top"
          style={{
            background: side === 'left'
              ? `linear-gradient(90deg, #1a0505 0%, #3d1010 50%, #1a0505 100%)`
              : `linear-gradient(-90deg, #1a0505 0%, #3d1010 50%, #1a0505 100%)`,
            borderRight: side === 'left' ? '1px solid rgba(0,0,0,0.3)' : 'none',
            borderLeft: side === 'right' ? '1px solid rgba(0,0,0,0.3)' : 'none',
          }}
        >
          {/* The "Sheen" on the edge of every fold */}
          <div className={`absolute inset-0 w-[1px] bg-white/10 ${side === 'left' ? 'right-0' : 'left-0'}`} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function SophisticatedCurtain({ onReveal }) {
  const [isOpening, setIsOpening] = useState(false);
  const dragY = useMotionValue(0);
  const springY = useSpring(dragY, { stiffness: 40, damping: 20 });

  // Transform drag for visual feedback on the rope
  const ropeStretch = useTransform(springY, [0, 200], [1, 1.2]);

  const handleDragEnd = (_, info) => {
    if (info.offset.y > 120) {
      setIsOpening(true);
      if (onReveal) setTimeout(onReveal, 2500);
    } else {
      dragY.set(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#020202] overflow-hidden">

      {/* 1. LIGHT LEAK (The "Holy" Glow behind the crack) */}
      <motion.div
        animate={isOpening ? { opacity: [0, 1], scale: [0.8, 1.2] } : { opacity: 0.4 }}
        transition={{ duration: 3 }}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="w-[2px] h-full bg-[#D4AF37] blur-[20px] opacity-50" />
        <div className="absolute w-[400px] h-[600px] bg-[#D4AF37]/10 blur-[120px] rounded-full" />
      </motion.div>

      {/* 2. DUST MOTES (Divine Detailing) */}
      <AnimatePresence>
        {isOpening && (
          <div className="absolute inset-0 z-15 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  y: -200,
                  x: Math.sin(i) * 50
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
                style={{
                  left: `${40 + Math.random() * 20}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 3. THE CURTAINS */}
      <CurtainSide side="left" isOpen={isOpening} />
      <CurtainSide side="right" isOpen={isOpening} />

      {/* 4. THE TASSEL & ROPE */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            exit={{ y: -500, opacity: 0, transition: { duration: 1.5, ease: "easeIn" } }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center"
          >
            {/* The Rope with physical stretch */}
            <motion.div
              style={{ height: 220, scaleY: ropeStretch, originY: 0 }}
              className="w-[3px] bg-gradient-to-b from-[#4a3b12] via-[#D4AF37] to-[#8a6d29] shadow-2xl relative"
            >
              {/* Rope Texture Wrap */}
              <div className="absolute inset-0 w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,black_3px)]" />
            </motion.div>

            {/* The Tassel (The 'A') */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 250 }}
              style={{ y: springY }}
              onDragEnd={handleDragEnd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-grab active:cursor-grabbing group"
            >
              {/* Tassel Glow */}
              <div className="absolute inset-0 bg-[#D4AF37] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity" />

              {/* The Golden Medallion */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#8a6d29] via-[#f0d060] to-[#D4AF37] shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-center border-2 border-[#f0d060]/50 relative z-10">
                <span className="text-[#1a0505] text-3xl font-serif font-bold italic drop-shadow-md">A</span>

                {/* Micro-shimmer on medallion */}
                <motion.div
                  animate={{ x: [-40, 80] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 w-4 h-full bg-white/20 skew-x-12 blur-sm"
                />
              </div>

              {/* Luxury Silk Fringes */}
              <div className="flex justify-center -mt-2">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + Math.random(),
                      delay: i * 0.05
                    }}
                    className="w-1 h-14 bg-gradient-to-b from-[#D4AF37] via-[#8a6d29] to-transparent mx-[0.5px] rounded-full origin-top opacity-80"
                  />
                ))}
              </div>
            </motion.div>

            {/* THE ROMANTIC PHRASE */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 text-center"
            >
              <p className="font-serif italic text-[#D4AF37] tracking-[0.3em] text-sm uppercase">
                Unveil the rhythm <br />
                <span className="text-[10px] opacity-60 tracking-[0.5em]">of my heart</span>
              </p>

              {/* Subtle down arrow */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-4 text-[#D4AF37]/40 font-light"
              >
                ↓
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. OVERLAY TEXTURE (The Grain of Film) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
}