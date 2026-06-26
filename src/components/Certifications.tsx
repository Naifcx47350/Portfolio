import { useState } from 'react';
import { Award, Maximize2 } from 'lucide-react';
import { certifications } from '../data/certifications';
import type { Cert } from '../data/certifications';
import type { TranslationKeys } from '../data/i18n';
import { SlideReveal } from './motion/ScrollMotion';
import { CertModal } from './CertModal';
import { TiltCard } from './TiltCard';
import { NodeGlyph } from './NodeGlyph';

interface CertificationsProps {
  reducedMotion: boolean;
  t: TranslationKeys;
}

export function Certifications({ reducedMotion, t }: CertificationsProps) {
  const c = t.certifications;
  const featured = certifications.filter((cert) => cert.featured);
  const rest = certifications.filter((cert) => !cert.featured);
  const [activeCert, setActiveCert] = useState<Cert | null>(null);

  return (
    <section id="certifications" className="edge-accent py-24 sm:py-32">
      <div className="section-container">
        <SlideReveal reducedMotion={reducedMotion} direction="up">
          <p className="section-eyebrow mb-3 inline-flex items-center gap-2">
            <NodeGlyph reducedMotion={reducedMotion} />
            {c.index} — {c.label}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {c.title}
          </h2>
        </SlideReveal>

        <div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {featured.map((cert, index) => (
              <SlideReveal
                key={cert.name}
                index={index}
                reducedMotion={reducedMotion}
                className="h-full"
              >
              <TiltCard reducedMotion={reducedMotion} max={5} className="h-full">
              <button
                type="button"
                onClick={() => setActiveCert(cert)}
                aria-label={`Preview ${cert.name}`}
                aria-haspopup="dialog"
                className="card-surface group flex h-full w-full flex-col gap-4 p-6 text-start transition-colors hover:border-accent/40 hover:shadow-glow"
              >
                <div className="flex gap-4">
                  <Award className="mt-0.5 shrink-0 text-accent" size={22} aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-primary">{cert.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {cert.issuer} · {cert.year}
                    </p>
                  </div>
                  <Maximize2
                    size={16}
                    className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-mono text-xs text-muted group-hover:text-accent">
                    {c.clickDetails}
                  </span>
                </div>
              </button>
              </TiltCard>
              </SlideReveal>
            ))}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {rest.map((cert, index) => (
              <li key={cert.name}>
                <SlideReveal
                  reducedMotion={reducedMotion}
                  index={index}
                  distance={36}
                  className="h-full"
                >
                <button
                  type="button"
                  onClick={() => setActiveCert(cert)}
                  aria-label={`Preview ${cert.name}`}
                  aria-haspopup="dialog"
                  className="group flex h-full w-full flex-col gap-2 rounded-md border border-border bg-surface px-4 py-3 text-start text-sm transition-all hover:-translate-y-0.5 hover:border-accent/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-primary">{cert.name}</span>
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {cert.issuer} · {cert.year}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted group-hover:text-accent">
                    {c.clickDetails}
                  </span>
                </button>
                </SlideReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CertModal
        cert={activeCert}
        onClose={() => setActiveCert(null)}
        reducedMotion={reducedMotion}
        t={t}
      />
    </section>
  );
}
