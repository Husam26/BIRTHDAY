import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { secretPagePassword } from '../data';

const secretContent = [
  { emoji: "🌹", text: "You make me believe in things I stopped believing in." },
  { emoji: "💌", text: "If I could save one thing, it would be the way you look at me." },
  { emoji: "🔮", text: "I don't know the future, but I know I want you in it." },
  { emoji: "🌙", text: "You're the person I think about when songs hit different." },
  { emoji: "👑", text: "You deserve every beautiful thing. Every single one." },
];

export default function SecretPage({ onClose }) {
  const [input, setInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const tryUnlock = () => {
    if (input.toLowerCase().replace(/\s/g, '') === secretPagePassword) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1),transparent_70%)]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="glass-strong rounded-3xl p-8 sm:p-12 max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-2xl"
        >
          ×
        </button>

        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="text-6xl mb-6">🔐</div>
              <h2 className="text-3xl font-bold gradient-text font-['Playfair_Display',serif] mb-2">Secret Page</h2>
              <p className="text-gray-400 text-sm mb-8">
                Only you would know the password 😏<br />
                <span className="text-xs italic">(hint: three simple words)</span>
              </p>
              <div className="space-y-4">
                <input
                  type="password"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && tryUnlock()}
                  placeholder="Enter password…"
                  className={`w-full glass rounded-xl px-5 py-3 text-white placeholder-gray-500 outline-none border transition-all ${
                    error ? 'border-red-500' : 'border-pink-500/30 focus:border-pink-500'
                  } bg-transparent`}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm"
                  >
                    Wrong password… think harder 💕
                  </motion.p>
                )}
                <motion.button
                  onClick={tryUnlock}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  Unlock 🗝️
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="unlocked" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <motion.div
                animate={{ rotate: [0, 15, -15, 15, 0] }}
                transition={{ duration: 0.6 }}
                className="text-6xl mb-6"
              >
                💝
              </motion.div>
              <h2 className="text-2xl font-bold text-white font-['Playfair_Display',serif] mb-6">
                You found them 🤍
              </h2>
              <div className="space-y-4 text-left">
                {secretContent.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-3 glass rounded-xl px-4 py-3"
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <p className="text-gray-200 text-sm leading-relaxed">{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
