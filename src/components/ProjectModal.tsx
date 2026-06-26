import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, FolderGit2, X } from 'lucide-react';
import type { Project } from '../data/projects';
import { ProjectBanner } from './ProjectBanner';
import { TechChip } from './TechChip';

import type { TranslationKeys } from '../data/i18n';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  reducedMotion: boolean;
  t: TranslationKeys;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export function ProjectModal({ project, onClose, reducedMotion, t }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => el.offsetParent !== null);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables.at(-1)!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus?.();
    };
  }, [project, onClose]);

  const duration = reducedMotion ? 0.01 : 0.2;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="card-surface relative z-10 max-h-[90vh] w-full max-w-2xl overflow-auto p-6 sm:p-8"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="absolute right-4 top-4 z-10 rounded-md border border-border bg-surface p-1.5 text-muted transition-colors hover:border-accent/50 hover:text-primary"
            >
              <X size={18} />
            </button>

            <div className="pr-8">
              <ProjectBanner project={project} featured />

              <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-2xl font-semibold text-primary">
                    {project.title}
                  </h3>
                  <span className="font-mono text-sm text-accent">{project.year}</span>
                </div>
                {project.tags && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] uppercase tracking-wider text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="body-text mt-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {project.description ?? project.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <TechChip key={t} name={t} />
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <FolderGit2 size={16} aria-hidden="true" />
                  {t.projects.viewRepo}
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                    {t.projects.openLive}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
