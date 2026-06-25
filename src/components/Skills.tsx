import { motion } from 'framer-motion';
import { skills } from '../data/skills';
import { getSection } from '../data/sections';
import { getRevealVariants, staggerContainer, viewportOnce } from '../lib/animations';

interface SkillsProps {
  reducedMotion: boolean;
}

export function Skills({ reducedMotion }: SkillsProps) {
  const variants = getRevealVariants(reducedMotion);
  const section = getSection('skills');
  const groups = Object.entries(skills);

  return (
    <section id="skills" className="border-t border-border py-24 sm:py-32">
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

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {groups.map(([category, items]) => (
              <motion.div key={category} variants={variants} className="card-surface p-6">
                <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
                  {category}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <li key={skill} className="tech-chip">
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
