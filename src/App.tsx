import { useCallback, useMemo, useState } from 'react';
import { About } from './components/About';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { IntroSequence, hasSeenIntro } from './components/IntroSequence';
import { Nav } from './components/Nav';
import { Projects } from './components/Projects';
import { ScrollProgress } from './components/ScrollProgress';
import { Skills } from './components/Skills';
import { sections } from './data/sections';
import { useActiveSection } from './hooks/useActiveSection';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const sectionIds = useMemo(() => sections.map((s) => s.id), []);
  const activeSection = useActiveSection(sectionIds);
  const [introComplete, setIntroComplete] = useState(
    () => reducedMotion || hasSeenIntro()
  );

  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      <ScrollProgress />
      <IntroSequence onComplete={handleIntroComplete} reducedMotion={reducedMotion} />
      <Nav activeSection={activeSection} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero reducedMotion={reducedMotion} introComplete={introComplete} />
        <About reducedMotion={reducedMotion} />
        <Projects reducedMotion={reducedMotion} />
        <Skills reducedMotion={reducedMotion} />
        <Certifications reducedMotion={reducedMotion} />
        <Contact reducedMotion={reducedMotion} />
      </main>
      <Footer />
    </>
  );
}

export default App;
