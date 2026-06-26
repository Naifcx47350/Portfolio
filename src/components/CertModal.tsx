import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import type { Cert } from '../data/certifications';
import type { TranslationKeys } from '../data/i18n';
import { certPdfUrl, publicAssetUrl } from '../lib/assets';
import { CertPdfPreview } from './CertPdfPreview';

interface CertModalProps {
  cert: Cert | null;
  onClose: () => void;
  reducedMotion: boolean;
  t: TranslationKeys;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export function CertModal({ cert, onClose, reducedMotion, t }: CertModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const c = t.certifications;

  useEffect(() => {
    if (!cert) return;

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
  }, [cert, onClose]);

  const duration = reducedMotion ? 0.01 : 0.2;
  const pdfUrl = cert?.pdf ? certPdfUrl(cert.pdf) : null;
  const imageUrl = cert?.image ? publicAssetUrl(`certs/${cert.image}`) : null;

  return createPortal(
    <AnimatePresence>
      {cert && (
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
            aria-label={cert.name}
            className="card-surface relative z-10 max-h-[90vh] w-full max-w-3xl overflow-auto p-6 sm:p-8"
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
              aria-label={c.close}
              className="absolute end-4 top-4 z-10 rounded-md border border-border bg-surface p-1.5 text-muted transition-colors hover:border-accent/50 hover:text-primary"
            >
              <X size={18} />
            </button>

            <div className="pe-8">
              {pdfUrl && (
                <CertPdfPreview
                  url={pdfUrl}
                  title={`${cert.name} certificate`}
                  openPdfLabel={c.openPdf}
                />
              )}

              {!pdfUrl && imageUrl && (
                <figure className="mb-6 overflow-hidden rounded-md border border-border bg-elevated">
                  <div className="bg-surface p-4">
                    <img
                      src={imageUrl}
                      alt={`${cert.name} certificate`}
                      className="mx-auto max-h-[55vh] w-auto rounded-sm object-contain"
                    />
                  </div>
                </figure>
              )}

              <p className="section-eyebrow">{cert.issuer}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-primary">
                {cert.name}
              </h3>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="font-mono uppercase tracking-wider text-muted">{c.issuer}</dt>
                  <dd className="text-end text-primary">{cert.issuer}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="font-mono uppercase tracking-wider text-muted">{c.year}</dt>
                  <dd className="text-end text-primary">{cert.year}</dd>
                </div>
                {cert.credentialId && (
                  <div className="flex justify-between gap-4 border-b border-border pb-3">
                    <dt className="font-mono uppercase tracking-wider text-muted">
                      {c.credentialId}
                    </dt>
                    <dd className="font-mono text-end text-primary">{cert.credentialId}</dd>
                  </div>
                )}
              </dl>
              {cert.verifyUrl && (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6"
                >
                  {c.verify}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
