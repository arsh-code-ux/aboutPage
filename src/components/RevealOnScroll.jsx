/**
 * =============================================
 * RevealOnScroll — Usage Guide
 * =============================================
 *
 * This component animates its children with a fade-in and slide-up effect as they enter the viewport.
 *
 * Usage Example:
 *   <RevealOnScroll>
 *     <section>...</section>
 *   </RevealOnScroll>
 *
 * Props:
 *   - delay: Animation delay (seconds, default 0)
 *   - duration: Animation duration (seconds, default 0.7)
 *   - y: Initial Y offset in px (default 32)
 *   - ...rest: Any other props are passed to the motion.div
 *
 * Best Practices:
 *   - Use to wrap any block/section for scroll-driven entrance animation.
 *   - Does not affect layout, positioning, or responsiveness.
 *   - Avoid wrapping elements with absolute/overflow-hidden unless needed for your design.
 *
 * Performance:
 *   - Uses transform and opacity for hardware-accelerated, non-layout-shifting animation.
 *
 * Requires:
 *   - framer-motion
 *   - react-intersection-observer
 *
 * =============================================
 */
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * RevealOnScroll
 * Wrap any content to animate it fading in and sliding up as it enters the viewport.
 * - Uses Framer Motion for smooth, hardware-accelerated animations.
 * - Does not alter layout, positioning, or responsiveness.
 * - No extra absolute/overflow wrappers.
 *
 * Usage:
 *   <RevealOnScroll>
 *     <section>...</section>
 *   </RevealOnScroll>
 */
const RevealOnScroll = ({ children, delay = 0, duration = 0.7, y = 32, ...rest }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  React.useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      });
    }
  }, [controls, inView, delay, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={controls}
      style={{ willChange: 'opacity, transform' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
