import { useEffect, useState } from 'react';
import { Award, Cpu, FolderGit2, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navSections } from '../data/sections';
import type { SectionId } from '../data/sections';
import type { Locale, TranslationKeys } from '../data/i18n';

const sectionIcons: Record<SectionId, typeof User> = {
  about: User,
  projects: FolderGit2,
  skills: Cpu,
  certifications: Award,
  contact: Mail,
};

interface SectionDockProps {
  visible: boolean;
  activeSection: SectionId;
  locale: Locale;
  reducedMotion: boolean;
  t: TranslationKeys;
}

/**
 * Progress mapped to the actual section anchors (not raw page scroll), so the
 * fill head sits exactly on the node of the section you're currently in.
 */
function useSectionProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const ids = navSections.map((sec) => sec.id);

    const update = () => {
      raf = 0;
      const ref = window.scrollY + window.innerHeight * 0.28;
      const tops = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Number.NaN;
      });
      const n = tops.length;
      let frac = 0;
      if (n > 1 && tops.every((v) => !Number.isNaN(v))) {
        if (ref <= tops[0]) {
          frac = 0;
        } else if (ref >= tops[n - 1]) {
          frac = 1;
        } else {
          for (let i = 0; i < n - 1; i++) {
            if (ref >= tops[i] && ref < tops[i + 1]) {
              const seg = (ref - tops[i]) / Math.max(1, tops[i + 1] - tops[i]);
              frac = (i + seg) / (n - 1);
              break;
            }
          }
        }
      }
      setProgress(Math.min(1, Math.max(0, frac)));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}

export function SectionDock({
  visible,
  activeSection,
  locale,
  reducedMotion,
  t,
}: SectionDockProps) {
  const side = locale === 'ar' ? 'left' : 'right';
  const progress = useSectionProgress();
  const count = navSections.length;
  const activeIndex = navSections.findIndex((s) => s.id === activeSection);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: side === 'right' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: side === 'right' ? 20 : -20 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.25 }}
          className={`fixed top-1/2 z-40 hidden -translate-y-1/2 md:block ${
            side === 'right' ? 'right-6 lg:right-9' : 'left-6 lg:left-9'
          }`}
          aria-label="Section quick navigation"
        >
          <div className="relative h-[clamp(280px,52vh,420px)] w-4">
            {/* Track */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border/70"
            />
            {/* Progress fill — the line that intersects the nodes = how far down the page you are */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-accent shadow-glow"
              style={{ height: `${progress * 100}%` }}
            />
            {/* Glowing head of the progress line */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-glow"
              style={{ top: `${progress * 100}%` }}
            />

            {navSections.map(({ id, labelKey }, i) => {
              const Icon = sectionIcons[id];
              const label = t.nav[labelKey];
              const frac = count > 1 ? i / (count - 1) : 0;
              const active = activeSection === id;
              const reached = i <= activeIndex;
              const top = `${frac * 100}%`;

              return (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-label={label}
                  aria-current={active ? 'true' : undefined}
                  style={{ top }}
                  className="group absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                >
                  {/* Node */}
                  <span
                    className={`relative z-[1] flex items-center justify-center rounded-full border bg-base transition-all duration-300 ${
                      active
                        ? 'size-7 border-accent text-accent shadow-glow'
                        : `size-5 ${
                            reached
                              ? 'border-accent/70 text-accent'
                              : 'border-border text-muted group-hover:border-accent/50 group-hover:text-primary'
                          }`
                    }`}
                  >
                    <Icon size={active ? 14 : 11} aria-hidden="true" className="shrink-0" />
                    {active && !reducedMotion && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-accent"
                        initial={{ opacity: 0.6, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.9 }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                        aria-hidden="true"
                      />
                    )}
                  </span>

                  {/* Label */}
                  <span
                    className={`pointer-events-none absolute whitespace-nowrap rounded-md border border-border/70 bg-surface/90 px-2 py-1 font-mono text-[11px] backdrop-blur-md transition-all duration-200 ${
                      side === 'right' ? 'right-full mr-3' : 'left-full ml-3'
                    } ${
                      active
                        ? 'text-accent opacity-100'
                        : 'text-muted opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100'
                    } ${active && side === 'right' ? 'translate-x-0' : ''}`}
                  >
                    {label}
                  </span>
                </a>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
