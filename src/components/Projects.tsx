import { useState } from 'react';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import type { Locale, TranslationKeys } from '../data/i18n';
import { localizeProject } from '../data/projectCopy';
import { SlideReveal } from './motion/ScrollMotion';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { NodeGlyph } from './NodeGlyph';

interface ProjectsProps {
  reducedMotion: boolean;
  locale: Locale;
  t: TranslationKeys;
}

export function Projects({ reducedMotion, locale, t }: ProjectsProps) {
  const proj = t.projects;
  const featured = projects.filter((item) => item.featured);
  const rest = projects.filter((item) => !item.featured);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="edge-accent py-24 sm:py-32">
      <div className="section-container">
        <SlideReveal reducedMotion={reducedMotion} direction="up">
          <p className="section-eyebrow mb-3 inline-flex items-center gap-2">
            <NodeGlyph reducedMotion={reducedMotion} />
            {proj.index} — {proj.label}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {proj.title}
          </h2>
          <p className="body-text mt-4 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            {proj.description}
          </p>
        </SlideReveal>

        <div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {featured.map((project, index) => (
              <SlideReveal key={project.slug} index={index} reducedMotion={reducedMotion} className="h-full">
                <ProjectCard
                  project={localizeProject(project, locale)}
                  featured
                  onOpen={setActiveProject}
                  clickLabel={proj.clickDetails}
                  reducedMotion={reducedMotion}
                  t={t}
                />
              </SlideReveal>
            ))}
          </div>

          {rest.length > 0 && (
            <>
              <SlideReveal reducedMotion={reducedMotion} direction="up">
                <h3 className="mt-16 font-display text-xl font-semibold text-primary">
                  {proj.moreTitle}
                </h3>
              </SlideReveal>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((project, index) => (
                  <SlideReveal key={project.slug} index={index} reducedMotion={reducedMotion} className="h-full">
                    <ProjectCard
                      project={localizeProject(project, locale)}
                      onOpen={setActiveProject}
                      clickLabel={proj.clickDetails}
                      reducedMotion={reducedMotion}
                      t={t}
                    />
                  </SlideReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        reducedMotion={reducedMotion}
        t={t}
      />
    </section>
  );
}
