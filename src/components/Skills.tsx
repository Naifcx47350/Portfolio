import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Share2 } from 'lucide-react';
import { skillCategoryOrder, skills } from '../data/skills';
import { techDescriptions } from '../data/techMeta';
import type { TranslationKeys } from '../data/i18n';
import type { Theme } from '../hooks/useTheme';
import { SlideReveal } from './motion/ScrollMotion';
import { TechLogo } from './TechLogo';
import { NodeGlyph } from './NodeGlyph';
import { SkillConstellation } from './SkillConstellation';

interface SkillsProps {
  reducedMotion: boolean;
  theme: Theme;
  t: TranslationKeys;
}

type ViewMode = 'node' | 'list';

export function Skills({ reducedMotion, theme, t }: SkillsProps) {
  const s = t.skills;
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('node');
  const timerRef = useRef<number>();

  // Selecting a tool lights it up + reveals its description temporarily.
  const select = (name: string) => {
    setSelected(name);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setSelected(null), 3200);
  };

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const fade = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
      };

  const description = (
    <AnimatePresence mode="wait" initial={false}>
      {selected && (
        <motion.div key={selected} className="tech-stage-card" {...fade}>
          <p className="font-display text-lg font-semibold text-primary sm:text-xl">{selected}</p>
          <p className="mt-1 text-sm text-muted sm:text-base">{techDescriptions[selected] ?? ''}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderList = () => (
    <div className="grid gap-6 sm:grid-cols-2">
      {skillCategoryOrder.map((key, index) => (
        <SlideReveal key={key} index={index} reducedMotion={reducedMotion} className="card-surface p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-accent">{s.categories[key]}</h3>
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {skills[key].map((name) => {
              const active = selected === name;
              return (
                <li key={name} className="list-none">
                  <button
                    type="button"
                    onClick={() => select(name)}
                    aria-label={`${name} — ${techDescriptions[name] ?? ''}`}
                    className={`tech-card flex w-full flex-col items-center gap-2 rounded-md border p-3 transition-colors duration-200 ${
                      active
                        ? 'border-accent bg-elevated shadow-glow'
                        : 'border-border bg-surface hover:border-accent/50 hover:bg-elevated'
                    }`}
                  >
                    <span className="flex size-11 items-center justify-center">
                      <TechLogo name={name} size={40} />
                    </span>
                    <span className="text-center font-mono text-[10px] leading-tight text-primary sm:text-[11px]">
                      {name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </SlideReveal>
      ))}
    </div>
  );

  return (
    <section id="skills" className="edge-accent py-24 sm:py-32">
      <div className="section-container">
        <div className="flex items-start justify-between gap-4">
          <SlideReveal reducedMotion={reducedMotion} direction="up">
            <p className="section-eyebrow mb-3 inline-flex items-center gap-2">
              <NodeGlyph reducedMotion={reducedMotion} />
              {s.index} — {s.label}
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {s.title}
            </h2>
          </SlideReveal>

          {/* View toggle: node graph (default) vs list */}
          <div className="mt-1 hidden shrink-0 rounded-md border border-border bg-surface p-0.5 md:inline-flex">
            <button
              type="button"
              onClick={() => setView('node')}
              aria-pressed={view === 'node'}
              aria-label="Graph view"
              className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                view === 'node' ? 'bg-elevated text-accent' : 'text-muted hover:text-primary'
              }`}
            >
              <Share2 size={13} aria-hidden="true" />
              Graph
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              aria-label="List view"
              className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                view === 'list' ? 'bg-elevated text-accent' : 'text-muted hover:text-primary'
              }`}
            >
              <LayoutGrid size={13} aria-hidden="true" />
              List
            </button>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          {view === 'node' ? (
            <div className="relative mt-4 h-[clamp(540px,64vh,680px)] w-full">
              <SkillConstellation
                reducedMotion={reducedMotion}
                theme={theme}
                t={t}
                selected={selected}
                onSelect={select}
              />
              {/* Description floats in the middle, just above the red line */}
              <div className="tech-stage-overlay" aria-live="polite">
                <div className="tech-stage-overlay-inner">
                  <div className="tech-stage-text">{description}</div>
                  <span className="tech-stage-line" aria-hidden="true" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <div className="tech-stage">
                <div className="tech-stage-text">{description}</div>
                <span className="tech-stage-line" aria-hidden="true" />
              </div>
              <div className="mt-6">{renderList()}</div>
            </div>
          )}
        </div>

        {/* Mobile: list with a description stage above */}
        <div className="mt-8 md:hidden">
          <div className="tech-stage" aria-live="polite">
            <div className="tech-stage-text">{description}</div>
            <span className="tech-stage-line" aria-hidden="true" />
          </div>
          <div className="mt-6">{renderList()}</div>
        </div>
      </div>
    </section>
  );
}
