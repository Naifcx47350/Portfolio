import type { Variants } from 'framer-motion';

// Slide-up reveal only — never animate opacity on body text (stagger was
// leaving later items stuck at opacity 0, making muted text invisible).
export const fadeUp: Variants = {
  hidden: { y: 16 },
  visible: {
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeUpReduced: Variants = {
  hidden: { y: 0 },
  visible: { y: 0 },
};

// Headings / eyebrows may still fade in.
export const fadeUpWithOpacity: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const introDuration = 3.2;

export function getRevealVariants(reducedMotion: boolean): Variants {
  return reducedMotion ? fadeUpReduced : fadeUp;
}

export const viewportOnce = { once: true, margin: '-80px' as const };
