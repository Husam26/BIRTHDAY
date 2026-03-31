import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Cursor          from './components/Cursor';
import CurtainReveal   from './components/CurtainReveal';
import HeroSection     from './components/HeroSection';
import GiftBox         from './components/GiftBox';
import BentoGallery    from './components/BentoGallery';
import CakeSection     from './components/CakeSection';
import ChocolateBox    from './components/ChocolateBox';
import { VaultTrigger, VaultModal } from './components/VaultSection';
import FinalSection    from './components/FinalSection';

// ─── SECTION REGISTRY ─────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',      label: 'Home',      icon: '◆' },
  { id: 'gift',      label: 'Gift',      icon: '✦' },
  { id: 'memoir',    label: 'Memoir',    icon: '▣' },
  { id: 'ceremony',  label: 'Ceremony',  icon: '♨' },
  { id: 'fragments', label: 'Fragments', icon: '◈' },
  { id: 'vault',     label: 'Vault',     icon: '⬡' },
  { id: 'final',     label: 'Closing',   icon: '♥' },
];

// ─── TRANSITION VARIANTS ──────────────────────────────────────
const makeVariants = (direction) => ({
  initial: {
    opacity: 0,
    y: direction === 'next' ? 60 : -60,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: direction === 'next' ? -60 : 60,
    filter: 'blur(10px)',
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
});

// ─── DOT INDICATORS ──────────────────────────────────────────
function DotNav({ current, total, onGoTo }) {
  return (
    <div
      role="navigation"
      aria-label="Section navigation dots"
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          role="button"
          aria-label={`Go to ${SECTIONS[i].label} section`}
          aria-current={i === current ? 'true' : 'false'}
          onClick={() => onGoTo(i)}
          style={{
            width: i === current ? '24px' : '6px',
            height: '6px',
            borderRadius: '3px',
            backgroundColor: i === current
              ? 'rgba(212,175,55,0.9)'
              : 'rgba(255,255,255,0.2)',
            border: 'none',
            cursor: 'none',
            padding: 0,
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: i === current ? '0 0 10px rgba(212,175,55,0.5)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─── NAVIGATION OVERLAY ───────────────────────────────────────
function NavigationOverlay({ current, total, onNext, onPrev, onGoTo, onOpenVault }) {
  const canPrev = current > 0;
  const canNext = current < total - 1;
  const section  = SECTIONS[current];

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setPlaying(p => !p);
  };

  return (
    <>
      {/* Ambient music */}
      <audio ref={audioRef} loop preload="none"
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

      {/* ── Top Bar ── */}
      <nav
        aria-label="Top bar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 7000,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 32px',
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.9), transparent)',
          pointerEvents: 'auto',
        }}
      >
        {/* Brand */}
        <span className="overline" style={{ color: 'rgba(212,175,55,0.45)' }}>◆ For Her</span>

        {/* Section label (center) */}
        <motion.div
          key={current}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span style={{
            fontFamily: 'Geist Mono, monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.55)',
          }}>
            {section.icon} {section.label}
          </span>
          <span style={{
            fontFamily: 'Geist Mono, monospace',
            fontSize: '0.5rem',
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.12)',
          }}>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </motion.div>

        {/* Audio toggle */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button
            onClick={toggleAudio}
            aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
            style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              color: playing ? 'rgba(212,175,55,0.7)' : 'rgba(255,255,255,0.22)',
              textTransform: 'uppercase',
              background: 'none', border: 'none', cursor: 'none',
              transition: 'color 0.3s ease',
            }}
          >
            {playing ? '♪ on' : '♪ off'}
          </button>
        </div>
      </nav>

      {/* ── Bottom Navigation Bar ── */}
      <div
        aria-label="Section navigation"
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 7000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 32px',
          background: 'linear-gradient(to top, rgba(5,5,5,0.9), transparent)',
          pointerEvents: 'auto',
        }}
      >
        {/* Prev button */}
        <motion.button
          aria-label="Previous section"
          onClick={onPrev}
          disabled={!canPrev}
          whileHover={canPrev ? { x: -4 } : {}}
          whileTap={canPrev ? { scale: 0.92 } : {}}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${canPrev ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: '2px',
            padding: '10px 18px',
            cursor: canPrev ? 'none' : 'default',
            opacity: canPrev ? 1 : 0.25,
            fontFamily: 'Geist Mono, monospace',
            fontSize: '0.55rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: canPrev ? 'rgba(212,175,55,0.7)' : 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
          }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M0.646447 4.64645C0.451184 4.84171 0.451184 5.15829 0.646447 5.35355L3.82843 8.53553C4.02369 8.7308 4.34027 8.7308 4.53553 8.53553C4.7308 8.34027 4.7308 8.02369 4.53553 7.82843L1.70711 5L4.53553 2.17157C4.7308 1.97631 4.7308 1.65973 4.53553 1.46447C4.34027 1.2692 4.02369 1.2692 3.82843 1.46447L0.646447 4.64645ZM14 4.5L1 4.5L1 5.5L14 5.5L14 4.5Z" fill="currentColor"/>
          </svg>
          {canPrev ? SECTIONS[current - 1].label : 'Begin'}
        </motion.button>

        {/* Dots + vault button in center */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <DotNav current={current} total={total} onGoTo={onGoTo} />
          {/* Vault shortcut — subtle */}
          <button
            onClick={onOpenVault}
            aria-label="Open secret vault"
            style={{
              background: 'none', border: 'none', cursor: 'none',
              fontFamily: 'Geist Mono, monospace',
              fontSize: '0.48rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.2)',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,175,55,0.5)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.2)'}
          >
            vault ↗
          </button>
        </div>

        {/* Next button — hidden on Hero (0) and Gift (1) which have their own internal CTAs */}
        {current !== 0 && current !== 1 ? (
        <motion.button
          aria-label="Next section"
          onClick={onNext}
          disabled={!canNext}
          whileHover={canNext ? { x: 4 } : {}}
          whileTap={canNext ? { scale: 0.92 } : {}}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${canNext ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: '2px',
            padding: '10px 18px',
            cursor: canNext ? 'none' : 'default',
            opacity: canNext ? 1 : 0.25,
            fontFamily: 'Geist Mono, monospace',
            fontSize: '0.55rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: canNext ? 'rgba(212,175,55,0.7)' : 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
          }}
        >
          {canNext ? SECTIONS[current + 1].label : 'End'}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M13.3536 5.35355C13.5488 5.15829 13.5488 4.84171 13.3536 4.64645L10.1716 1.46447C9.97631 1.2692 9.65973 1.2692 9.46447 1.46447C9.2692 1.65973 9.2692 1.97631 9.46447 2.17157L12.2929 5L9.46447 7.82843C9.2692 8.02369 9.2692 8.34027 9.46447 8.53553C9.65973 8.7308 9.97631 8.7308 10.1716 8.53553L13.3536 5.35355ZM0 5.5H13V4.5H0V5.5Z" fill="currentColor"/>
          </svg>
        </motion.button>
        ) : <div style={{ width: '80px' }} />}
      </div>
    </>
  );
}

