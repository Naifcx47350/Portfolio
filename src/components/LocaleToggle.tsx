import type { Locale } from '../hooks/useLocale';

interface LocaleToggleProps {
  locale: Locale;
  onToggle: () => void;
}

export function LocaleToggle({ locale, onToggle }: LocaleToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-md border border-border px-2 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-primary"
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      {locale === 'en' ? 'AR' : 'EN'}
    </button>
  );
}
