import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { sections } from '../data/sections';
import type { SectionId } from '../data/sections';
import { profile } from '../data/profile';
import { LiveClock } from './LiveClock';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';

interface NavProps {
  activeSection: SectionId;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Nav({ activeSection, theme, onToggleTheme }: NavProps) {
  const [open, setOpen] = useState(false);

  const handleNavClick = () => setOpen(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-base/80 backdrop-blur-md">
      <nav
        className="section-container flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        <a
          href="#hero"
          className="font-display text-sm font-semibold tracking-tight text-primary sm:text-base"
        >
          {profile.name.split(' ')[0]}
          <span className="text-accent">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-6">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`font-sans text-sm transition-colors ${
                    activeSection === id
                      ? 'text-accent'
                      : 'text-muted hover:text-primary'
                  }`}
                  aria-current={activeSection === id ? 'true' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <LiveClock />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LiveClock />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className="rounded-md border border-border p-2 text-muted"
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
            {sections.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={handleNavClick}
                  className={`block py-2 text-sm ${
                    activeSection === id ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