// ─── SECTION CONTROLLER ───────────────────────────────────────
function SectionController({ onOpenVault }) {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState('next');
  const total = SECTIONS.length;

  const goTo = useCallback((idx) => {
    if (idx === current) return;
    setDirection(idx > current ? 'next' : 'prev');
    setCurrent(idx);
  }, [current]);

  const goNext = useCallback(() => { if (current < total - 1) goTo(current + 1); }, [current, total, goTo]);
  const goPrev = useCallback(() => { if (current > 0)         goTo(current - 1); }, [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const variants = makeVariants(direction);

  const renderSection = () => {
    const id = SECTIONS[current].id;
    switch (id) {
      case 'hero':      return <HeroSection onNext={goNext} />;
      case 'gift':      return <GiftBox onNext={goNext} />;
      case 'memoir':    return <BentoGallery />;
      case 'ceremony':  return <CakeSection onMidnight={() => {}} />;
      case 'fragments': return <ChocolateBox />;
      case 'vault':     return <VaultTrigger onOpen={onOpenVault} />;
      case 'final':     return <FinalSection />;
      default:          return null;
    }
  };

  return (
    <>
      {/* Section area */}
      <div
        style={{
          position: 'fixed', inset: 0,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'absolute', inset: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
            // Hide native scrollbar but allow internal scroll
            className="hide-scrollbar"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation UI on top of everything */}
      <NavigationOverlay
        current={current}
        total={total}
        onNext={goNext}
        onPrev={goPrev}
        onGoTo={goTo}
        onOpenVault={onOpenVault}
      />
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [stage,     setStage]     = useState('curtain'); // 'curtain' | 'revealed'
  const [vaultOpen, setVaultOpen] = useState(false);

  return (
    <div style={{ background: 'var(--obsidian)', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Grain overlay */}
      <div id="grain" />

      {/* Custom cursor */}
      <Cursor />

      {/* Stage 1: Curtain */}
      <AnimatePresence>
        {stage === 'curtain' && (
          <CurtainReveal onReveal={() => setStage('revealed')} />
        )}
      </AnimatePresence>

      {/* Stage 2: Section-based experience */}
      <AnimatePresence>
        {stage === 'revealed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            style={{ position: 'fixed', inset: 0 }}
          >
            {/* Vault modal (renders above everything) */}
            <VaultModal open={vaultOpen} onClose={() => setVaultOpen(false)} />

            {/* The section controller + nav overlay */}
            <SectionController onOpenVault={() => setVaultOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
