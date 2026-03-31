import { useEffect, useRef } from 'react';

/**
 * 🎨 THE DESIGNER'S SECRET:
 * 1. LERP (Linear Interpolation): Makes the ring feel like it's "floating" in liquid.
 * 2. GPU Acceleration: Using translate3d(x, y, 0) instead of top/left for 120fps smoothness.
 * 3. Physics Particles: Sparkles have randomized trajectory, gravity, and life-cycles.
 * 4. Blend Modes: Using 'screen' or 'exclusion' to make the gold pop against the burgundy.
 */

export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const sparkContainerRef = useRef(null);

  // Physics State
  const mouse = useRef({ x: 0, y: 0 }); // Real mouse pos
  const circle = useRef({ x: 0, y: 0 }); // Smoothed ring pos
  const lastMouse = useRef({ x: 0, y: 0 }); // For velocity calc

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const sparkContainer = sparkContainerRef.current;

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Immediate dot move
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Calculate velocity for sparkle intensity
      const velocity = Math.hypot(e.clientX - lastMouse.current.x, e.clientY - lastMouse.current.y);
      if (velocity > 2) {
        createSparkle(e.clientX, e.clientY);
      }
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const createSparkle = (x, y) => {
      if (!sparkContainer) return;
      const spark = document.createElement('div');
      const size = Math.random() * 4 + 2;

      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 20;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;

      spark.style.cssText = `
        position: fixed;
        left: ${x}px; top: ${y}px;
        width: ${size}px; height: ${size}px;
        background: radial-gradient(circle, #f0d060 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        filter: blur(1px) drop-shadow(0 0 5px #D4AF37);
        opacity: ${Math.random() * 0.8 + 0.2};
      `;

      sparkContainer.appendChild(spark);

      // Animate Sparkle
      const animation = spark.animate([
        { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
        { transform: `translate3d(${destX}px, ${destY}px, 0) scale(0)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 600,
        easing: 'cubic-bezier(0, .5, .5, 1)'
      });

      animation.onfinish = () => spark.remove();
    };

    const animate = () => {
      // LERP: (Target - Current) * Factor
      // 0.15 makes it feel smooth but responsive
      circle.current.x += (mouse.current.x - circle.current.x) * 0.15;
      circle.current.y += (mouse.current.y - circle.current.y) * 0.15;

      if (ring) {
        ring.style.transform = `translate3d(${circle.current.x}px, ${circle.current.y}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    const handleHover = () => {
      document.body.classList.add('is-hovering');
    };
    const handleUnhover = () => {
      document.body.classList.remove('is-hovering');
    };

    // Global listener for interactive elements
    const setupInteractions = () => {
      const targets = document.querySelectorAll('button, a, .interactive');
      targets.forEach(t => {
        t.addEventListener('mouseenter', handleHover);
        t.addEventListener('mouseleave', handleUnhover);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    const raf = requestAnimationFrame(animate);
    setupInteractions();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[#D4AF37]/50 rounded-full pointer-events-none z-[10000] -ml-5 -mt-5 transition-transform duration-300 ease-out will-change-transform mix-blend-screen"
        style={{ boxShadow: '0 0 15px rgba(212,175,55,0.2)' }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#D4AF37] rounded-full pointer-events-none z-[10001] -ml-[3px] -mt-[3px] will-change-transform"
      />
      <div ref={sparkContainerRef} className="fixed inset-0 pointer-events-none z-[9999]" />

      <style jsx global>{`
        body { cursor: none; }
        
        /* When hovering over buttons/links */
        body.is-hovering .fixed.w-10 {
          transform: scale(1.8) !important;
          background-color: rgba(212,175,55,0.1);
          border-color: #D4AF37;
        }

        @media (max-width: 768px) {
          .fixed.w-10, .fixed.w-1.5 { display: none; }
          body { cursor: auto; }
        }
      `}</style>
    </>
  );
}