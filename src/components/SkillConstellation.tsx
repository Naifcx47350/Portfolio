import { useEffect, useMemo, useRef } from 'react';
import { skillCategoryOrder, skills } from '../data/skills';
import type { SkillCategory } from '../data/skills';
import type { TranslationKeys } from '../data/i18n';
import type { Theme } from '../hooks/useTheme';
import { TechLogo } from './TechLogo';

interface SkillConstellationProps {
  reducedMotion: boolean;
  theme: Theme;
  t: TranslationKeys;
  selected: string | null;
  onSelect: (name: string) => void;
}

const REGIONS: Record<SkillCategory, [number, number]> = {
  languages: [0.16, 0.22],
  aiMl: [0.84, 0.2],
  frameworks: [0.17, 0.8],
  apps: [0.83, 0.8],
};

interface NodeMeta {
  id: string;
  cat: SkillCategory;
  label: string;
  hub: boolean;
  phase: number;
  amp: number;
}

function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

const THEME_FALLBACK = {
  dark: { line: '#A1A1A6', accent: '#E0322B' },
  light: { line: '#5A7494', accent: '#2B9FEF' },
} as const;

function themeColors(theme: Theme) {
  const fb = THEME_FALLBACK[theme];
  return {
    line: cssVar('--text-muted', fb.line),
    accent: cssVar('--accent', fb.accent),
  };
}

