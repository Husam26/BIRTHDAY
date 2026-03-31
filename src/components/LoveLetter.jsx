import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from './Shared';

const letterLines = [
  "My love,",
  "",
  "I've been trying to find the right words for a long time.",
  "But there's no right way to say what you mean to me.",
  "",
  "You walked into my life and made it so much warmer.",
  "You didn't try. You just... were. And that was enough.",
  "More than enough.",
  "",
  "The way you laugh at your own jokes.",
  "The way you get quiet when you're thinking.",
  "The way you look at me like I'm something worth keeping.",
  "",
  "I don't know how to thank the universe for that.",
  "But I will spend every day showing you it wasn't a mistake.",
  "",
  "You deserve a love that doesn't waver.",
  "And that's what I promise you.",
  "",
  "Happy Birthday, my everything.",
  "I love you more than I'll ever know how to say.",
  "",
  "— Always yours ❤️",
];

export default function LoveLetter() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (visibleLines >= letterLines.length) return;
    const t = setTimeout(() => setVisibleLines(v => v + 1), 80);
    return () => clearTimeout(t);
  }, [started, visibleLines]);

  return (
    <Section id="letter" className="bg-gradient-to-b from-[#0a0008] via-[#0e0018] to-[#0a0008]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.06),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-4xl sm:text-5xl font-bold gradient-text font-['Playfair_Display',serif] mb-4">A Letter For You</h2>
          <div className="divider" />
        </div>

        <div ref={ref} className="glass-strong rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          {/* Paper texture lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute left-0 right-0 border-t border-white/[0.02]" style={{ top: `${5 + i * 5}%` }} />
          ))}
          <div className="absolute left-16 top-0 bottom-0 border-l border-pink-500/10" />

          <div className="relative z-10 font-mono text-gray-200 text-sm sm:text-base leading-8 pl-8">
            {letterLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className={`${!line ? 'h-4' : ''} ${line.startsWith('—') ? 'text-pink-300 mt-4' : ''} ${line === 'My love,' ? 'text-xl font-bold text-white font-["Playfair_Display",serif] mb-2' : ''}`}>
                {line}
              </div>
            ))}
            {visibleLines < letterLines.length && (
              <span className="typing-cursor text-pink-400 text-lg">|</span>
            )}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
