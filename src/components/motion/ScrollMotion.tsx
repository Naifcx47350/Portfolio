import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { viewportOnce } from '../../lib/animations';

type SlideDirection = 'left' | 'right' | 'up';

interface SlideRevealProps {
  children: ReactNode;
  /** Used to auto-alternate sides when no explicit direction is given. */
  index?: number;
  reducedMotion: boolean;
  className?: string;
  direction?: SlideDirection;
  /** Travel distance in px. Smaller = subtler offset. */
  distance?: number;
}

/**
 * Scroll-LINKED entrance: the element's offset/opacity are tied directly to the
 * scrollbar position, so the motion scrubs as you scroll the page. Driven by
 * MotionValues (useScroll/useTransform) + a spring for smoothing — these update
 * on the compositor without triggering React re-renders, so it stays at 60fps
 * and animates only transform + opacity.
 */
export function SlideReveal({
  children,
  index = 0,
  reducedMotion,
  className = '',
  direction,
  distance = 90,
}: SlideRevealProps) {
  const dir: SlideDirection = direction ?? (index % 2 === 0 ? 'left' : 'right');
  const ref = useRef<HTMLDivElement>(null);

  // 0 when the element's top enters the bottom of the viewport,
  // 1 when its top reaches the vertical center — fully settled and resting.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start center'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const offset = distance;
  let fromX = 0;
  if (dir === 'left') fromX = -offset;
  else if (dir === 'right') fromX = offset;
  const fromY = dir === 'up' ? offset : 0;

  const x = useTransform(progress, [0, 1], [fromX, 0]);
  const y = useTransform(progress, [0, 1], [fromY, 0]);
  const opacity = useTransform(progress, [0, 0.55], [0, 1]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, opacity, willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

interface MotionEyebrowProps {
  children: ReactNode;
  reducedMotion: boolean;
  className?: string;
}

export function MotionEyebrow({ children, reducedMotion, className = '' }: MotionEyebrowProps) {
  if (reducedMotion) {
    return <p className={className}>{children}</p>;
  }

  return (
    <motion.p
      className={className}
      initial={{ opacity: 0.4, letterSpacing: '0.35em' }}
      whileInView={{ opacity: 1, letterSpacing: '0.2em' }}
      viewport={viewportOnce}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.p>
  );
}
