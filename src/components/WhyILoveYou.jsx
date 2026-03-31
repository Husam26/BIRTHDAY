import { motion } from 'framer-motion';
import { loveReasons } from '../data';

function BentoCard({ item, index }) {
  const isLarge  = item.size === 'large';
  const isMedium = item.size === 'medium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative overflow-hidden group ${isLarge ? 'col-span-2' : ''}`}
      style={{
        padding: '40px 36px',
        background: index % 3 === 0
          ? 'rgba(212,175,55,0.03)'
          : index % 3 === 1
          ? 'rgba(226,180,189,0.025)'
          : 'rgba(255,255,255,0.02)',
        minHeight: isLarge ? '220px' : isMedium ? '200px' : '180px',
        cursor: 'default',
      }}
      data-cursor
    >
      {/* Hover reveal accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)',
          transform: 'scaleX(0)',
          transformOrigin: 'center',
          transition: 'transform 0.5s ease',
        }}
        className="group-hover:[transform:scaleX(1)]"
      />

      {/* Index */}
      <p
        className="font-mono mb-4"
        style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,175,55,0.35)', textTransform: 'uppercase' }}
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      {/* Quote */}
      <h3
        className="font-serif mb-4"
        style={{
          fontSize: isLarge ? 'clamp(1.4rem, 2.5vw, 2.2rem)' : '1.15rem',
          fontWeight: 600,
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.3,
        }}
      >
        {item.quote}
      </h3>

      {/* Sub */}
      <p
        className="font-sans"
        style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, fontWeight: 300 }}
      >
        {item.sub}
      </p>

      {/* Bottom right marker */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '24px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: index % 2 === 0 ? 'rgba(212,175,55,0.4)' : 'rgba(226,180,189,0.4)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
        className="group-hover:opacity-100 group-hover:scale-125 opacity-50"
      />
    </motion.div>
  );
}

export default function WhyILoveYou() {
  return (
    <section className="section noise-bg" style={{ background: 'var(--obsidian-1)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
          <div>
            <p className="overline mb-3">§ 03 — the reason</p>
            <h2
              className="font-serif"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)', fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.1 }}
            >
              What You<br />
              <span style={{ fontStyle: 'italic', color: 'rgba(226,180,189,0.8)' }}>Mean To Me</span>
            </h2>
          </div>
          <p
            className="font-sans"
            style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)', maxWidth: '280px', lineHeight: 1.8, fontWeight: 300 }}
          >
            Six things I would tell you on an ordinary Tuesday. Not just today.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {loveReasons.map((item, i) => (
            <BentoCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
