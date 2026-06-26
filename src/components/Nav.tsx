import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { navSections } from '../data/sections';
import type { SectionId } from '../data/sections';
import { LiveClock } from './LiveClock';
import { ThemeToggle } from './ThemeToggle';
import { LocaleToggle } from './LocaleToggle';
import type { Theme } from '../hooks/useTheme';
import type { Locale } from '../hooks/useLocale';
import type { TranslationKeys } from '../data/i18n';

interface NavProps {
  activeSection: SectionId;
  theme: Theme;
  onToggleTheme: () => void;
  locale: Locale;
  onToggleLocale: () => void;
  t: TranslationKeys;
  hidden?: boolean;
  reducedMotion?: boolean;
}

export function Nav({
  activeSection,
  theme,
  onToggleTheme,
  locale,
  onToggleLocale,
  t,
  hidden = false,
  reducedMotion = false,
}: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-base/80 backdrop-blur-md"
      initial={false}
      animate={{
        y: hidden && !reducedMotion ? -72 : 0,
        opacity: hidden && !reducedMotion ? 0 : 1,
      }}
      transition={{ duration: reducedMotion ? 0.01 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: hidden && !reducedMotion ? 'none' : 'auto' }}
    >
      <nav
        className="section-container flex h-16 items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <div className="flex min-w-0 items-center gap-5 md:gap-8 lg:gap-10">
          <a
            href="#hero"
            className="flex shrink-0 items-center ps-1"
            aria-label={`${t.profile.name} — home`}
          >
            <img
              src={`${import.meta.env.BASE_URL}brand/${
                theme === 'dark' ? 'logo-dark' : 'logo-light'
              }.png`}
              alt="Naif Alsahabi logo"
              width={32}
              height={38}
              className="h-9 w-auto select-none transition-[opacity,transform] duration-200"
              draggable={false}
            />
          </a>

          <ul className="hidden items-center gap-4 md:flex lg:gap-6">
            {navSections.map(({ id, labelKey }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`font-sans text-sm transition-colors ${
                    activeSection === id ? 'text-accent' : 'text-muted hover:text-primary'
                  }`}
                  aria-current={activeSection === id ? 'true' : undefined}
                >
                  {t.nav[labelKey]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          <LiveClock />
          <LocaleToggle locale={locale} onToggle={onToggleLocale} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className="rounded-md border border-border p-2 text-muted md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-base md:hidden">
          <ul className="section-container flex flex-col gap-1 py-4">
            {navSections.map(({ id, labelKey }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2 text-sm ${
                    activeSection === id ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {t.nav[labelKey]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.header>
  );
}
