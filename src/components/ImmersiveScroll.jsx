import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 1, title: 'Curated Collections', subtitle: 'A quiet collection of selected works' },
  { id: 2, title: 'Modern Expressions', subtitle: 'Contemporary pieces with restraint' },
  { id: 3, title: 'Timeless Classics', subtitle: 'Works that withstand time' },
];

export default function ImmersiveScroll() {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const isSnappingRef = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function indexForScrollTop(scrollTop) {
      const h = container.clientHeight || window.innerHeight;
      return Math.round(scrollTop / h);
    }

    function scrollToIndex(i) {
      const clamped = Math.max(0, Math.min(sections.length - 1, i));
      const target = sectionsRef.current[clamped];
      if (!target) return;
      isSnappingRef.current = true;
      container.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      // lock for duration of smooth scroll
      setTimeout(() => {
        isSnappingRef.current = false;
      }, 700);
    }

    function handleWheel(e) {
      if (isSnappingRef.current) return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      const idx = indexForScrollTop(container.scrollTop);
      scrollToIndex(idx + dir);
    }

    function handleTouchStart(e) {
      touchStartY.current = e.touches ? e.touches[0].clientY : e.clientY;
    }

    function handleTouchEnd(e) {
      if (isSnappingRef.current) return;
      const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const diff = touchStartY.current - endY;
      if (Math.abs(diff) < 30) return;
      const dir = diff > 0 ? 1 : -1;
      const idx = indexForScrollTop(container.scrollTop);
      scrollToIndex(idx + dir);
    }

    function handleKey(e) {
      if (isSnappingRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const idx = indexForScrollTop(container.scrollTop);
        scrollToIndex(idx + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const idx = indexForScrollTop(container.scrollTop);
        scrollToIndex(idx - 1);
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKey);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <section className="relative w-full h-screen">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1508796079212-a4b83f3a0a6b?q=80&w=2000&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover filter saturate-90 brightness-90"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Scroll container with snap behaviour */}
      <div
        ref={containerRef}
        className="relative z-10 h-screen w-full snap-y snap-mandatory overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {sections.map((s, i) => (
          <section
            key={s.id}
            ref={(el) => (sectionsRef.current[i] = el)}
            className="h-screen snap-start flex items-center justify-center px-6"
            style={{ scrollSnapStop: 'always' }}
          >
            <motion.div
              className="max-w-4xl text-center text-white px-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6 tracking-tight">
                {s.title}
              </h2>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">{s.subtitle}</p>
            </motion.div>
          </section>
        ))}
      </div>
    </section>
  );
}
