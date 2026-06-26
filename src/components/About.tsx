import { MapPin } from 'lucide-react';
import { profile } from '../data/profile';
import type { Locale, TranslationKeys } from '../data/i18n';
import { Timeline } from './Timeline';
import { PortraitFrame } from './PortraitFrame';
import { SlideReveal } from './motion/ScrollMotion';
import { NodeGlyph } from './NodeGlyph';

interface AboutProps {
  reducedMotion: boolean;
  locale: Locale;
  t: TranslationKeys;
}

export function About({ reducedMotion, locale, t }: AboutProps) {
  const a = t.about;
  const p = t.profile;

  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="section-container">
        <SlideReveal reducedMotion={reducedMotion} direction="up">
          <p className="section-eyebrow mb-3 inline-flex items-center gap-2">
            <NodeGlyph reducedMotion={reducedMotion} />
            {a.index} — {a.label}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {a.title}
          </h2>
        </SlideReveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <SlideReveal reducedMotion={reducedMotion} direction="left" className="space-y-5">
            {p.about.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="body-text leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                {paragraph}
              </p>
            ))}

            <div>
              <h3 className="font-display text-sm font-semibold text-primary">{a.focusTitle}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.focusAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-primary"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted">
              <MapPin size={16} className="shrink-0 text-accent" aria-hidden="true" />
              <span>
                {a.location}: <span className="text-primary">{p.location}</span>
              </span>
            </div>
          </SlideReveal>

          <SlideReveal reducedMotion={reducedMotion} direction="right" className="space-y-6">
            <PortraitFrame reducedMotion={reducedMotion} />
            <div className="card-surface p-6">
              <h3 className="font-display text-lg font-semibold text-primary">{a.education}</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-accent">{a.degree}</dt>
                  <dd className="mt-1 text-primary">{p.education.degree}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-accent">{a.university}</dt>
                  <dd className="mt-1">{p.education.school}</dd>
                </div>
                <div className="flex gap-8">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-accent">{a.gpa}</dt>
                    <dd className="mt-1 font-mono text-primary">{profile.education.gpa}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-accent">{a.graduated}</dt>
                    <dd className="mt-1">{p.education.graduated}</dd>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <dt className="font-mono text-xs uppercase tracking-wider text-accent">{a.current}</dt>
                  <dd className="mt-1 text-primary">{p.education.bootcamp}</dd>
                </div>
              </dl>
            </div>
          </SlideReveal>
        </div>

        <Timeline reducedMotion={reducedMotion} locale={locale} title={a.timelineTitle} />
      </div>
    </section>
  );
}
