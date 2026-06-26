import {
  Activity,
  AlignLeft,
  BookOpen,
  Droplet,
  Library,
  Mail,
  ScanText,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import type { Project, ProjectIcon } from '../data/projects';
import { publicAssetUrl } from '../lib/assets';

const iconMap: Record<ProjectIcon, LucideIcon> = {
  sprout: Sprout,
  droplet: Droplet,
  'scan-text': ScanText,
  'book-open': BookOpen,
  activity: Activity,
  'align-left': AlignLeft,
  mail: Mail,
  library: Library,
};

// Deterministic string hash → seed.
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 PRNG — deterministic per seed.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ProjectBannerProps {
  project: Project;
  featured?: boolean;
}

const W = 160;
const H = 90;

export function ProjectBanner({ project, featured = false }: ProjectBannerProps) {
  const Icon = iconMap[project.icon];
  const seedBase = hashString(project.slug);

  // Real screenshot takes precedence over the procedural banner.
  if (project.image) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-md border border-border ${
          featured ? 'aspect-[16/9]' : 'aspect-[16/7]'
        }`}
      >
        <img
          src={publicAssetUrl(project.image)}
          alt={`${project.title} preview`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const rand = mulberry32(seedBase);
  const gradId = `bg-${project.slug}`;
  const glowId = `glow-${project.slug}`;

  // Faint circuit traces in --border.
  const traces = Array.from({ length: 5 }, () => {
    const y = 12 + rand() * (H - 24);
    const x1 = rand() * (W * 0.45);
    const x2 = W * 0.55 + rand() * (W * 0.45);
    const branch = 8 + rand() * 24;
    return { y, x1, x2, branch, node: rand() > 0.45 };
  });

  // One restrained red accent trace.
  const accentY = 20 + rand() * (H - 40);
  const accentMid = W * 0.35 + rand() * (W * 0.3);
  const accentDrop = accentY + (rand() > 0.5 ? 1 : -1) * (12 + rand() * 20);
  const glowX = W * 0.55 + rand() * (W * 0.3);
  const glowY = 20 + rand() * (H - 40);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md border border-border ${
        featured ? 'aspect-[16/9]' : 'aspect-[16/7]'
      }`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label={`${project.title} banner`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--bg-elevated)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--bg-base)' }} />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: 'var(--accent-glow)' }} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill={`url(#${gradId})`} />

        {/* ambient red glow */}
        <circle cx={glowX} cy={glowY} r={48} fill={`url(#${glowId})`} />

        {/* faint dot grid */}
        <g style={{ fill: 'var(--border)' }} opacity={0.5}>
          {Array.from({ length: Math.ceil(W / 12) + 1 }).map((_, col) =>
            Array.from({ length: Math.ceil(H / 12) + 1 }).map((__, row) => (
              <circle key={`${col}-${row}`} cx={col * 12} cy={row * 12} r={0.5} />
            ))
          )}
        </g>

        {/* circuit traces */}
        <g
          style={{ stroke: 'var(--border)' }}
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
        >
          {traces.map((t) => (
            <g key={`${t.x1.toFixed(2)}-${t.y.toFixed(2)}`}>
              <path d={`M ${t.x1} ${t.y} H ${t.x2}`} />
              <path d={`M ${t.x2} ${t.y} v ${t.branch}`} />
              {t.node && (
                <circle cx={t.x2} cy={t.y + t.branch} r={1.5} style={{ fill: 'var(--border)' }} stroke="none" />
              )}
            </g>
          ))}
        </g>

        {/* accent trace */}
        <g style={{ stroke: 'var(--accent)' }} strokeWidth={1.5} fill="none" strokeLinecap="round">
          <path d={`M 0 ${accentY} H ${accentMid} V ${accentDrop} H ${W}`} />
          <circle cx={accentMid} cy={accentDrop} r={2} style={{ fill: 'var(--accent)' }} stroke="none" />
        </g>
      </svg>

      {/* domain glyph */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-5">
        <Icon
          className="text-accent opacity-30"
          size={featured ? 56 : 40}
          strokeWidth={1.25}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
