import { useEffect, useRef } from 'react';

interface HeroBackgroundProps {
  disabled?: boolean;
}

/** Soft red radial glow only — particles layer sits on top. */
export function HeroBackground({ disabled = false }: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let drift = 0;
    let glowX = 0.55;
    let glowY = 0.42;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const glow =
        getComputedStyle(document.documentElement).getPropertyValue('--accent-glow').trim() ||
        'rgba(224, 50, 43, 0.14)';

      ctx.clearRect(0, 0, w, h);
      drift += 0.0015;
      glowX = 0.55 + Math.sin(drift) * 0.06;
      glowY = 0.42 + Math.cos(drift * 0.8) * 0.05;

      const gradient = ctx.createRadialGradient(
        w * glowX,
        h * glowY,
        0,
        w * glowX,
        h * glowY,
        Math.max(w, h) * 0.65
      );
      gradient.addColorStop(0, glow);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    observer.observe(canvas);

    const onVis = () => {
      if (document.hidden) visibleRef.current = false;
      else visibleRef.current = true;
    };
    document.addEventListener('visibilitychange', onVis);

    resize();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      observer.disconnect();
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
