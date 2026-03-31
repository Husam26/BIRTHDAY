import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { surpriseMessage } from '../data';

export function SurpriseButton({ onOpen }) {
  const [shaking, setShaking] = useState(false);

  const handleClick = () => {
    setShaking(true);
    setTimeout(() => { setShaking(false); onOpen(); }, 300);
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-[#0a0008] to-[#0f0015] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.05),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center"
      >
        <p className="text-gray-400 text-sm uppercase tracking-[0.3em] mb-6">psst… I hid something for you</p>
        <motion.button
          onClick={handleClick}
          animate={shaking ? { x: [-5, 5, -5, 5, 0] } : {}}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168,85,247,0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="relative group overflow-hidden glass-strong px-10 py-5 rounded-2xl border border-purple-500/40 text-xl font-bold text-white cursor-pointer"
        >
          {/* Button shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-purple-500/0 group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">Do Not Click 😈</span>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-2xl border border-purple-400/30 animate-ping" />
        </motion.button>
        <p className="text-gray-600 text-xs mt-4 italic">...you're definitely going to click it</p>
      </motion.div>
    </section>
  );
}

export function SurpriseModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
            onClick={e => e.stopPropagation()}
            className="glass-strong rounded-3xl p-8 sm:p-12 max-w-xl w-full relative overflow-hidden"
          >
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
            {/* Background radial */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12),transparent_70%)]" />

            <div className="relative z-10 text-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-6xl mb-6"
              >
                🔐
              </motion.div>
              <h2 className="text-3xl font-bold gradient-text font-['Playfair_Display',serif] mb-6">
                {surpriseMessage.title}
              </h2>
              <div className="space-y-4 text-left">
                {surpriseMessage.lines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.18, duration: 0.4 }}
                    className={`text-gray-200 leading-relaxed ${i === 0 ? 'italic text-lg' : ''} ${i === 5 ? 'text-pink-300 font-semibold text-center text-xl' : ''}`}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="mt-8 glass px-8 py-3 rounded-full text-pink-300 border border-pink-500/40 hover:bg-pink-500/10 transition-all text-sm font-medium"
              >
                Close ❤️
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
