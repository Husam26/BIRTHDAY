import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vaultPassword, loveLetter } from '../data';
import MagneticButton from './MagneticButton';

// Typewriter hook that starts typing a multiline letter
function useTypewriter(text, speed = 28, active = false) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) { setIndex(0); return; }
    if (index >= text.length) return;
    const t = setTimeout(() => setIndex(i => i + 1), speed);
    return () => clearTimeout(t);
  }, [index, active, text, speed]);

  return { displayed: text.slice(0, index), done: index >= text.length };
}

// The vault interior — shows typewriter letter
function VaultInterior({ onClose }) {
  const { displayed, done } = useTypewriter(loveLetter, 22, true);

  // Split displayed text to render with newlines
  const lines = displayed.split('\n');

  return (
    <motion.div
      key="interior"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 font-mono text-xs tracking-widest uppercase"
        style={{ color: 'rgba(255,255,255,0.25)', padding: '0' }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
      >
        close
      </button>

      {/* Overline */}
      <p className="overline mb-10" style={{ color: 'rgba(212,175,55,0.5)' }}>vault — unlocked</p>

      {/* Letter */}
      <div
        className="font-serif"
        style={{ fontSize: '1.05rem', lineHeight: 2, color: 'rgba(255,255,255,0.78)', fontStyle: 'normal', maxHeight: '55vh', overflowY: 'auto' }}
      >
        {lines.map((line, i) => {
          const isLast   = i === lines.length - 1;
          const isEmpty  = line.trim() === '';
          return (
            <p
              key={i}
              style={{
                marginBottom: isEmpty ? '1rem' : '0',
                color: line.startsWith('—') ? 'rgba(212,175,55,0.7)' : undefined,
                fontStyle: line.startsWith('—') ? 'italic' : undefined,
              }}
            >
              {line}
              {isLast && !done && <span className="type-cursor" />}
            </p>
          );
        })}
        {done && <span className="type-cursor" style={{ opacity: 0.4 }} />}
      </div>
    </motion.div>
  );
}

// The locked vault
function VaultLock({ onUnlock }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake]   = useState(false);
  const inputRef = useRef(null);

  const tryUnlock = () => {
    if (input.trim().toLowerCase() === vaultPassword) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => { setError(false); setShake(false); }, 800);
    }
  };

  return (
    <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <p className="overline mb-8" style={{ color: 'rgba(212,175,55,0.5)' }}>vault — encrypted</p>
      <h2
        className="font-serif mb-4"
        style={{ fontSize: '2.2rem', fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.2 }}
      >
        The Hidden Vault
      </h2>
      <p className="font-sans mb-12" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, fontWeight: 300 }}>
        There are things I wrote that were not meant for the world.
        Only for you. Enter the word you already know.
      </p>

      <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
        <input
          ref={inputRef}
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && tryUnlock()}
          placeholder="— enter the word —"
          className="vault-input mb-2"
          autoFocus
        />
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs text-center mt-2"
            style={{ color: 'rgba(226,100,100,0.7)', letterSpacing: '0.15em' }}
          >
            not quite. think simpler.
          </motion.p>
        )}
      </motion.div>

      <div className="flex justify-center mt-10">
        <MagneticButton onClick={tryUnlock} strength={0.4}>
          <button
            className="font-mono text-xs tracking-widest uppercase px-8 py-3 transition-all"
            style={{
              border: '1px solid rgba(212,175,55,0.3)',
              color: 'rgba(212,175,55,0.8)',
              borderRadius: '2px',
              letterSpacing: '0.2em',
              background: 'transparent',
            }}
            onMouseEnter={e => { e.currentTarget.parentElement.style.borderColor = 'rgba(212,175,55,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.parentElement.style.borderColor = 'rgba(212,175,55,0.3)'; }}
          >
            Unlock
          </button>
        </MagneticButton>
      </div>
    </motion.div>
  );
}

// Trigger button (editorial — not a big obvious button)
export function VaultTrigger({ onOpen }) {
  return (
    <section className="section" style={{ background: 'var(--obsidian-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="overline mb-6" style={{ color: 'rgba(212,175,55,0.4)' }}>§ 04 — restricted access</p>
          <p
            className="font-serif mb-10"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}
          >
            "Some things were written only for your eyes."
          </p>
          <MagneticButton onClick={onOpen} strength={0.4}>
            <button
              className="font-mono text-xs tracking-widest uppercase px-10 py-4 transition-all"
              style={{
                border: '1px solid rgba(212,175,55,0.25)',
                color: 'rgba(212,175,55,0.7)',
                borderRadius: '2px',
                letterSpacing: '0.25em',
                background: 'transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.05)'; e.currentTarget.style.color = 'rgba(212,175,55,1)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(212,175,55,0.7)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'; }}
            >
              Access the Vault
            </button>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

// The full modal
export function HiddenVault({ open, onClose }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!open) setTimeout(() => setUnlocked(false), 500);
  }, [open]);

  // Prevent body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 8000,
            background: 'rgba(5,5,5,0.92)',
            backdropFilter: 'blur(24px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--obsidian-2)',
              border: '1px solid rgba(212,175,55,0.12)',
              borderRadius: '4px',
              padding: 'clamp(36px, 5vw, 64px)',
              width: '100%',
              maxWidth: '640px',
              position: 'relative',
            }}
          >
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', width: '20px', height: '20px', borderTop: '1px solid rgba(212,175,55,0.3)', borderLeft: '1px solid rgba(212,175,55,0.3)' }} />
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '20px', height: '20px', borderTop: '1px solid rgba(212,175,55,0.3)', borderRight: '1px solid rgba(212,175,55,0.3)' }} />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '20px', height: '20px', borderBottom: '1px solid rgba(212,175,55,0.3)', borderLeft: '1px solid rgba(212,175,55,0.3)' }} />
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '20px', height: '20px', borderBottom: '1px solid rgba(212,175,55,0.3)', borderRight: '1px solid rgba(212,175,55,0.3)' }} />

            <AnimatePresence mode="wait">
              {unlocked
                ? <VaultInterior key="open"   onClose={onClose} />
                : <VaultLock     key="locked" onUnlock={() => setUnlocked(true)} />
              }
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
