import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SWEET_MEMORIES = [
  { id: 1, title: "The First Spark", flavor: "Midnight Ganache", note: "The first night we talked until the sun came up and the world stayed quiet just for us.", delay: 0 },
  { id: 2, title: "Simple Joys", flavor: "Sea Salt Caramel", note: "The way you hold my hand... it’s my favorite place in the world.", delay: 0.1 },
  { id: 3, title: "Your Scent", flavor: "Rose Petal & Pink Pepper", note: "Your perfume is the only 'home' I ever want to live in.", delay: 0.2 },
  { id: 4, title: "Our Rhythm", flavor: "Smoked Honey", note: "You are the calm in my storm and the music in my silence.", delay: 0.3 },
  { id: 5, title: "Whispered Dream", flavor: "Champagne Cream", note: "The quiet 'I love you' you whispered when you thought I was already asleep.", delay: 0.4 },
  { id: 6, title: "My Constant", flavor: "Obsidian Velvet", note: "In a world that’s always changing, you are my only forever.", delay: 0.5 },
];

/**
 * 🍫 THE LUXURY TRUFFLE
 * Designed to look like a gourmet chocolate in a gold wrapper.
 */
function ChocolateTruffle({ item, isSelected, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex flex-col items-center justify-center cursor-pointer"
      onClick={() => onSelect(item)}
    >
      {/* 3D Floating Effect */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotateY: [0, 5, -5, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
          delay: item.id * 0.2
        }}
        style={{ transformStyle: "preserve-3d", perspective: "800px" }}
        className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center"
      >
        {/* The Chocolate "Cube" */}
        <div className="relative w-12 h-12 md:w-16 md:h-16 group">
          {/* Faces of the Chocolate */}
          {[
            "rotateY(0deg) translateZ(24px)",
            "rotateY(90deg) translateZ(24px)",
            "rotateY(180deg) translateZ(24px)",
            "rotateY(-90deg) translateZ(24px)",
            "rotateX(90deg) translateZ(24px)",
          ].map((transform, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-[#D4AF37]/40 shadow-xl"
              style={{
                transform,
                background: "linear-gradient(135deg, #2b1010 0%, #1a0505 100%)",
                borderRadius: '4px'
              }}
            >
              {/* Gold Dust Detail */}
              <div className="absolute top-1 right-1 w-1 h-1 bg-[#D4AF37]/30 rounded-full blur-[1px]" />
            </div>
          ))}
          {/* Top "Seal" */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#3d1a1a] border border-[#D4AF37]/50"
            style={{ transform: "rotateX(90deg) translateZ(24px)", borderRadius: '4px' }}
          >
            <div className="w-6 h-6 border border-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <span className="text-[#D4AF37] text-[8px]">❤</span>
            </div>
          </div>
        </div>

        {/* Soft Glow Underneath */}
        <div className="absolute -bottom-4 w-12 h-4 bg-[#D4AF37]/10 blur-xl rounded-full" />
      </motion.div>

      {/* Ribbon-style Label */}
      <div className="mt-4 text-center">
        <p className="font-serif italic text-[11px] md:text-[13px] text-[#D4AF37]/80 tracking-wide uppercase">
          {item.title}
        </p>
      </div>
    </motion.div>
  );
}

export default function RomanticChocolateBox() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0505] py-20 px-6 overflow-hidden">

      {/* 1. ROMANTIC AMBIANCE */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Warm Glows */}
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#590d22]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-[#D4AF37]/10 blur-[120px] rounded-full" />

        {/* Floating "Sparkles" */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: i * 0.5 }}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* 2. HEADER */}
      <div className="relative z-10 text-center mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-4"
        >
          <span className="font-serif italic text-[14px] md:text-[18px] text-[#D4AF37]/60">A sweet collection of...</span>
        </motion.div>
        <h2 className="text-5xl md:text-8xl font-serif text-[#f8edeb] tracking-tighter leading-none italic">
          Favorite <span className="text-[#D4AF37] not-italic">Moments.</span>
        </h2>
      </div>

      {/* 3. THE CHOCOLATE BOX GRID (Mobile 2 columns, Desktop 3) */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 md:gap-24 w-full max-w-4xl px-4">
        {SWEET_MEMORIES.map((item) => (
          <ChocolateTruffle
            key={item.id}
            item={item}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* 4. THE MEMORY UNWRAP OVERLAY */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[100] px-6 py-10"
          >
            {/* Soft Dark Backdrop */}
            <motion.div
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-[#0a0505]/98 backdrop-blur-md"
            />

            {/* The "Gift" Container */}
            <div className="relative w-full max-w-lg text-center">

              {/* Decorative Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mb-10"
              />

              <div className="space-y-6">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-serif italic text-[#D4AF37] text-lg"
                >
                  "{selected.flavor}"
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-3xl md:text-5xl text-[#f8edeb] italic leading-[1.3] px-2"
                >
                  {selected.note}
                </motion.p>
              </div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setSelected(null)}
                className="mt-16 px-10 py-4 group"
              >
                <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-full group-hover:border-[#D4AF37]/60 transition-all" />
                <span className="relative text-[#D4AF37] font-serif italic text-sm tracking-widest uppercase">
                  Back to the Box
                </span>
              </motion.button>

              {/* Little Sparkles when open */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-20, -100],
                    x: (Math.random() - 0.5) * 200,
                    scale: [0, 1, 0]
                  }}
                  transition={{ duration: 2, delay: 0.2 + (i * 0.1) }}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#D4AF37] rounded-full pointer-events-none"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. GENTLE INSTRUCTION */}
      {!selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <p className="font-serif italic text-[13px] text-white/40 tracking-widest">
            Tap a chocolate to unwrap a memory
          </p>
          <div className="w-8 h-[1px] bg-[#D4AF37]/30" />
        </motion.div>
      )}

      {/* Grain Overlay for Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}