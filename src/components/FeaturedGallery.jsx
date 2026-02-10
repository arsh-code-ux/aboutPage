import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const artworks = [
  {
    id: 'inner-peace-6',
    title: 'Inner Peace 6',
    artist: 'Monalisa Sarkar Mitra',
    price: '₹ 1,17,000',
    priceNum: 117000,
    dimensions: '106.68 × 152.40 cm',
    medium: 'Acrylic on Canvas',
    year: '2024',
    category: 'Spiritual',
    description:
      'A meditative exploration of inner tranquility — layered textures converge into a harmonious stillness that invites contemplation.',
    image:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1800&auto=format',
  },
  {
    id: 'tune-of-bengal-4',
    title: 'Tune Of Bengal — 4',
    artist: 'Sekhar Roy',
    price: '₹ 4,16,000',
    priceNum: 416000,
    dimensions: '152.40 × 121.92 cm',
    medium: 'Oil on Canvas',
    year: '2023',
    category: 'Painting',
    description:
      'Roy\'s iconic depiction of Bengal\'s cultural soul, rendered through bold colour fields and rhythmic compositional flow.',
    image:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1800&auto=format',
  },
  {
    id: 'ocean-of-dreams',
    title: 'Ocean Of Dreams',
    artist: 'Uttam Bhattacharya',
    price: '₹ 52,000',
    priceNum: 52000,
    dimensions: '76.20 × 101.60 cm',
    medium: 'Mixed Media on Canvas',
    year: '2024',
    category: 'Abstract',
    description:
      'Oceanic hues drift across the canvas in dream-like layers, evoking the boundless depth of the subconscious.',
    image:
      'https://images.unsplash.com/photo-1551913902-c92207136625?q=80&w=1800&auto=format',
  },
  {
    id: 'the-juggler-within',
    title: 'The Juggler Within',
    artist: 'Pramod Neelakandan',
    price: '₹ 45,500',
    priceNum: 45500,
    dimensions: '68.58 × 91.44 cm',
    medium: 'Acrylic on Canvas',
    year: '2024',
    category: 'Contemporary',
    description:
      'A vibrant commentary on the modern human condition — balancing identity, ambition and vulnerability in perpetual motion.',
    image:
      'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1800&auto=format',
  },
];

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
const EASE = [0.16, 1, 0.3, 1];
const CARD_W = 480; // px – base card width for scroll math

