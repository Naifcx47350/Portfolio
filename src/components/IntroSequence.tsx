import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { profile } from '../data/profile';
import { introDuration } from '../lib/animations';

const SESSION_KEY = 'portfolio-intro-seen';

interface IntroSequenceProps {
  onComplete: () => void;
  reducedMotion: boolean;
}

export function IntroSequence({ onComplete, reducedMotion }: IntroSequenceProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    onComplete();
  }, [onComplete]);

  const skip = useCallback(() => {
    gsap.killTweensOf([
      overlayRef.current,
      lineRef.current,
      nameRef.current,
      roleRef.current,
      taglineRef.current,
    ]);
    if (overlayRef.current) overlayRef.current.style.display = 'none';
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
        .to(lineRef.current, { scaleX: 1, duration: 0.5 }, 0.2)
        .to(nameRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 0.7 }, 0.45)
        .fromTo(roleRef.current, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45 }, 0.85)
        .fromTo(taglineRef.current, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 1.05)
        .to(overlayRef.current, { autoAlpha: 0, duration: 0.5, pointerEvents: 'none' }, introDuration - 0.4);
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip();
    };
    const onWheel = () => skip();
    const onClick = () => skip();

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('click', onClick, { once: true });

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('click', onClick);
    };
  }, [reducedMotion, finish, skip]);

  const alreadySeen =
    typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';

  if (alreadySeen || reducedMotion) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center bg-base"
      role="presentation"
      aria-hidden="true"
      onClick={skip}
    >
      <div className="section-container flex max-w-3xl flex-col items-start gap-6">
        <div
          ref={lineRef}
          className="intro-line h-px w-full max-w-xs bg-accent sm:max-w-sm"
        />
        <h1
          ref={nameRef}
          className="intro-name-mask font-display text-4xl font-bold tracking-tight text-primary sm:text-6xl"
        >
          {profile.name}
        </h1>
        <p ref={roleRef} className="font-mono text-sm text-accent opacity-0 sm:text-base">
          {profile.roleLine}
        </p>
        <p ref={taglineRef} className="max-w-lg text-sm leading-relaxed text-muted opacity-0 sm:text-base">
          {profile.tagline}
        </p>
      </div>
      <p className="absolute bottom-8 font-mono text-xs text-muted/60">
        Click or scroll to skip
      </p>
    </div>
  );
}

export function hasSeenIntro(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}
