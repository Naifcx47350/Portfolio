import { useEffect, useRef } from 'react';

interface HeroBackgroundProps {
  disabled?: boolean;
}

export function HeroBackground({ disabled = false }: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let glowX = 0.5;
    let glowY = 0.4;
    let drift = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getColors = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        border: styles.getPropertyValue('--border').trim() || '#26262b',
        glow: styles.getPropertyValue('--accent-glow').trim() || 'rgba(224, 50, 43, 0.14)',
      };
    };

    const draw = () => {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { border, glow } = getColors();

      ctx.clearRect(0, 0, w, h);

      drift += 0.002;
      glowX = 0.5 + Math.sin(drift) * 0.08 + mouseRef.current.x * 0.02;
      glowY = 0.4 + Math.cos(drift * 0.7) * 0.06 + mouseRef.current.y * 0.02;

      const gradient = ctx.createRadialGradient(
        w * glowX,
        h * glowY,
        0,
        w * glowX,
        h * glowY,
        Math.max(w, h) * 0.55
      );
      gradient.addColorStop(0, glow);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const spacing = 48;
      const offsetX = mouseRef.current.x * 4;
      const offsetY = mouseRef.current.y * 4;

      ctx.strokeStyle = border;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;

      for (let x = (offsetX % spacing) - spacing; x < w + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = (offsetY % spacing) - spacing; y < h + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      /* redraw picks up new CSS vars on next frame */
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    resize();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 h-full w-full opacity-80"
      aria-hidden="true"
    />
  );
}
