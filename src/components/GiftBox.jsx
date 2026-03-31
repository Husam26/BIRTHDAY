import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🌹 PREMIUM ORGANIC PETAL
 * Enhanced with 3D transforms, organic border-radius, and depth shading
 */
const RosePetal = ({ index, layer, total, bloom }) => {
  const angle = (index / total) * 360;
  // Fibonacci-inspired staggered growth
  const delay = 3 + (layer * 0.5) + (index * 0.1);

  // Different petal shapes per layer for realism
  const borderRadius = [
    "45% 55% 50% 50% / 80% 80% 20% 20%", // Core
    "50% 50% 50% 50% / 90% 90% 10% 10%", // Inner
    "40% 60% 50% 50% / 70% 70% 30% 30%", // Mid
    "30% 70% 70% 30% / 60% 60% 40% 40%"  // Outer
  ][layer];

  const size = [
    { w: 'w-6', h: 'h-10', z: 'z-[60]' },
    { w: 'w-10', h: 'h-16', z: 'z-[50]' },
    { w: 'w-16', h: 'h-24', z: 'z-[40]' },
    { w: 'w-24', h: 'h-32', z: 'z-[30]' },
  ][layer];

  return (
    <motion.div
      initial={{ scale: 0, rotateZ: angle, rotateX: 60, opacity: 0 }}
      animate={bloom ? {
        scale: [0, 1.1, 1],
        opacity: 1,
        rotateX: [60, layer * 18 + 10], // Petals lean out more as they get outer
        rotateZ: angle + (bloom ? 10 : 0),
      } : {}}
      transition={{
        delay,
        duration: 2.5,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={`absolute origin-bottom ${size.w} ${size.h} ${size.z}`}
      style={{ bottom: '50%', left: '50%', x: '-50%' }}
    >
      <div
        className="w-full h-full shadow-2xl"
        style={{
          background: `radial-gradient(circle at center, #ff0054 0%, #800f2f 60%, #4a0012 100%)`,
          borderRadius,
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4), 0 5px 15px rgba(0,0,0,0.3)',
          border: '0.5px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(1px)'
        }}
      />
    </motion.div>
  );
};

/**
 * 🌿 THE BIOLOGICAL STEM
 */
const RoseStem = ({ bloom }) => (
  <div className="relative flex flex-col items-center">
    <motion.div
      initial={{ height: 0 }}
      animate={bloom ? { height: 280 } : { height: 0 }}
      transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
      className="w-2 bg-gradient-to-b from-[#2d6a4f] via-[#1b4332] to-[#081c15] rounded-full relative"
    >
      {/* Thorns */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={bloom ? { opacity: 1 } : {}}
          transition={{ delay: 2 + i * 0.2 }}
          className={`absolute w-2 h-3 bg-[#1b4332] ${i % 2 === 0 ? '-left-1' : '-right-1'} top-${i * 20}`}
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: i % 2 === 0 ? 'rotate(-60deg)' : 'rotate(60deg)' }}
        />
      ))}
    </motion.div>

    {/* Sepals (The green base) */}
    <div className="absolute top-0 flex items-center justify-center">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: i * 72 }}
          animate={bloom ? { scale: 1, rotateX: 70 } : {}}
          transition={{ delay: 2.8, type: 'spring' }}
          className="absolute w-5 h-12 bg-[#2d6a4f] origin-bottom rounded-full blur-[0.5px]"
          style={{ transform: `rotate(${i * 72}deg)` }}
        />
      ))}
    </div>
  </div>
);

