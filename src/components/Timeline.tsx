import { timeline } from '../data/timeline';
import type { Locale } from '../data/i18n';
import { SlideReveal } from './motion/ScrollMotion';

interface TimelineProps {
  reducedMotion: boolean;
  locale: Locale;
  title: string;
}

export function Timeline({ reducedMotion, locale, title }: TimelineProps) {
  const entries = timeline[locale];

  return (
    <div className="mt-16">
      <SlideReveal reducedMotion={reducedMotion} direction="up">
        <h3 className="font-display text-xl font-semibold text-primary">{title}</h3>
      </SlideReveal>
      <ol className="mt-8 space-y-0">
        {entries.map((entry) => (
          <li key={`${entry.year}-${entry.title}`}>
            <SlideReveal
              reducedMotion={reducedMotion}
              direction="up"
              distance={28}
              className="grid grid-cols-[3.25rem_1fr] gap-x-4 pb-8 last:pb-0 sm:grid-cols-[4rem_1fr] sm:gap-x-6"
            >
              <div className="pt-1 text-end font-mono text-xs text-accent">{entry.year}</div>
              <div className="relative border-s border-border ps-6">
                <span
                  className="absolute -start-[5px] top-2 size-2.5 rounded-full border-2 border-accent bg-base"
                  aria-hidden="true"
                />
                <p className="font-display font-semibold text-primary">{entry.title}</p>
                {entry.org && <p className="text-sm text-muted">{entry.org}</p>}
                {entry.detail && (
                  <p
                    className="body-text mt-1 whitespace-pre-line text-sm"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {entry.detail}
                  </p>
                )}
              </div>
            </SlideReveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
