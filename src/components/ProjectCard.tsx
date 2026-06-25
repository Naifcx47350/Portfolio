import { ExternalLink, FolderGit2 } from 'lucide-react';
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <article
      className={`card-surface group flex h-full flex-col p-6 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow ${
        featured ? 'lg:p-8' : ''
      }`}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3
          className={`font-display font-semibold text-primary ${
            featured ? 'text-2xl' : 'text-lg'
          }`}
        >
          {project.title}
        </h3>
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

      <p className={`flex-1 leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}>
        {project.summary}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Technologies used in ${project.title}`}>
        {project.tech.map((t) => (
          <li key={t} className="tech-chip">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-5">
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-primary transition-colors hover:text-accent"
        >
          <FolderGit2 size={14} aria-hidden="true" />
          Repo
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-primary transition-colors hover:text-accent"
          >
            <ExternalLink size={14} aria-hidden="true" />
            Live
          </a>
        )}
      </div>
    </article>
  );
}
