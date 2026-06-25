import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import { getSection } from '../data/sections';
import { ProjectCard } from './ProjectCard';
import { getRevealVariants, staggerContainer, viewportOnce } from '../lib/animations';

interface ProjectsProps {
  reducedMotion: boolean;
}

export function Projects({ reducedMotion }: ProjectsProps) {
  const variants = getRevealVariants(reducedMotion);
  const section = getSection('projects');
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="border-t border-border py-24 sm:py-32">
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
          {section.description && (
            <motion.p variants={variants} className="mt-4 max-w-2xl">
              {section.description}
            </motion.p>
          )}

          <motion.div
            variants={variants}
            className="mt-12 grid gap-6 lg:grid-cols-2"
          >
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} featured />
            ))}
          </motion.div>

          {rest.length > 0 && (
            <>
              <motion.h3
                variants={variants}
                className="mt-16 font-display text-xl font-semibold text-primary"
              >
                {'moreTitle' in section ? section.moreTitle : 'More projects'}
              </motion.h3>
              <motion.div
                variants={variants}
                className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {rest.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
