import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { certifications } from '../data/certifications';
import { getSection } from '../data/sections';
import { getRevealVariants, staggerContainer, viewportOnce } from '../lib/animations';

interface CertificationsProps {
  reducedMotion: boolean;
}

export function Certifications({ reducedMotion }: CertificationsProps) {
  const variants = getRevealVariants(reducedMotion);
  const section = getSection('certifications');
  const featured = certifications.filter((c) => c.featured);
  const rest = certifications.filter((c) => !c.featured);

  return (
    <section id="certifications" className="border-t border-border py-24 sm:py-32">
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
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

          <motion.div variants={variants} className="mt-10 grid gap-4 sm:grid-cols-2">
            {featured.map((cert) => (
              <article
                key={cert.name}
                className="card-surface flex gap-4 p-6 hover:border-accent/30"
              >
                <Award className="mt-0.5 shrink-0 text-accent" size={22} aria-hidden="true" />
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary">{cert.name}</h3>
                  <p className="mt-1 text-sm">
                    {cert.issuer} · {cert.year}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>

          <motion.ul variants={variants} className="mt-8 grid gap-3 sm:grid-cols-2">
            {rest.map((cert) => (
              <li
                key={cert.name}
                className="flex items-start justify-between gap-4 rounded-md border border-border bg-surface px-4 py-3 text-sm"
              >
                <span className="text-primary">{cert.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {cert.issuer} · {cert.year}
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