const ArrowIcon = () => (
  <svg
    className="w-4 h-4 text-luxury-muted group-hover/btn:text-luxury-dark transition-colors duration-300 -rotate-45"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════════ */
const CustomCursor = ({ isHoveringCard }) => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden lg:flex items-center justify-center"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      {/* outer ring */}
      <motion.div
        animate={{
          width: isHoveringCard ? 90 : 14,
          height: isHoveringCard ? 90 : 14,
          backgroundColor: isHoveringCard
            ? 'rgba(212,175,55,0.15)'
            : 'rgba(212,175,55,0)',
          borderColor: isHoveringCard
            ? 'rgba(212,175,55,0.6)'
            : 'rgba(245,245,245,0.4)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="rounded-full border flex items-center justify-center backdrop-blur-sm"
      >
        <AnimatePresence>
          {isHoveringCard && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-sans font-bold tracking-[0.25em] text-luxury-accent uppercase select-none"
            >
              View
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STAGGERED TEXT
   ═══════════════════════════════════════════════════════════════ */
const StaggeredText = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ARTWORK CARD  (side-by-side: image left · info right)
   ═══════════════════════════════════════════════════════════════ */
const ArtworkCard = ({ artwork, index, onSelect, onHover, scrollProgress }) => {
  const cardRef = useRef(null);

  // parallax: shift image inside its frame based on scroll progress
  const imgX = useTransform(
    scrollProgress,
    [
      (index - 1) / artworks.length,
      index / artworks.length,
      (index + 1) / artworks.length,
    ],
    [60, 0, -60],
  );
  const imgScale = useTransform(
    scrollProgress,
    [
      (index - 0.5) / artworks.length,
      index / artworks.length,
      (index + 0.5) / artworks.length,
    ],
    [1.15, 1.05, 1.15],
  );

  return (
    <div
      ref={cardRef}
      className="snap-center flex-shrink-0 w-[92vw] md:w-[88vw] lg:w-[85vw] xl:w-[80vw] h-full flex items-center justify-center px-3 sm:px-5"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <motion.div
        className="relative w-full h-[75vh] sm:h-[78vh] cursor-none lg:cursor-none cursor-pointer group flex flex-col md:flex-row gap-0 overflow-hidden rounded-sm bg-luxury-neutral/30"
        onClick={() => onSelect(artwork)}
        whileTap={{ scale: 0.99 }}
      >
        {/* ── LEFT: Image ── */}
        <div className="relative w-full md:w-[55%] lg:w-[58%] h-[45%] md:h-full overflow-hidden">
          {/* floating index watermark */}
          <div className="absolute top-4 left-4 md:-top-2 md:-left-2 z-20 pointer-events-none select-none">
            <span className="font-serif text-[4rem] md:text-[7rem] lg:text-[9rem] leading-none text-white/[0.06]">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* image — layoutId for shared transition */}
          <motion.div
            layoutId={`image-${artwork.id}`}
            className="absolute inset-0"
          >
            <motion.img
              src={artwork.image}
              alt={artwork.title}
              loading="lazy"
              className="w-full h-full object-cover will-change-transform"
              style={{ x: imgX, scale: imgScale }}
            />
          </motion.div>

          {/* hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* category badge */}
          <div className="absolute top-5 left-5 z-10">
            <span className="bg-black/30 backdrop-blur-md text-luxury-text/90 text-[9px] font-sans tracking-[0.2em] uppercase px-3 py-1.5 border border-white/10">
              {artwork.category}
            </span>
          </div>
        </div>

        {/* ── RIGHT: Info Panel ── */}
        <div className="relative w-full md:w-[45%] lg:w-[42%] h-[55%] md:h-full flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-14 py-6 md:py-10 bg-gradient-to-br from-[#111]/95 via-[#0d0d0d]/95 to-[#0a0a0a]/95 backdrop-blur-sm">
          {/* decorative accent line */}
          <div className="absolute top-0 left-0 w-px h-full bg-luxury-accent/10 hidden md:block" />
          <div className="absolute top-0 left-0 w-full h-px bg-luxury-accent/10 md:hidden" />

          {/* category label */}
          <StaggeredText delay={0.05 * index}>
            <span className="inline-block text-[9px] font-sans font-semibold tracking-[0.3em] uppercase text-luxury-accent border border-luxury-accent/25 px-3 py-1 mb-5">
              {artwork.category}
            </span>
          </StaggeredText>

          {/* title */}
          <StaggeredText delay={0.05 * index + 0.06}>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-[2.7rem] text-luxury-text leading-[1.1] group-hover:text-luxury-accent transition-colors duration-500 mb-3">
              {artwork.title}
            </h3>
          </StaggeredText>

          {/* artist */}
          <StaggeredText delay={0.05 * index + 0.12}>
            <p className="font-sans text-sm sm:text-base text-luxury-muted tracking-wide mb-6">
              by <span className="text-luxury-text/80 font-medium">{artwork.artist}</span>
            </p>
          </StaggeredText>

          {/* divider */}
          <StaggeredText delay={0.05 * index + 0.18}>
            <div className="h-px w-full bg-luxury-text/10 mb-6" />
          </StaggeredText>

          {/* metadata grid */}
          <StaggeredText delay={0.05 * index + 0.22}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.2em] text-luxury-muted/50 mb-1">
                  Medium
                </p>
                <p className="text-xs sm:text-sm font-sans text-luxury-text/70">
                  {artwork.medium}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.2em] text-luxury-muted/50 mb-1">
                  Dimensions
                </p>
                <p className="text-xs sm:text-sm font-sans text-luxury-text/70">
                  {artwork.dimensions}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.2em] text-luxury-muted/50 mb-1">
                  Year
                </p>
                <p className="text-xs sm:text-sm font-sans text-luxury-text/70">
                  {artwork.year}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.2em] text-luxury-muted/50 mb-1">
                  Price
                </p>
                <p className="text-base sm:text-lg font-serif text-luxury-text font-light">
                  {artwork.price}
                </p>
              </div>
            </div>
          </StaggeredText>

          {/* description */}
          <StaggeredText delay={0.05 * index + 0.28}>
            <p className="font-sans text-xs sm:text-sm leading-relaxed text-luxury-muted/60 mb-8 line-clamp-3">
              {artwork.description}
            </p>
          </StaggeredText>

          {/* CTA */}
          <StaggeredText delay={0.05 * index + 0.34}>
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-luxury-accent text-luxury-dark font-sans text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-luxury-text">
                View Artwork
              </button>
              <button
                aria-label={`View ${artwork.title}`}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-luxury-text/15 flex items-center justify-center group/btn hover:border-luxury-accent hover:bg-luxury-accent transition-all duration-300"
              >
                <ArrowIcon />
              </button>
            </div>
          </StaggeredText>
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC NAV BUTTON
   ═══════════════════════════════════════════════════════════════ */
const NavButton = ({ direction, onClick, disabled }) => {
  const btnRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = useCallback(
    (e) => {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      x.set(dx * 0.35);
      y.set(dy * 0.35);
    },
    [x, y],
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={btnRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      disabled={disabled}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.9 }}
      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center transition-all duration-300 ${
        disabled
          ? 'border-luxury-text/10 text-luxury-text/15 cursor-not-allowed'
          : 'border-luxury-text/25 text-luxury-muted hover:border-luxury-accent hover:bg-luxury-accent hover:text-luxury-dark'
      }`}
      aria-label={direction === 'left' ? 'Previous artwork' : 'Next artwork'}
    >
      <svg
        className={`w-5 h-5 ${direction === 'left' ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </motion.button>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PREVIEW MODAL  (Shared Element Transition target)
   ═══════════════════════════════════════════════════════════════ */
const PreviewModal = ({ artwork, onClose }) => {
  // Zoom
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', esc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', esc);
    };
  }, [onClose]);

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in "${artwork.title}" by ${artwork.artist} (${artwork.price}). Could you share more details?`,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex"
      onClick={onClose}
    >
      {/* backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* modal body */}
      <motion.div
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        exit={{ y: 30 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex flex-col lg:flex-row w-full h-full max-h-screen overflow-auto"
      >
        {/* ── LEFT: image ── */}
        <div className="relative w-full lg:w-[60%] xl:w-[65%] bg-luxury-dark flex items-center justify-center p-4 sm:p-8 min-h-[50vh] lg:min-h-0">
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 z-30 w-11 h-11 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 flex items-center justify-center text-luxury-text hover:bg-luxury-accent hover:text-luxury-dark transition-all duration-300"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            layoutId={`image-${artwork.id}`}
            className={`relative overflow-hidden bg-luxury-neutral transition-all duration-500 ${
              zoomed
                ? 'w-full h-full cursor-zoom-out'
                : 'w-full max-w-2xl aspect-[3/4] cursor-zoom-in'
            }`}
            onClick={() => setZoomed((z) => !z)}
          >
            <motion.img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover"
              animate={{ scale: zoomed ? 1.6 : 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              draggable={false}
            />
          </motion.div>
        </div>

        {/* ── RIGHT: sidebar ── */}
        <div className="w-full lg:w-[40%] xl:w-[35%] bg-[#fafaf8] text-[#1a1a1a] flex flex-col">
          <div className="flex-1 overflow-y-auto px-7 sm:px-10 lg:px-12 py-10 lg:py-14">
            {/* breadcrumbs */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs text-[#999] font-sans tracking-wider mb-8"
            >
              <span className="hover:text-[#333] cursor-pointer transition-colors">Home</span>
              <span className="mx-2">/</span>
              <span className="hover:text-[#333] cursor-pointer transition-colors">Gallery</span>
              <span className="mx-2">/</span>
              <span className="text-[#555]">{artwork.title}</span>
            </motion.p>

            {/* category */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="inline-block text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[#d4af37] border border-[#d4af37]/30 px-3 py-1 mb-6"
            >
              {artwork.category}
            </motion.span>

            {/* title */}
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
              className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] leading-tight text-[#111] mb-3"
            >
              {artwork.title}
            </motion.h2>

            {/* artist */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
              className="font-sans text-base text-[#777] mb-6"
            >
              by <span className="text-[#333] font-medium">{artwork.artist}</span>
            </motion.p>

            {/* divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
              className="h-px bg-[#e0e0e0] mb-6 origin-left"
            />

            {/* metadata grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 gap-4 mb-6"
            >
              {[
                { label: 'Medium', value: artwork.medium },
                { label: 'Year', value: artwork.year },
                { label: 'Dimensions', value: artwork.dimensions },
                { label: 'Category', value: artwork.category },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-sans uppercase tracking-wider text-[#aaa] mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-sans text-[#333]">{item.value}</p>
                </div>
              ))}
            </motion.div>

            {/* description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="font-sans text-sm leading-relaxed text-[#666] mb-8"
            >
              {artwork.description}
            </motion.p>

            {/* price */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="flex items-baseline gap-3 mb-8"
            >
              <span className="font-serif text-3xl text-[#111]">{artwork.price}</span>
              <span className="text-xs font-sans text-[#aaa]">incl. of all taxes</span>
            </motion.div>

            {/* divider */}
            <div className="h-px bg-[#e0e0e0] mb-8" />

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="flex flex-col gap-3"
            >
              <button className="w-full py-4 bg-[#1a1a1a] text-white font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#d4af37] hover:text-[#1a1a1a]">
                Add to Cart
              </button>
              <a
                href={`https://wa.me/919876543210?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 border border-[#25D366] text-[#25D366] font-sans text-xs font-semibold tracking-[0.2em] uppercase text-center transition-all duration-300 hover:bg-[#25D366] hover:text-white flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire on WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT — FeaturedGallery
   ═══════════════════════════════════════════════════════════════ */
