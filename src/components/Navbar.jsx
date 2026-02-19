import React from 'react';

const Navbar = () => {
  return (
    <header className="w-full max-w-full py-4 sm:py-6 bg-white/0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
        <a href="/" className="font-serif text-lg sm:text-xl text-gallery-dark tracking-[0.08em]">
          Zigguratss
        </a>
        <nav className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <a href="/artworks" className="font-sans text-xs sm:text-sm text-gallery-muted hover:text-gallery-accent transition-colors">Artworks</a>
          <a href="/about" className="hidden sm:inline-block font-sans text-xs sm:text-sm text-gallery-muted hover:text-gallery-accent transition-colors">About</a>
          <a href="/contact" className="hidden md:inline-block font-sans text-xs sm:text-sm text-gallery-muted hover:text-gallery-accent transition-colors">Contact</a>
          <a href="/signup" className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gallery-accent text-gallery-dark text-xs sm:text-sm font-semibold rounded-md whitespace-nowrap">Join</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
