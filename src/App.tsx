import { useCallback, useMemo, useState } from 'react';
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { GitHubSnake } from './components/GitHubSnake';
import { Hero } from './components/Hero';
import { IntroSequence, hasSeenIntro } from './components/IntroSequence';
import { Nav } from './components/Nav';
import { Projects } from './components/Projects';
import { ScrollProgress } from './components/ScrollProgress';
import { SectionDock } from './components/SectionDock';
import { Skills } from './components/Skills';
import { sectionIds } from './data/sections';
import { useActiveSection } from './hooks/useActiveSection';
import { useLocale } from './hooks/useLocale';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useScrollHeader } from './hooks/useScrollHeader';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();
  const reducedMotion = useReducedMotion();
  const { hidden: headerHidden, showDock } = useScrollHeader();
  const ids = useMemo(() => [...sectionIds], []);
  const activeSection = useActiveSection(ids);
  const [introComplete, setIntroComplete] = useState(
    () => reducedMotion || hasSeenIntro()
  );

  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollProgress />
      <IntroSequence
        onComplete={handleIntroComplete}
        reducedMotion={reducedMotion}
        theme={theme}
        t={t}
      />
      <Nav
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={toggleTheme}
        locale={locale}
        onToggleLocale={toggleLocale}
        t={t}
        hidden={headerHidden}
        reducedMotion={reducedMotion}
      />
      <SectionDock
        visible={showDock}
        activeSection={activeSection}
        locale={locale}
        reducedMotion={reducedMotion}
        t={t}
      />
      <main className="overflow-x-clip">
        <Hero
          reducedMotion={reducedMotion}
          introComplete={introComplete}
          theme={theme}
          t={t}
        />
        <About reducedMotion={reducedMotion} locale={locale} t={t} />
        <Projects reducedMotion={reducedMotion} locale={locale} t={t} />
        <Skills reducedMotion={reducedMotion} theme={theme} t={t} />
        <Certifications reducedMotion={reducedMotion} t={t} />
        <Contact reducedMotion={reducedMotion} t={t} />
        <GitHubSnake theme={theme} reducedMotion={reducedMotion} />
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}

export default App;
