import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { introDuration } from '../lib/animations';
import type { TranslationKeys } from '../data/i18n';
import type { Theme } from '../hooks/useTheme';
import { publicAssetUrl } from '../lib/assets';

const SESSION_KEY = 'portfolio-intro-seen';

interface IntroSequenceProps {
  onComplete: () => void;
  reducedMotion: boolean;
  theme: Theme;
  t: TranslationKeys;
}

export function IntroSequence({ onComplete, reducedMotion, theme, t }: IntroSequenceProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const completedRef = useRef(false);
  const p = t.profile;

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    onComplete();
  }, [onComplete]);

  const skip = useCallback(() => {
    gsap.killTweensOf([
      overlayRef.current,
      glowRef.current,
      logoRef.current,
      lineRef.current,
      nameRef.current,
      roleRef.current,
      taglineRef.current,
    ]);
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' });
    }
    finish();
  }, [finish]);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1';
    if (alreadySeen || reducedMotion) {
      if (overlayRef.current) overlayRef.current.style.display = 'none';
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: finish,
      });

      tl.set(overlayRef.current, { autoAlpha: 1 })
        .fromTo(
          glowRef.current,
          { scale: 0.6, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.8 },
          0
        )
        .fromTo(
          logoRef.current,
          { scale: 0.75, autoAlpha: 0, y: 12 },
          { scale: 1, autoAlpha: 1, y: 0, duration: 0.7 },
          0.15
        )
        .to(lineRef.current, { scaleX: 1, duration: 0.55 }, 0.75)
        .to(nameRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.75 }, 1.0)
        .fromTo(
          roleRef.current,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5 },
          1.45
        )
        .fromTo(
          taglineRef.current,
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.45 },
          1.75
        )
        .to(
          overlayRef.current,
          { autoAlpha: 0, duration: 0.55, pointerEvents: 'none' },
          introDuration - 0.45
        );
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip();
    };

    window.addEventListener('keydown', onKey);

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
    };
  }, [reducedMotion, finish, skip]);

  const alreadySeen =
    typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';

  if (alreadySeen || reducedMotion) return null;

  const logoSrc = publicAssetUrl(`brand/logo-${theme === 'dark' ? 'dark' : 'light'}.png`);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center bg-base opacity-0"
      role="presentation"
      aria-hidden="true"
      onClick={skip}
    >
      <div className="intro-particles" aria-hidden="true">
        {[
          { top: '18%', left: '12%' },
          { top: '32%', left: '78%' },
          { top: '58%', left: '22%' },
          { top: '72%', left: '68%' },
          { top: '44%', left: '48%' },
          { top: '82%', left: '38%' },
        ].map((pos, i) => (
          <span
            key={i}
            className="intro-particle"
            style={{ ...pos, animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </div>

      <div
        ref={glowRef}
        className="pointer-events-none absolute size-72 rounded-full bg-accent/10 blur-3xl opacity-0 sm:size-96"
        aria-hidden="true"
      />

      <div className="section-container relative flex max-w-3xl flex-col items-center gap-6 text-center sm:items-start sm:text-start">
        <img
          ref={logoRef}
          src={logoSrc}
          alt=""
          width={72}
          height={72}
          className="size-16 opacity-0 sm:size-[4.5rem]"
          aria-hidden="true"
        />
        <div
          ref={lineRef}
          className="intro-line h-px w-full max-w-xs bg-accent sm:max-w-sm"
        />
        <h1
          ref={nameRef}
          className="intro-name-mask font-display text-4xl font-bold tracking-tight text-primary sm:text-6xl"
        >
          {p.name}
        </h1>
        <p ref={roleRef} className="font-mono text-sm text-accent opacity-0 sm:text-base">
          {p.roleLine}
        </p>
        <p
          ref={taglineRef}
          className="max-w-lg text-sm leading-relaxed text-muted opacity-0 sm:text-base"
        >
          {p.tagline}
        </p>
      </div>
      <p className="absolute bottom-8 font-mono text-xs text-muted/60">{t.intro.skipHint}</p>
    </div>
  );
}

export function hasSeenIntro(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}
