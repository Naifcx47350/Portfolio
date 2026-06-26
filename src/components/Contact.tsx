import { FormEvent, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { profile, socials } from '../data/profile';
import type { TranslationKeys } from '../data/i18n';
import { SlideReveal } from './motion/ScrollMotion';
import { NodeGlyph } from './NodeGlyph';

const FORMSPREE_ID = 'mjgqypoa';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ContactProps {
  reducedMotion: boolean;
  t: TranslationKeys;
}

export function Contact({ reducedMotion, t }: ContactProps) {
  const c = t.contact;
  const pc = t.profile.contact;
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="edge-accent py-24 sm:py-32">
      <div className="section-container">
        <div className="mx-auto max-w-xl">
          <SlideReveal reducedMotion={reducedMotion} direction="up">
            <p className="section-eyebrow mb-3 inline-flex items-center gap-2">
              <NodeGlyph reducedMotion={reducedMotion} />
              {c.index} — {c.label}
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {c.title}
            </h2>
            <p className="body-text mt-4" style={{ color: 'var(--text-muted)' }}>
              {c.description}
            </p>
          </SlideReveal>

          <SlideReveal reducedMotion={reducedMotion} direction="up">
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
            noValidate
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                {c.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-primary transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                {c.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-primary transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                {c.message}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-y rounded-md border border-border bg-surface px-4 py-2.5 text-primary transition-colors focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-primary w-full sm:w-auto disabled:opacity-60"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  {c.sending}
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" />
                  {c.send}
                </>
              )}
            </button>

            {status === 'success' && (
              <p className="text-sm text-primary" role="status">
                {pc.successMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-accent" role="alert">
                {pc.errorMessage}
              </p>
            )}
          </form>
          </SlideReveal>

          <SlideReveal reducedMotion={reducedMotion} direction="up" className="mt-8 border-t border-border pt-8 text-sm">
            <p className="text-muted">{pc.fallbackLabel}</p>
            <div className="mt-3 flex flex-wrap gap-4">
              <a href={socials.email} className="font-mono text-primary hover:text-accent">
                {profile.email}
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary hover:text-accent"
              >
                LinkedIn
              </a>
            </div>
          </SlideReveal>
        </div>
      </div>
    </section>
  );
}