export default function LuxuryRoseGift({ onNext }) {
  const [status, setStatus] = useState('closed'); // closed, opening, revealed

  const handleOpen = () => {
    if (status !== 'closed') return;
    setStatus('opening');
    setTimeout(() => setStatus('revealed'), 7500);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050001] overflow-hidden">

      {/* AMBIENT LIGHTING */}
      <div className={`absolute inset-0 transition-opacity duration-[5000ms] ${status !== 'closed' ? 'opacity-40' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#590d22_0%,transparent_70%)]" />
      </div>

      {/* LUXURY DECONSTRUCTING BOX */}
      <div className="relative z-20 perspective-2000">
        <AnimatePresence>
          {status !== 'revealed' && (
            <motion.div
              className="relative w-64 h-64 cursor-pointer"
              onClick={handleOpen}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 1.5 } }}
            >
              {/* Box Lid - Lifts and Dissolves */}
              <motion.div
                animate={status === 'opening' ? {
                  y: -400,
                  rotateX: 45,
                  rotateY: 20,
                  opacity: 0,
                  scale: 1.1
                } : {}}
                transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 z-40 bg-[#4a0404] border-2 border-[#d4af37]/30 rounded-lg shadow-2xl flex items-center justify-center"
              >
                <div className="absolute inset-2 border border-[#d4af37]/20 rounded-md" />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="text-[#d4af37] font-serif tracking-[0.3em] uppercase text-xs"
                >
                  Unveil
                </motion.div>
              </motion.div>

              {/* Box Sides - Falling Away */}
              {['front', 'back', 'left', 'right'].map((side) => (
                <motion.div
                  key={side}
                  animate={status === 'opening' ? {
                    rotateX: side === 'front' ? 90 : side === 'back' ? -90 : 0,
                    rotateY: side === 'left' ? -90 : side === 'right' ? 90 : 0,
                    opacity: 0
                  } : {}}
                  transition={{ delay: 0.5, duration: 1.5 }}
                  className="absolute inset-0 bg-[#3a0303] border border-[#d4af37]/10 origin-bottom"
                />
              ))}

              {/* Box Interior / Cushion */}
              <motion.div
                animate={status === 'opening' ? { scale: 0, opacity: 0 } : {}}
                className="absolute inset-0 bg-[#2b0202] shadow-inner flex items-center justify-center"
              >
                <div className="w-full h-full bg-[radial-gradient(circle,#590d22,#2b0202)] opacity-50" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* THE ROSE ASSEMBLY */}
      {status !== 'closed' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex flex-col items-center pt-32">
            <RoseStem bloom={true} />

            <div className="absolute top-32 flex items-center justify-center">
              {/* Outer Layer */}
              {[...Array(8)].map((_, i) => <RosePetal key={`l3-${i}`} index={i} layer={3} total={8} bloom={true} />)}
              {/* Mid Layer */}
              {[...Array(7)].map((_, i) => <RosePetal key={`l2-${i}`} index={i} layer={2} total={7} bloom={true} />)}
              {/* Inner Layer */}
              {[...Array(5)].map((_, i) => <RosePetal key={`l1-${i}`} index={i} layer={1} total={5} bloom={true} />)}
              {/* Core Layer */}
              {[...Array(4)].map((_, i) => <RosePetal key={`l0-${i}`} index={i} layer={0} total={4} bloom={true} />)}

              {/* The Heart of the Rose - Glowing Glimmer */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                transition={{ delay: 6, duration: 2 }}
                className="absolute w-6 h-6 bg-[#ff4d6d] rounded-full blur-xl shadow-[0_0_40px_#ff4d6d]"
              />
            </div>
          </div>
        </div>
      )}

      {/* FLOATING GOLD DUST PARTICLES */}
      {status !== 'closed' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: [0, 0.7, 0],
                y: -500,
                x: (Math.random() - 0.5) * 600,
                scale: [0, Math.random() * 1 + 0.5, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-1 h-1 bg-[#d4af37] rounded-full blur-[0.5px]"
              style={{ left: `${Math.random() * 100}%`, bottom: '10%' }}
            />
          ))}
        </div>
      )}

      {/* FINAL MESSAGE */}
      <AnimatePresence>
        {status === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.5em', filter: 'blur(10px)' }}
            animate={{ opacity: 1, letterSpacing: '0.1em', filter: 'blur(0px)' }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute bottom-20 text-center z-50 px-10"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-[#f8edeb] mb-4 italic font-light">
              Eternal Bloom
            </h2>
            <p className="text-[#d4af37]/70 font-serif italic text-lg max-w-md mx-auto mb-10 leading-relaxed tracking-wide">
              "Like this rose, my love for you grows in layers, finding light in every corner of my soul."
            </p>

            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02, color: '#fff' }}
              className="px-10 py-4 border border-[#d4af37]/30 text-[#d4af37] rounded-full text-xs uppercase tracking-[0.3em] backdrop-blur-sm transition-colors overflow-hidden relative group"
            >
              <span className="relative z-10">Continue the Journey</span>
              <motion.div
                className="absolute inset-0 bg-[#d4af37]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOISE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}