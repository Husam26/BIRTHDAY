import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { photos } from '../data';

/* ═══════════════════════════════════════════════════════════════
   ✦ LOVE LETTERS & POLAROIDS ✦
   
   Design concept — "Found memories":
   Each photo is a vintage Polaroid pinned to a dark velvet wall.
   Tap a Polaroid to flip it — the back reveals a handwritten
   love note. Swipe left/right to drift between memories.
   
   Mobile-first · No horizontal scrollbar · Touch-driven
═══════════════════════════════════════════════════════════════ */

/* ─── Polaroid Card (flippable) ─── */
function PolaroidCard({ photo, index, isActive, onActivate }) {
  const [flipped, setFlipped] = useState(false);

  // Random tilts for organic "pinned to wall" look
  const tilt = useRef((index % 2 === 0 ? 1 : -1) * (2 + Math.random() * 4)).current;
  const pinOffset = useRef(-2 + Math.random() * 4).current;

  const handleTap = () => {
    if (!isActive) {
      onActivate(index);
      return;
    }
    setFlipped(!flipped);
  };

  // Reset flip when navigating away
  useEffect(() => {
    if (!isActive) setFlipped(false);
  }, [isActive]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.85, rotate: tilt }}
      animate={{
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.7,
        rotate: isActive ? 0 : tilt,
        x: isActive ? 0 : (index % 2 === 0 ? -30 : 30),
        zIndex: isActive ? 50 : 10,
      }}
      exit={{ opacity: 0, scale: 0.6, y: 60 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        onClick={handleTap}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{ transformStyle: 'preserve-3d', cursor: 'none' }}
        className="relative w-[75vw] max-w-[320px] aspect-[3/4]"
      >
        {/* ── FRONT: The Polaroid ── */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* White Polaroid frame */}
          <div className="absolute inset-0 bg-[#f5f0e8] rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)]">
            {/* Photo area */}
            <div className="absolute top-3 left-3 right-3 bottom-[72px] overflow-hidden bg-black">
              <motion.img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover"
                style={{
                  filter: 'saturate(0.85) contrast(1.08) brightness(0.95)',
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8 }}
                draggable={false}
              />

              {/* Vignette over photo */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />

              {/* Film grain overlay on photo */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  backgroundSize: '120px',
                }}
              />

              {/* Subtle light leak */}
              <motion.div
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.7 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, transparent 50%)',
                }}
              />

              {/* Frame number stamp */}
              <div className="absolute top-2 right-2 font-mono text-[8px] text-[#D4AF37]/60 tracking-[0.3em]">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>

            {/* Caption area (bottom white strip) */}
            <div className="absolute bottom-0 left-0 right-0 h-[72px] flex flex-col items-center justify-center px-4">
              <p className="font-serif italic text-[#2a2018] text-[11px] leading-snug text-center opacity-70 max-w-[240px]">
                {photo.year}
              </p>
              {/* Tap hint */}
              <p className="font-mono text-[7px] tracking-[0.4em] text-[#8a7a60] uppercase mt-1.5">
                tap to read
              </p>
            </div>

            {/* Pin / tape at top */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10"
              style={{ marginLeft: pinOffset }}>
              <div className="w-5 h-6 rounded-b-sm opacity-80"
                style={{
                  background: 'linear-gradient(180deg, rgba(212,175,55,0.8) 0%, rgba(180,140,30,0.6) 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              />
            </div>

            {/* Corner shadows for depth */}
            <div className="absolute bottom-0 right-0 w-12 h-12 opacity-20"
              style={{
                background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.3) 100%)',
              }}
            />
          </div>
        </div>

        {/* ── BACK: The Love Note ── */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute inset-0 bg-[#f5f0e8] rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center p-8">
            {/* Aged paper texture */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundSize: '200px',
              }}
            />

            {/* Faint ruled lines */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(180,160,130,0.15) 27px, rgba(180,160,130,0.15) 28px)',
                backgroundPositionY: '12px',
              }}
            />

            {/* The handwritten note */}
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-6 h-px bg-[#D4AF37]/40 mx-auto mb-5" />

                <p className="font-serif italic text-[#3a2f20] text-base md:text-lg leading-relaxed max-w-[260px]">
                  "{photo.caption}"
                </p>

                <div className="w-6 h-px bg-[#D4AF37]/40 mx-auto mt-5 mb-4" />

                <p className="font-mono text-[8px] tracking-[0.5em] text-[#8a7a60] uppercase">
                  Memory #{String(index + 1).padStart(2, '0')} — {photo.year}
                </p>
              </motion.div>
            </div>

            {/* Coffee stain detail */}
            <div className="absolute bottom-10 right-8 w-12 h-12 rounded-full opacity-[0.04]"
              style={{
                background: 'radial-gradient(circle, #8B4513 0%, transparent 70%)',
              }}
            />

            {/* Tap back hint */}
            <p className="absolute bottom-4 font-mono text-[7px] tracking-[0.3em] text-[#aaa090] uppercase">
              tap to return
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Navigation Dots (vertical) ─── */
function MemoryDots({ count, active, onSelect }) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to memory ${i + 1}`}
          className="group relative"
          style={{ cursor: 'none' }}
        >
          <motion.div
            animate={{
              width: active === i ? 3 : 3,
              height: active === i ? 20 : 8,
              backgroundColor: active === i ? '#D4AF37' : 'rgba(255,255,255,0.15)',
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="rounded-full"
          />
        </button>
      ))}
    </div>
  );
}

/* ─── Swipe indicator animation ─── */
function SwipeHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
    >
      <motion.div
        animate={{ x: [-12, 12, -12] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="flex items-center gap-3"
      >
        <span className="text-[#D4AF37]/30 text-sm">‹</span>
        <p className="font-mono text-[8px] tracking-[0.5em] text-zinc-500 uppercase">
          swipe to reminisce
        </p>
        <span className="text-[#D4AF37]/30 text-sm">›</span>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN GALLERY COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function BentoGallery() {
  const [active, setActive] = useState(0);
  const touchStart = useRef(null);
  const containerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= photos.length) return;
    setActive(idx);
  }, []);

  // Touch/swipe handling
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(active + 1);
      else goTo(active - 1);
    }
    touchStart.current = null;
  };

  // Keyboard nav within this section
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goTo(active - 1);
      if (e.key === 'ArrowRight') goTo(active + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  const photo = photos[active];

  return (
    <section
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex flex-col"
    >
      {/* ── Dark velvet background fabric ── */}
      <div className="absolute inset-0">
        {/* Subtle radial glow behind active card */}
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(45,11,11,0.15) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Pin-line strings (decorative) */}
        <div className="absolute top-[15%] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />
        <div className="absolute top-[85%] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#D4AF37]/06 to-transparent" />
      </div>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="relative z-20 text-center pt-12 pb-4 px-6"
      >
        <span className="font-mono text-[9px] tracking-[0.6em] uppercase text-[#D4AF37]/50 block mb-3">
          Archive Memoir — {String(active + 1).padStart(2, '0')}/{String(photos.length).padStart(2, '0')}
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-white/90 leading-tight italic">
          Stolen <span className="text-champagne not-italic">Eternities.</span>
        </h2>
        <p className="mt-3 font-mono text-[9px] text-white/25 uppercase tracking-[0.3em]">
          moments kept close to the heart
        </p>
      </motion.div>

      {/* ── Polaroid Stage ── */}
      <div className="relative flex-1 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <PolaroidCard
            key={active}
            photo={photo}
            index={active}
            isActive={true}
            onActivate={goTo}
          />
        </AnimatePresence>
      </div>

      {/* ── Memory counter at bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-20 pb-20 flex flex-col items-center gap-3"
      >
        {/* Horizontal dot nav */}
        <div className="flex items-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Memory ${i + 1}`}
              style={{ cursor: 'none' }}
            >
              <motion.div
                animate={{
                  width: active === i ? 24 : 6,
                  backgroundColor: active === i ? '#D4AF37' : 'rgba(255,255,255,0.12)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="h-[3px] rounded-full"
              />
            </button>
          ))}
        </div>

        <p className="font-serif italic text-zinc-600 text-[11px] tracking-wide">
          {photo.year} — a moment worth keeping
        </p>
      </motion.div>

      <SwipeHint />

      {/* ── Floating dust motes ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -(200 + Math.random() * 300)],
              opacity: [0, 0.4, 0],
              x: Math.sin(i) * 40,
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
            className="absolute w-[2px] h-[2px] bg-[#D4AF37] rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: '10%',
              filter: 'blur(0.5px)',
              boxShadow: '0 0 3px rgba(212,175,55,0.5)',
            }}
          />
        ))}
      </div>

      {/* ── Grain ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '150px',
        }}
      />
    </section>
  );
}