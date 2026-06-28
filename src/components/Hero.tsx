import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import { socials } from '../data/profile';
import { HeroCodeBlock } from './HeroCodeBlock';
import { HeroBackground } from './HeroBackground';
import { LatentField } from './LatentField';
import { useMagnetic } from '../hooks/useMagnetic';
import type { Theme } from '../hooks/useTheme';
import type { TranslationKeys } from '../data/i18n';
import { getRevealVariants, staggerContainer } from '../lib/animations';

interface HeroProps {
  reducedMotion: boolean;
  introComplete: boolean;
  theme: Theme;
  t: TranslationKeys;
}

function MagneticLink({
  href,
  children,
  className,
  ariaLabel,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  disabled?: boolean;
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useMagnetic({ disabled });

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
      className={className}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.2s ease-out' }}
    >
      {children}
    </a>
  );
}

function MagneticButton({
  href,
  children,
  className,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useMagnetic({ disabled });

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.2s ease-out' }}
    >
      {children}
    </a>
  );
}

export function Hero({ reducedMotion, introComplete, theme, t }: HeroProps) {
  const variants = getRevealVariants(reducedMotion);
  const magneticDisabled = reducedMotion;
  const p = t.profile;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen touch-pan-y items-center overflow-hidden pt-24 pb-16"
      aria-label="Introduction"
    >
      <HeroBackground disabled={reducedMotion} />
      <LatentField theme={theme} reducedMotion={reducedMotion} />
      <div className="hero-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

      <div className="section-container relative z-10">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between xl:gap-12">
          <motion.div
            initial="hidden"
            animate={introComplete ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="min-w-0 max-w-3xl flex-1 select-none"
          >
            <motion.p variants={variants} className="section-eyebrow mb-4">
              {p.role}
            </motion.p>

            <motion.h1
              variants={variants}
              className="whitespace-nowrap font-display text-5xl font-bold tracking-tight text-primary sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {p.name}
            </motion.h1>

            <motion.p
              variants={variants}
              className="mt-4 max-w-2xl font-mono text-sm sm:text-base"
              style={{ color: 'var(--accent)' }}
            >
              {p.roleLine}
            </motion.p>

            <motion.p
              variants={variants}
              className="body-text mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: 'var(--text-muted)' }}
            >
              {p.tagline}
            </motion.p>

            <motion.div variants={variants} className="relative z-10 mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton href="#projects" className="btn-primary" disabled={magneticDisabled}>
                {t.hero.viewProjects}
                <ArrowDown size={16} aria-hidden="true" />
              </MagneticButton>
              <MagneticButton
                href={`${import.meta.env.BASE_URL}resume.pdf`}
                className="btn-secondary"
                disabled={magneticDisabled}
              >
                <Download size={16} aria-hidden="true" />
                {t.hero.downloadResume}
              </MagneticButton>
            </motion.div>

            <motion.div variants={variants} className="relative z-10 mt-10 flex items-center gap-4">
              <MagneticLink
                href={socials.github}
                className="rounded-md border border-border p-2.5 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                ariaLabel="GitHub profile"
                disabled={magneticDisabled}
              >
                <Github size={20} />
              </MagneticLink>
              <MagneticLink
                href={socials.linkedin}
                className="rounded-md border border-border p-2.5 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                ariaLabel="LinkedIn profile"
                disabled={magneticDisabled}
              >
                <Linkedin size={20} />
              </MagneticLink>
              <MagneticLink
                href={socials.email}
                className="rounded-md border border-border p-2.5 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                ariaLabel="Send email"
                disabled={magneticDisabled}
              >
                <Mail size={20} />
              </MagneticLink>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={introComplete ? 'visible' : 'hidden'}
            variants={variants}
            className="relative z-[6] w-full shrink-0 select-none xl:max-w-md xl:pt-8"
          >
            <HeroCodeBlock reducedMotion={reducedMotion} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
