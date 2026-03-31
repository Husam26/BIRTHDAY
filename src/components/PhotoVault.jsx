import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { photos } from '../data';

// 3D Stack Card
function StackCard({ photo, offset, zIndex, isTop, onClick, dragConstraints }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0]);

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={dragConstraints}
      dragElastic={0.18}
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : `${offset * 3}deg`,
        zIndex,
        position: 'absolute',
        top: `${offset * 14}px`,
        left: `${offset * 8}px`,
        width: '100%',
      }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) onClick();
      }}
      whileHover={isTop ? { y: -6 } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="film-grain"
      data-cursor
    >
      {/* Card */}
      <div
        style={{
          borderRadius: '4px',
          overflow: 'hidden',
          aspectRatio: '3/4',
          background: '#0d0d0d',
          boxShadow: isTop
            ? '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
            : '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <img
          src={photo.src}
          alt={photo.caption}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          draggable={false}
        />
        {/* Vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.2) 40%, transparent 70%)', zIndex: 1 }} />
        {/* Film label */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 24px', zIndex: 2 }}>
          <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,175,55,0.6)', marginBottom: '8px', textTransform: 'uppercase' }}>
            {photo.year} · {photo.label}
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
            {photo.caption}
          </p>
        </div>
      </div>

      {isTop && (
        <motion.div style={{ opacity, background: 'rgba(212,175,55,0.08)', zIndex: 3 }} className="absolute inset-0 pointer-events-none" />
      )}
    </motion.div>
  );
}

export default function PhotoVault() {
  const [stack, setStack] = useState(photos.map((_, i) => i));
  const constraintRef = useRef(null);

  const dismiss = () => {
    setStack(prev => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const currentPhoto = photos[stack[0]];
  const counter = `${(stack.indexOf(stack[0]) % photos.length) + 1} / ${photos.length}`;

  return (
    <section id="memoir" className="section noise-bg" style={{ background: 'var(--obsidian-1)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-20">
          <div>
            <p className="overline mb-3">§ 01 — the memoir</p>
            <h2
              className="font-serif"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.1 }}
            >
              A Private<br /><span style={{ fontStyle: 'italic', color: 'rgba(212,175,55,0.85)' }}>Archive</span>
            </h2>
          </div>
          <p className="font-sans text-sm hidden md:block" style={{ color: 'rgba(255,255,255,0.3)', maxWidth: '280px', lineHeight: 1.7, textAlign: 'right' }}>
            Drag to browse. Each photograph holds a truth too precise for words alone.
          </p>
        </div>

        {/* Stack area */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* The stack */}
          <div ref={constraintRef} className="relative flex-shrink-0 stack-scene" style={{ width: 'min(380px, 85vw)', height: 'min(520px, 120vw)' }}>
            {[...stack].reverse().map((photoIdx, i) => {
              const reverseI = stack.length - 1 - i;
              const isTop = reverseI === 0;
              return (
                <StackCard
                  key={photoIdx}
                  photo={photos[photoIdx]}
                  offset={reverseI}
                  zIndex={i}
                  isTop={isTop}
                  onClick={dismiss}
                  dragConstraints={constraintRef}
                />
              );
            })}
          </div>

          {/* Caption panel */}
          <div className="flex-1 max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={stack[0]}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              >
                <p className="overline mb-6" style={{ color: 'rgba(212,175,55,0.5)' }}>
                  {photos[stack[0]].year} · captured
                </p>
                <p
                  className="font-serif mb-8"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontStyle: 'italic', lineHeight: 1.5, color: 'rgba(255,255,255,0.82)' }}
                >
                  "{photos[stack[0]].caption}"
                </p>
                <div className="hairline-h mb-8" />
                <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
                  Drag the photograph to move through the archive. Each one was chosen carefully.
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-6 mt-10">
              <button
                onClick={dismiss}
                className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all"
                style={{ border: '1px solid rgba(212,175,55,0.25)', color: 'rgba(212,175,55,0.7)', borderRadius: '2px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'; e.currentTarget.style.color = 'rgba(212,175,55,1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'; e.currentTarget.style.color = 'rgba(212,175,55,0.7)'; }}
              >
                Next →
              </button>
              <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {photos.length} photographs
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
