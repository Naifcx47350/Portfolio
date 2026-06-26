import { navSections } from '../data/sections';
import type { Locale, TranslationKeys } from '../data/i18n';

interface FooterProps {
  locale: Locale;
  t: TranslationKeys;
}

export function Footer({ locale, t }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <div className="section-container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-start">
          <p className="font-display text-sm font-semibold text-primary">{t.profile.name}</p>
          <p className="mt-1 font-mono text-xs text-muted" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            © {year} · {t.footer.copyright}
          </p>
        </div>
        <ul className="flex flex-wrap justify-center gap-5 sm:justify-end">
          {navSections.map(({ id, labelKey }) => (
            <li key={id}>
              <a href={`#${id}`} className="font-mono text-xs text-muted hover:text-accent">
                {t.nav[labelKey]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
