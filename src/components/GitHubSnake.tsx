import { useState } from 'react';
import { Github } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import { SlideReveal } from './motion/ScrollMotion';
import { NodeGlyph } from './NodeGlyph';

const GITHUB_USER = 'Naifcx47350';
const SNAKE_DARK = `https://raw.githubusercontent.com/${GITHUB_USER}/Portfolio/output/github-snake-dark.svg`;
const SNAKE_LIGHT = `https://raw.githubusercontent.com/${GITHUB_USER}/Portfolio/output/github-snake-light.svg`;
const STREAK_DARK = `https://streak-stats.demolab.com/?user=${GITHUB_USER}&theme=dark&hide_border=true&background=00000000&ring=E0322B&fire=E0322B&currStreakLabel=E0322B&sideLabels=ffffff&dates=ffffff`;
const STREAK_LIGHT = `https://streak-stats.demolab.com/?user=${GITHUB_USER}&theme=light&hide_border=true&background=00000000&ring=C42820&fire=C42820&currStreakLabel=C42820`;

interface GitHubSnakeProps {
  theme: Theme;
  reducedMotion: boolean;
}

export function GitHubSnake({ theme, reducedMotion }: GitHubSnakeProps) {
  const isDark = theme === 'dark';
  const snakeSrc = isDark ? SNAKE_DARK : SNAKE_LIGHT;
  const streakSrc = isDark ? STREAK_DARK : STREAK_LIGHT;
  const [useStreakFallback, setUseStreakFallback] = useState(false);

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
              <Github size={14} aria-hidden="true" />
              @{GITHUB_USER}
            </a>
          </div>

          <div className="card-surface relative mt-5 overflow-hidden p-3 sm:p-4">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent" />
            <img
              src={useStreakFallback ? streakSrc : snakeSrc}
              alt={useStreakFallback ? 'GitHub contribution streak' : 'GitHub contribution snake'}
              className="relative z-[1] mx-auto w-full max-w-xl"
              loading="eager"
              onError={useStreakFallback ? undefined : () => setUseStreakFallback(true)}
            />
          </div>
        </SlideReveal>
      </div>
    </section>
  );
}
