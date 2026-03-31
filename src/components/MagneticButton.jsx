import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * MagneticButton — wraps any content with magnetic hover physics.
 * Children are pulled toward the cursor when it enters the bounding area.
 */
export default function MagneticButton({ children, className = '', strength = 0.35, onClick }) {
  const ref      = useRef(null);
  const inner    = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = left + width  / 2;
    const cy = top  + height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    inner.current.style.transform = `translate(${dx}px, ${dy}px)`;
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    inner.current.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <div
      ref={ref}
      className={`magnetic-btn ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div
        ref={inner}
        style={{ transition: 'transform 0.45s cubic-bezier(0.23,1,0.32,1)' }}
      >
        {children}
      </div>
    </div>
  );
}
