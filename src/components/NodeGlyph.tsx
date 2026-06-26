interface NodeGlyphProps {
  reducedMotion: boolean;
  className?: string;
}

/**
 * Tiny linked-node glyph that echoes the hero's particle network.
 * Used beside each section eyebrow so every section shares the same DNA.
 */
export function NodeGlyph({ reducedMotion, className = '' }: NodeGlyphProps) {
  const animate = !reducedMotion;
  return (
    <svg
      width="22"
      height="14"
      viewBox="0 0 22 14"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <line x1="3" y1="7" x2="11" y2="3" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <line x1="11" y1="3" x2="19" y2="8" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <line x1="3" y1="7" x2="11" y2="11" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <line x1="11" y1="11" x2="19" y2="8" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <circle cx="3" cy="7" r="1.6" fill="currentColor" className={animate ? 'glyph-node' : ''} />
      <circle cx="11" cy="3" r="1.6" fill="currentColor" className={animate ? 'glyph-node glyph-node-d1' : ''} />
      <circle cx="19" cy="8" r="1.6" fill="currentColor" className={animate ? 'glyph-node glyph-node-d2' : ''} />
      <circle cx="11" cy="11" r="1.6" fill="currentColor" className={animate ? 'glyph-node glyph-node-d3' : ''} />
    </svg>
  );
}
