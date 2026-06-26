import { useRef } from 'react';
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  reducedMotion: boolean;
  /** Max tilt in degrees. */
  max?: number;
}

/**
 * Magnetic depth + cursor-tracked accent glow on hover.
 * Tilts toward the pointer and lights a radial glow at the cursor — echoes the
 * hero's interactive feel. Animation only; content stays fully readable.
 */
export function TiltCard({ children, className = '', reducedMotion, max = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    el.style.transform = `perspective(820px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  };

  return (
    <div
      ref={ref}
      className={`tilt-card relative rounded-lg ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
      <span className="tilt-glow" aria-hidden="true" />
    </div>
  );
}
