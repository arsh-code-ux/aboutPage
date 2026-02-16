import React from 'react';
import RevealOnScroll from './RevealOnScroll';

/**
 * LuxuryHero
 * - High-contrast serif heading using Tailwind CSS
 * - Note: for exact Playfair Display rendering, add the Google Font to your HTML head:
 *   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
 */
const LuxuryHero = ({ className = '' }) => {
  return (
    <section className={`py-12 ${className}`} aria-label="hero">
      <div className="max-w-5xl mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mx-auto max-w-[34ch]">
            <h1
              style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 6px 18px rgba(0,0,0,0.06)' }}
              className="font-serif font-normal text-4xl sm:text-5xl md:text-6xl lg:text-6xl leading-tight tracking-tight uppercase"
            >
              <span className="block text-[#111827]">BRINGING <span className="italic text-[#D4AF37]">ARTISTS</span> &amp;</span>
              <span className="block"><span className="italic text-[#D4AF37]">ART LOVERS</span></span>
              <span className="block text-[#111827]">AT ONE STAGE</span>
            </h1>

            <div className="mt-6 flex justify-center">
              <span className="inline-block w-24 h-0.5 bg-[#D4AF37] rounded-full opacity-95" />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default LuxuryHero;
