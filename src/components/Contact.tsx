import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { profile, socials } from '../data/profile';
import { getSection } from '../data/sections';
import { getRevealVariants, staggerContainer, viewportOnce } from '../lib/animations';

// Replace with your Formspree form ID from https://formspree.io/
const FORMSPREE_ID = 'YOUR_FORM_ID';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ContactProps {
  reducedMotion: boolean;
}

export function Contact({ reducedMotion }: ContactProps) {
  const variants = getRevealVariants(reducedMotion);
  const section = getSection('contact');
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
    <section id="contact" className="border-t border-border py-24 sm:py-32">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mx-auto max-w-xl"
        >
          <motion.p variants={variants} className="section-eyebrow mb-3">
            {section.index} — {section.label}
          </motion.p>
          <motion.h2
            variants={variants}
            className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl"
          >
            {section.title}
          </motion.h2>
          {section.description && (
            <motion.p variants={variants} className="mt-4">
              {section.description}
            </motion.p>
          )}

          <motion.form
            variants={variants}
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
            noValidate
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                Name
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
                Email
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
                Message
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
                  Sending…
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" />
                  Send message
                </>
              )}
            </button>

            {status === 'success' && (
              <p className="text-sm text-primary" role="status">
                {profile.contact.successMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-accent" role="alert">
                {profile.contact.errorMessage}
              </p>
            )}
          </motion.form>

          <motion.div variants={variants} className="mt-8 border-t border-border pt-8 text-sm">
            <p className="text-muted">{profile.contact.fallbackLabel}</p>
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
