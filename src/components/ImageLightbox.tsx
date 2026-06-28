import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { publicAssetUrl } from '../lib/assets';

interface ImageLightboxProps {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  reducedMotion: boolean;
  closeLabel: string;
}

export function ImageLightbox({
  images,
  index,
  title,
  onClose,
  onIndexChange,
  reducedMotion,
  closeLabel,
}: ImageLightboxProps) {
  const src = images[index];
  const hasMultiple = images.length > 1;
  const duration = reducedMotion ? 0.01 : 0.2;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (!hasMultiple) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onIndexChange((index - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onIndexChange((index + 1) % images.length);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hasMultiple, images.length, index, onClose, onIndexChange]);

  if (!src) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col"
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
          transition={{ duration }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="truncate font-mono text-xs text-white/70">
              {title}
              {hasMultiple && (
                <span className="text-white/50">
                  {' '}
                  · {index + 1}/{images.length}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="rounded-md border border-white/20 bg-black/40 p-1.5 text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/30">
            <img
              src={publicAssetUrl(src)}
              alt={`${title} preview ${index + 1}`}
              className="max-h-[80vh] w-full object-contain"
            />

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-white/90 transition-colors hover:bg-black/70"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => onIndexChange((index + 1) % images.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-white/90 transition-colors hover:bg-black/70"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