const FeaturedGallery = () => {
  const scrollRef = useRef(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ── scroll progress (for parallax + progress bar) ── */
  const scrollXProgress = useMotionValue(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    scrollXProgress.set(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
  }, [scrollXProgress]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  /* ── nav button handlers ── */
  const scrollBy = useCallback(
    (dir) => {
      const el = scrollRef.current;
      if (!el) return;
      // Each card is ~85-92vw; scroll by the actual card width
      const cards = el.querySelectorAll(':scope > div:not(:first-child):not(:last-child)');
      const cardWidth = cards[0]?.offsetWidth || window.innerWidth * 0.85;
      el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    },
    [],
  );

  /* ── progress bar width ── */
  const progressWidth = useTransform(scrollXProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="relative bg-luxury-dark h-screen flex flex-col overflow-hidden select-none">
      <CustomCursor isHoveringCard={isHoveringCard && !selectedArtwork} />

      {/* ── HEADER ── */}
      <div className="flex-shrink-0 px-6 sm:px-10 lg:px-16 pt-16 pb-6 sm:pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-luxury-accent font-sans text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3"
            >
              Zigguratss — Featured Collection
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-luxury-text leading-[0.95]"
            >
              Featured <span className="italic text-luxury-accent/70">Artworks</span>
            </motion.h2>
          </div>

          {/* nav arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <NavButton
              direction="left"
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft}
            />
            <NavButton
              direction="right"
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight}
            />
          </motion.div>
        </div>
      </div>

      {/* ── HORIZONTAL SCROLL TRACK ── */}
      <div className="flex-1 min-h-0">
        <div
          ref={scrollRef}
          className="flex h-full overflow-x-auto overflow-y-hidden pb-12 lg:cursor-none"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* left padding spacer */}
          <div className="flex-shrink-0 w-4 sm:w-6 lg:w-10" />

          {artworks.map((art, i) => (
            <ArtworkCard
              key={art.id}
              artwork={art}
              index={i}
              onSelect={setSelectedArtwork}
              onHover={setIsHoveringCard}
              scrollProgress={scrollXProgress}
            />
          ))}

          {/* right padding spacer */}
          <div className="flex-shrink-0 w-4 sm:w-6 lg:w-10" />
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="flex-shrink-0 mx-6 sm:mx-10 lg:mx-16 mb-10">
        <div className="flex items-center gap-4">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-luxury-muted/40">
            Scroll
          </span>
          <div className="flex-1 h-px bg-luxury-text/10 relative overflow-hidden">
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-luxury-accent/60 absolute left-0 top-0"
            />
          </div>
          <span className="font-sans text-xs text-luxury-muted/40">
            {artworks.length} works
          </span>
        </div>
      </div>

      {/* ── MODAL with Shared Element Transition ── */}
      <AnimatePresence>
        {selectedArtwork && (
          <PreviewModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedGallery;
