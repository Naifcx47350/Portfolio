import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { getSection } from '../data/sections';
import { getRevealVariants, staggerContainer, viewportOnce } from '../lib/animations';

interface AboutProps {
  reducedMotion: boolean;
}

export function About({ reducedMotion }: AboutProps) {
  const variants = getRevealVariants(reducedMotion);
  const section = getSection('about');

  return (
    <section id="about" className="py-24 sm:py-32">
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

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              {profile.about.map((paragraph) => (
                <motion.p
                  key={paragraph.slice(0, 40)}
                  variants={variants}
                  className="leading-relaxed text-muted"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div variants={variants} className="card-surface p-6">
              <h3 className="font-display text-lg font-semibold text-primary">Education</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-accent">Degree</dt>
                  <dd className="mt-1 text-primary">{profile.education.degree}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wider text-accent">University</dt>
                  <dd className="mt-1">{profile.education.school}</dd>
                </div>
                <div className="flex gap-8">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-accent">GPA</dt>
                    <dd className="mt-1 font-mono text-primary">{profile.education.gpa}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-accent">Graduated</dt>
                    <dd className="mt-1">{profile.education.graduated}</dd>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <dt className="font-mono text-xs uppercase tracking-wider text-accent">Current</dt>
                  <dd className="mt-1 text-primary">{profile.education.bootcamp}</dd>
                </div>
              </dl>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
