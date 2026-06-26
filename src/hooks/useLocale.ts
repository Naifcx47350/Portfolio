import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '../data/i18n';
import { getT } from '../data/i18n';

const STORAGE_KEY = 'portfolio-locale';

function getInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored === 'en' || stored === 'ar') return stored;
  return 'en';
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const t = getT(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(
    () => setLocaleState((prev) => (prev === 'en' ? 'ar' : 'en')),
    []
  );

  return { locale, setLocale, toggleLocale, t };
}

export type { Locale };
