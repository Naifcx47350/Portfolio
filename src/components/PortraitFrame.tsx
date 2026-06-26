import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useState, type MouseEvent } from 'react';
import { publicAssetUrl } from '../lib/assets';
import { viewportOnce } from '../lib/animations';

const PORTRAIT_PATHS = ['profile/portrait.png', 'portrait.jpg', 'me.jpg'];

interface PortraitFrameProps {
  readonly reducedMotion: boolean;
}

const HUD_CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

export function PortraitFrame({ reducedMotion }: PortraitFrameProps) {
  const [pathIndex, setPathIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [live, setLive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position normalized 0..1 inside the card (no re-render on move).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 140, damping: 16, mass: 0.4 };
  const rotateY = useSpring(useTransform(px, [0, 1], [14, -14]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [-14, 14]), spring);
  const imgX = useSpring(useTransform(px, [0, 1], [10, -10]), spring);
  const imgY = useSpring(useTransform(py, [0, 1], [10, -10]), spring);

  const glowX = useTransform(px, (v) => `${(v * 100).toFixed(2)}%`);
  const glowY = useTransform(py, (v) => `${(v * 100).toFixed(2)}%`);
  const sheen = useMotionTemplate`radial-gradient(240px circle at ${glowX} ${glowY}, rgba(255,255,255,0.30), transparent 62%)`;
  const accent = useMotionTemplate`radial-gradient(300px circle at ${glowX} ${glowY}, rgba(224,50,43,0.45), transparent 66%)`;

  if (hidden || pathIndex >= PORTRAIT_PATHS.length) return null;

  const src = publicAssetUrl(PORTRAIT_PATHS[pathIndex]);
  const onImgError = () => {
    if (pathIndex + 1 < PORTRAIT_PATHS.length) setPathIndex((i) => i + 1);
    else setHidden(true);
  };

  if (reducedMotion) {
    return (
      <figure className="portrait-card card-surface">
        <img src={src} alt="Naif Alsahabi" className="portrait-img" onError={onImgError} />
        {HUD_CORNERS.map((c) => (
          <span key={c} className={`portrait-hud-corner ${c}`} aria-hidden="true" />
        ))}
      </figure>
    );
  }

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    setLive(false);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.figure
      className="portrait-3d"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        ref={ref}
        className={`portrait-card card-surface ${live ? 'is-live' : ''}`}
        onMouseMove={onMove}
        onMouseEnter={() => setLive(true)}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <motion.img
          src={src}
          alt="Naif Alsahabi"
          className="portrait-img"
          style={{ x: imgX, y: imgY, scale: 1.08 }}
          onError={onImgError}
        />

        <div className="portrait-scan" aria-hidden="true" />
        <motion.div className="portrait-layer portrait-sheen" style={{ background: sheen }} aria-hidden="true" />
        <motion.div className="portrait-layer portrait-accent" style={{ background: accent }} aria-hidden="true" />

        <motion.div
          className="portrait-revealbar"
          initial={{ top: '-14%', opacity: 0 }}
          whileInView={{ top: ['-14%', '112%'], opacity: [0, 1, 1, 0] }}
          viewport={viewportOnce}
          transition={{ duration: 1.15, ease: 'easeOut', delay: 0.3 }}
          aria-hidden="true"
        />

        {HUD_CORNERS.map((c) => (
          <span key={c} className={`portrait-hud-corner ${c}`} aria-hidden="true" />
        ))}

        <div className="portrait-status">
          <span className="portrait-status-dot" aria-hidden="true" />
          <span className="portrait-status-name font-display">Naif Alsahabi</span>
          <span className="portrait-status-tag">AI ENGINEER</span>
        </div>
      </motion.div>
    </motion.figure>
  );
}
