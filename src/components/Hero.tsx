import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import { profile, socials } from '../data/profile';
import { HeroBackground } from './HeroBackground';
import { useMagnetic } from '../hooks/useMagnetic';
import { getRevealVariants, staggerContainer } from '../lib/animations';

interface HeroProps {
  reducedMotion: boolean;
  introComplete: boolean;
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

export function Hero({ reducedMotion, introComplete }: HeroProps) {
  const variants = getRevealVariants(reducedMotion);
  const magneticDisabled = reducedMotion;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16"
      aria-label="Introduction"
    >
      <HeroBackground disabled={reducedMotion} />

      <div className="section-container relative z-10">
        <motion.div
          initial="hidden"
          animate={introComplete ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.p variants={variants} className="section-eyebrow mb-4">
            {profile.role}
          </motion.p>

          <motion.h1
            variants={variants}
            className="font-display text-5xl font-bold tracking-tight text-primary sm:text-7xl lg:text-8xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={variants}
            className="mt-4 max-w-2xl font-mono text-sm text-accent sm:text-base"
          >
            {profile.roleLine}
          </motion.p>

          <motion.p
            variants={variants}
            className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={variants} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="#projects" className="btn-primary" disabled={magneticDisabled}>
              View Projects
              <ArrowDown size={16} aria-hidden="true" />
            </MagneticButton>
            <MagneticButton
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              className="btn-secondary"
              disabled={magneticDisabled}
            >
              <Download size={16} aria-hidden="true" />
              Download Resume
            </MagneticButton>
          </motion.div>

          <motion.div variants={variants} className="mt-10 flex items-center gap-4">
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
      </div>
    </section>
  );
}
