import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { timeline } from '../data';

// Individual timeline card — blur-to-clear reveal
function TimelineCard({ item, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`relative flex items-start gap-0 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-24`}>
      {/* Card */}
      <motion.div
        className={`p-8 ${isLeft ? 'text-right' : 'text-left'}`}
        style={{
          flex: '0 0 calc(50% - 40px)',
          filter: inView ? 'blur(0px)' : 'blur(20px)',
          opacity: inView ? 1 : 0,
          transition: `filter 1s ease ${index * 0.08}s, opacity 1s ease ${index * 0.08}s`,
          borderRadius: '3px',
          background: 'rgba(212,175,55,0.035)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,175,55,0.12)',
          marginRight: isLeft ? '40px' : 0,
          marginLeft: !isLeft ? '40px' : 0,
        }}
      >
        <p className="overline mb-3" style={{ textAlign: isLeft ? 'right' : 'left' }}>{item.date}</p>
        <h3
          className="font-serif mb-4"
          style={{
            fontSize: '1.45rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.25,
            textAlign: isLeft ? 'right' : 'left',
          }}
        >
          {item.title}
        </h3>
        <p
          className="font-sans"
          style={{
            fontSize: '0.9rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 300,
            textAlign: isLeft ? 'right' : 'left',
          }}
        >
          {item.desc}
        </p>
      </motion.div>

      {/* Center node */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ top: '28px' }}>
        <motion.div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'scale(1)' : 'scale(0)',
            transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.08}s`,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--champagne)',
            boxShadow: '0 0 20px rgba(212,175,55,0.6)',
            zIndex: 2,
            position: 'relative',
          }}
        />
        <span
          className="font-mono mt-3"
          style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.4)', letterSpacing: '0.15em' }}
        >
          {item.marker}
        </span>
      </div>
    </div>
  );
}

export default function Timeline() {
  const containerRef  = useRef(null);
  const lineRef       = useRef(null);
  const [lineH, setLineH] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current || !lineRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (-top + window.innerHeight * 0.5) / height));
      lineRef.current.style.height = `${progress * 100}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="section" style={{ background: 'var(--obsidian)' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-24">
          <p className="overline mb-4">§ 02 — the record</p>
          <h2
            className="font-serif"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.1 }}
          >
            A Lover's<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(212,175,55,0.85)' }}>Timeline</span>
          </h2>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Static rail */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0"
            style={{ width: '1px', background: 'rgba(212,175,55,0.1)' }}
          />
          {/* Animated growing line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0"
            style={{
              width: '1px',
              height: '0%',
              background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.5))',
              transition: 'height 0.12s linear',
            }}
          />

          {timeline.map((item, i) => (
            <TimelineCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
