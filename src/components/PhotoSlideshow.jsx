import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeading } from './Shared';
import { photos } from '../data';

export default function PhotoSlideshow() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);

  const go = (dir) => {
    setDirection(dir);
    setCurrent(c => (c + dir + photos.length) % photos.length);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => go(1), 4500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0, scale: 0.9 }),
  };

  return (
    <Section id="memories" className="bg-gradient-to-b from-[#0a0008] via-[#0f0015] to-[#0a0008]">
      <SectionHeading
        emoji="📸"
        title="Our Memories"
        subtitle="A few frozen moments of something infinite"
      />

      <div className="max-w-4xl mx-auto">
        {/* Slideshow */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[16/9] glow-pink">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <img
                src={photos[current].src}
                alt={photos[current].caption}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 photo-overlay" />
              {/* Caption */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute bottom-0 left-0 right-0 p-6 sm:p-10"
              >
                <p className="text-2xl sm:text-3xl font-bold text-white font-['Playfair_Display',serif] mb-2">
                  "{photos[current].caption}"
                </p>
                <p className="text-gray-300 text-base sm:text-lg italic">{photos[current].sub}</p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Control Buttons */}
          <button
            onClick={() => { clearInterval(intervalRef.current); go(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 glass w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white hover:bg-pink-500/20 transition-all z-10"
          >
            ‹
          </button>
          <button
            onClick={() => { clearInterval(intervalRef.current); go(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 glass w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white hover:bg-pink-500/20 transition-all z-10"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-6">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 h-2.5 bg-gradient-to-r from-pink-500 to-purple-500'
                  : 'w-2.5 h-2.5 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="grid grid-cols-5 gap-2 mt-6">
          {photos.map((p, i) => (
            <motion.div
              key={p.id}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              whileHover={{ scale: 1.05 }}
              className={`relative rounded-xl overflow-hidden cursor-pointer aspect-square transition-all duration-300 ${
                i === current ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-[#0a0008]' : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img src={p.src} alt={p.caption} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