export function SkillConstellation({
  reducedMotion,
  theme,
  t,
  selected,
  onSelect,
}: SkillConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);
  const hoveredRef = useRef(-1);
  const selectedRef = useRef<string | null>(selected);
  selectedRef.current = selected;

  // Stable node + link model.
  const { nodes, links, nameToIndex } = useMemo(() => {
    const list: NodeMeta[] = [];
    const linkPairs: [number, number][] = [];
    const hubIndex: Partial<Record<SkillCategory, number>> = {};

    skillCategoryOrder.forEach((cat) => {
      const hubI = list.length;
      hubIndex[cat] = hubI;
      list.push({
        id: `hub-${cat}`,
        cat,
        label: t.skills.categories[cat],
        hub: true,
        phase: Math.random() * Math.PI * 2,
        amp: 3,
      });
      skills[cat].forEach((name, k) => {
        const idx = list.length;
        list.push({
          id: name,
          cat,
          label: name,
          hub: false,
          phase: Math.random() * Math.PI * 2,
          amp: 5 + Math.random() * 3,
        });
        linkPairs.push([hubI, idx]);
        if (k > 0) linkPairs.push([idx - 1, idx]);
      });
    });

    const hubs = skillCategoryOrder.map((c) => hubIndex[c]!);
    for (let i = 0; i < hubs.length; i++) {
      linkPairs.push([hubs[i], hubs[(i + 1) % hubs.length]]);
    }

    const map = new Map<string, number>();
    list.forEach((n, i) => map.set(n.id, i));

    return { nodes: list, links: linkPairs, nameToIndex: map };
  }, [t]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let colors = themeColors(theme);

    let width = 1;
    let height = 1;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const baseX = new Float32Array(nodes.length);
    const baseY = new Float32Array(nodes.length);
    const posX = new Float32Array(nodes.length);
    const posY = new Float32Array(nodes.length);

    const layout = () => {
      const scale = Math.min(1.45, Math.max(0.82, Math.min(width, height) / 660));
      const hubGap = 54 * scale;
      const step = 31 * scale;
      const padX = 80;
      const padY = 60;

      skillCategoryOrder.forEach((cat) => {
        const [fx, fy] = REGIONS[cat];
        const cx = fx * width;
        const cy = fy * height;
        let placed = 0;
        nodes.forEach((n, i) => {
          if (n.cat !== cat) return;
          if (n.hub) {
            baseX[i] = cx;
            baseY[i] = cy;
          } else {
            const angle = placed * 2.39996 + (fx < 0.5 ? 0.5 : -0.5);
            const radius = hubGap + step * Math.sqrt(placed + 1);
            baseX[i] = cx + Math.cos(angle) * radius;
            baseY[i] = cy + Math.sin(angle) * radius * 0.85;
            placed++;
          }
          baseX[i] = Math.min(width - padX, Math.max(padX, baseX[i]));
          baseY[i] = Math.min(height - padY, Math.max(padY, baseY[i]));
        });
      });
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    };

    // Pointer parallax
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (mx < 0 || my < 0 || mx > width || my > height) {
        parallax.tx = 0;
        parallax.ty = 0;
        return;
      }
      parallax.tx = (mx / width - 0.5) * 16;
      parallax.ty = (my / height - 0.5) * 16;
    };

    const isLit = (a: number, b: number): boolean => {
      const h = hoveredRef.current;
      const sel = selectedRef.current ? nameToIndex.get(selectedRef.current) ?? -1 : -1;
      return a === h || b === h || a === sel || b === sel;
    };

    const draw = () => {
      // Re-read each frame so toggling theme updates link colors immediately.
      colors = themeColors(theme);
      ctx.clearRect(0, 0, width, height);
      for (const [a, b] of links) {
        const lit = isLit(a, b);
        ctx.beginPath();
        ctx.moveTo(posX[a], posY[a]);
        ctx.lineTo(posX[b], posY[b]);
        ctx.strokeStyle = lit ? colors.accent : colors.line;
        ctx.globalAlpha = lit ? 0.95 : 0.5;
        ctx.lineWidth = lit ? 1.4 : 0.9;
        ctx.shadowBlur = lit ? 8 : 0;
        ctx.shadowColor = lit ? colors.accent : 'transparent';
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const place = (time: number) => {
      parallax.x += (parallax.tx - parallax.x) * 0.06;
      parallax.y += (parallax.ty - parallax.y) * 0.06;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const depth = n.hub ? 0.4 : 1;
        let x = baseX[i];
        let y = baseY[i];
        if (!reducedMotion) {
          x += Math.sin(time * 0.5 + n.phase) * n.amp + parallax.x * depth;
          y += Math.cos(time * 0.42 + n.phase) * n.amp + parallax.y * depth;
        }
        posX[i] = x;
        posY[i] = y;
        const el = nodeRefs.current[i];
        if (el) el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      draw();
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      place(0);
    });
    ro.observe(container);

    let raf = 0;
    let inView = true;
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
    });
    io.observe(container);

    if (reducedMotion) {
      place(0);
      // Redraw links when hover/selection changes (handlers call redraw()).
      (container as HTMLElement & { _redraw?: () => void })._redraw = draw;
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      const start = performance.now();
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!inView || document.hidden) return;
        place((performance.now() - start) / 1000);
      };
      raf = requestAnimationFrame(loop);
    }

    // Sync once on mount / theme change (reduced-motion path has no animation loop).
    colors = themeColors(theme);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [reducedMotion, theme, nodes, links, nameToIndex]);

  const redraw = () => {
    const c = containerRef.current as (HTMLElement & { _redraw?: () => void }) | null;
    c?._redraw?.();
  };

  // In reduced-motion mode there is no animation loop, so redraw links when the
  // selection changes (the animated path redraws every frame anyway).
  useEffect(() => {
    redraw();
  }, [selected]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full" />
      {nodes.map((n, i) =>
        n.hub ? (
          <div
            key={n.id}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            className="constellation-hub absolute left-0 top-0 z-10"
          >
            {n.label}
          </div>
        ) : (
          <button
            key={n.id}
            type="button"
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            onClick={() => onSelect(n.id)}
            onPointerEnter={() => {
              hoveredRef.current = i;
              redraw();
            }}
            onPointerLeave={() => {
              hoveredRef.current = -1;
              redraw();
            }}
            onFocus={() => {
              hoveredRef.current = i;
              redraw();
            }}
            onBlur={() => {
              hoveredRef.current = -1;
              redraw();
            }}
            aria-pressed={selected === n.id}
            aria-label={n.label}
            className={`tech-card constellation-node absolute left-0 top-0 z-10 flex flex-col items-center gap-1.5 rounded-lg p-2 ${
              selected === n.id ? 'is-selected' : ''
            }`}
          >
            <span className="flex size-11 items-center justify-center">
              <TechLogo name={n.id} size={38} />
            </span>
            <span className="constellation-label font-mono text-[10px] leading-none text-muted">
              {n.label}
            </span>
          </button>
        )
      )}
    </div>
  );
}
