import { useEffect, useState } from "react";
import { Flame, Github } from "lucide-react";
import type { Theme } from "../hooks/useTheme";
import {
  fetchGitHubContributionStats,
  formatContributionDate,
  type GitHubContributionStats,
} from "../lib/githubStats";
import { SlideReveal } from "./motion/ScrollMotion";
import { NodeGlyph } from "./NodeGlyph";

const GITHUB_USER = "Naifcx47350";
const SNAKE_DARK = `https://raw.githubusercontent.com/${GITHUB_USER}/Portfolio/output/github-snake-dark.svg`;
const SNAKE_LIGHT = `https://raw.githubusercontent.com/${GITHUB_USER}/Portfolio/output/github-snake-light.svg`;
const STREAK_HOST = "https://my-streak-stats.vercel.app";
const STREAK_DARK = `${STREAK_HOST}/?user=${GITHUB_USER}&theme=dark&hide_border=true&date_format=d/m/[Y]&ring=E63950&fire=E63950&currStreakLabel=E63950&currStreakNum=FFFFFF&sideNums=FFFFFF&sideLabels=E4E2E2&dates=9E9E9E&background=0D0D0F`;
const STREAK_LIGHT = `${STREAK_HOST}/?user=${GITHUB_USER}&theme=light&hide_border=true&date_format=d/m/[Y]&ring=2B9FEF&fire=E056B8&currStreakLabel=2B9FEF&currStreakNum=132238&sideNums=132238&sideLabels=5A7494&dates=5A7494&background=FFFFFF`;

interface GitHubSnakeProps {
  theme: Theme;
  reducedMotion: boolean;
}

function StatColumn({
  label,
  value,
  detail,
  center,
}: {
  label: string;
  value: string | number;
  detail?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : "text-center sm:text-left"}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums text-primary sm:text-3xl">
        {value}
      </p>
      {detail ? (
        <p className="mt-1 font-mono text-[10px] text-muted">{detail}</p>
      ) : null}
    </div>
  );
}

function StreakRing({
  value,
  reducedMotion,
}: {
  value: number;
  reducedMotion: boolean;
}) {
  return (
    <div className="relative mx-auto flex h-20 w-20 items-center justify-center sm:mx-0">
      <svg
        viewBox="0 0 80 80"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${Math.min(value, 30) * 7.1} 220`}
          transform="rotate(-90 40 40)"
        />
      </svg>
      <Flame
        size={14}
        className={`absolute -top-0.5 text-accent ${reducedMotion ? "" : "animate-pulse"}`}
        aria-hidden="true"
      />
      <span className="relative font-display text-2xl font-bold tabular-nums text-primary">
        {value}
      </span>
    </div>
  );
}

function StatsBar({
  stats,
  statsLoading,
  reducedMotion,
  showFullFallback,
}: {
  stats: GitHubContributionStats | null;
  statsLoading: boolean;
  reducedMotion: boolean;
  showFullFallback: boolean;
}) {
  if (showFullFallback) return null;

  const totalDetail = statsLoading
    ? "Loading…"
    : stats
      ? `${formatContributionDate(stats.rangeStart)} – Present`
      : "Unavailable";
  const currentDetail =
    stats?.currentStreakEnd && stats.currentStreak > 0
      ? formatContributionDate(stats.currentStreakEnd)
      : stats && !statsLoading
        ? "—"
        : "";
  const longestDetail =
    stats?.longestStreakStart && stats.longestStreakEnd
      ? `${formatContributionDate(stats.longestStreakStart)} – ${formatContributionDate(stats.longestStreakEnd)}`
      : stats && !statsLoading
        ? "—"
        : "";

  return (
    <div className="relative z-[1] grid grid-cols-1 gap-4 border-t border-border px-2 py-4 sm:grid-cols-3 sm:gap-2 sm:px-4">
      <StatColumn
        label="Total contributions"
        value={statsLoading ? "…" : (stats?.total ?? "—")}
        detail={totalDetail}
        center
      />
      <div className="flex flex-col items-center justify-center sm:items-center">
        <StreakRing
          value={statsLoading ? 0 : (stats?.currentStreak ?? 0)}
          reducedMotion={reducedMotion}
        />
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-accent">
          Current streak
        </p>
        {currentDetail ? (
          <p className="mt-0.5 font-mono text-[10px] text-muted">
            {currentDetail}
          </p>
        ) : null}
      </div>
      <StatColumn
        label="Longest streak"
        value={statsLoading ? "…" : (stats?.longestStreak ?? "—")}
        detail={longestDetail}
        center
      />
    </div>
  );
}

export function GitHubSnake({ theme, reducedMotion }: GitHubSnakeProps) {
  const isDark = theme === "dark";
  const snakeSrc = isDark ? SNAKE_DARK : SNAKE_LIGHT;
  const streakSrc = isDark ? STREAK_DARK : STREAK_LIGHT;
  const [useStreakFallback, setUseStreakFallback] = useState(false);
  const [stats, setStats] = useState<GitHubContributionStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setUseStreakFallback(false);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    setStatsLoading(true);
    fetchGitHubContributionStats(GITHUB_USER).then((data) => {
      if (cancelled) return;
      setStats(data);
      setStatsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const imgSrc = useStreakFallback ? streakSrc : snakeSrc;

  return (
    <section id="activity" className="py-12">
      <div className="section-container">
        <SlideReveal reducedMotion={reducedMotion} direction="up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-eyebrow mb-1.5 inline-flex items-center gap-2">
                <NodeGlyph reducedMotion={reducedMotion} />
                GitHub
              </p>
              <h2 className="font-display text-lg font-bold tracking-tight text-primary sm:text-xl">
                Contribution activity
              </h2>
            </div>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex text-xs"
            >
              <Github size={14} aria-hidden="true" />@{GITHUB_USER}
            </a>
          </div>

          <div className="card-surface relative mt-5 overflow-hidden px-2 py-3 sm:px-3 sm:py-4">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent" />
            <div className="relative z-[1] w-full overflow-hidden">
              <img
                key={`${theme}-${useStreakFallback ? "streak" : "snake"}`}
                src={imgSrc}
                alt={
                  useStreakFallback
                    ? "GitHub contribution streak"
                    : "GitHub contribution snake"
                }
                className="mx-auto w-full max-w-2xl origin-center scale-[1.04] sm:scale-[1.06]"
                loading="lazy"
                onError={
                  useStreakFallback
                    ? undefined
                    : () => setUseStreakFallback(true)
                }
              />
            </div>
            <StatsBar
              stats={stats}
              statsLoading={statsLoading}
              reducedMotion={reducedMotion}
              showFullFallback={useStreakFallback}
            />
          </div>
        </SlideReveal>
      </div>
    </section>
  );
}
