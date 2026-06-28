import { Maximize2 } from 'lucide-react';
import type { Project } from '../data/projects';
import type { TranslationKeys } from '../data/i18n';
import { ConfidentialBadge } from './ConfidentialBadge';
import { ProjectBanner } from './ProjectBanner';
import { TechChip } from './TechChip';
import { TiltCard } from './TiltCard';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  onOpen: (project: Project) => void;
  clickLabel: string;
  reducedMotion: boolean;
  t: TranslationKeys;
}

export function ProjectCard({
  project,
  featured = false,
  onOpen,
  clickLabel,
  reducedMotion,
  t,
}: ProjectCardProps) {
  return (
    <TiltCard reducedMotion={reducedMotion} className="h-full">
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Open details for ${project.title}`}
      aria-haspopup="dialog"
      className={`card-surface group flex h-full w-full flex-col overflow-hidden text-start transition-colors hover:border-accent/40 hover:shadow-glow ${
        featured ? 'p-6 lg:p-8' : 'p-6'
      }`}
    >
      <div className={featured ? 'mb-6' : 'mb-5'}>
        <ProjectBanner project={project} featured={featured} />
      </div>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3
            className={`font-display font-semibold text-primary ${
              featured ? 'text-2xl' : 'text-lg'
            }`}
          >
            {project.title}
          </h3>
          <span className="font-mono text-xs text-accent">{project.year}</span>
        </div>
        {project.tags && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] uppercase tracking-wider text-accent">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <p
        className={`body-text flex-1 leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}
        style={{ color: 'var(--text-muted)' }}
      >
        {project.summary}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Technologies used in ${project.title}`}>
        {project.tech.map((t) => (
          <li key={t}>
            <TechChip name={t} />
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-xs text-muted group-hover:text-accent">
          {clickLabel}
        </span>
        {project.confidential ? (
          <ConfidentialBadge t={t} compact />
        ) : (
          <Maximize2
            size={14}
            className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        )}
      </div>
    </button>
    </TiltCard>
  );
}
