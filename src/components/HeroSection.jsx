import { useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

// --- Animation Variants ---
const letterVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: -90,
    filter: 'blur(8px)'
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.05,
      duration: 1.4,
      ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier for that "smooth" luxury feel
    },
  }),
};

export default function HeroSection({ onNext }) {
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  // Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 25 });

  const textX = useTransform(smoothX, [-500, 500], [-20, 20]);
  const textY = useTransform(smoothY, [-500, 500], [-10, 10]);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };

  const onBtnMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setBtnPos({
      x: (e.clientX - (r.left + r.width / 2)) * 0.3,
      y: (e.clientY - (r.top + r.height / 2)) * 0.3
    });
  }, []);

  // Optimized splitText for layout stability
  const splitText = (text, baseDelay = 0) => {
    return text.split(" ").map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block whitespace-nowrap mr-4">
        {word.split("").map((char, charIndex) => (
          <motion.span
            key={charIndex}
            custom={baseDelay + wordIndex * 5 + charIndex}
            variants={letterVariants}
            className="inline-block origin-bottom"
          >
            {char}
          </motion.span>
        ))}
      </span>
    ));
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
      style={{ perspective: "1200px" }} // Critical for the 3D letter flip
    >
      {/* 1. BACKGROUND LAYER (Lowest Z) */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas />
      </div>

      {/* 2. ATMOSPHERIC RINGS */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="absolute w-[600px] h-[600px] pointer-events-none opacity-20 z-10"
      >
        <div className="absolute inset-0 border border-[#D4AF37] rounded-full blur-[1px]" />
        <div className="absolute inset-20 border border-[#D4AF37]/30 rounded-full" />
      </motion.div>

      {/* 3. CONTENT LAYER (Higher Z) */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="relative z-30 text-center px-6 max-w-7xl select-none"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-mono text-[10px] md:text-[13px] tracking-[0.8em] uppercase text-[#D4AF37] mb-8 block"
        >
          A Tribute to Our Infinite
        </motion.p>

        {/* Headline with Word-Wrap Fix */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-white text-5xl md:text-8xl lg:text-9xl font-serif font-light tracking-tighter leading-tight flex flex-wrap justify-center">
            {splitText("Happy Birthday,")}
          </h1>
          <h1 className="text-[#D4AF37] text-5xl md:text-8xl lg:text-9xl font-serif italic font-light mt-2 leading-tight flex flex-wrap justify-center">
            {splitText("My Constant.", 15)}
          </h1>
        </div>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 2 }}
          className="mt-12 space-y-6"
        >
          <p className="text-zinc-400 font-serif italic text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
            "In the architecture of my existence,<br className="hidden md:block" />
            you are both the foundation and the view."
          </p>
          <div className="h-[1px] w-12 bg-[#D4AF37]/40 mx-auto" />
        </motion.div>

        {/* CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="mt-16 md:mt-20"
        >
          <motion.button
            onClick={onNext}
            onMouseMove={onBtnMove}
            onMouseLeave={() => setBtnPos({ x: 0, y: 0 })}
            animate={{ x: btnPos.x, y: btnPos.y }}
            className="group relative px-12 py-6 overflow-hidden bg-transparent border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 text-[#D4AF37] font-mono text-xs tracking-[0.4em] uppercase">
              Begin the Experience
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* 4. SCROLL INDICATOR (Foreground) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        className="absolute bottom-10 z-40"
      >
        <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent animate-bounce" />
      </motion.div>

      {/* Grain / Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.section>
  );
}