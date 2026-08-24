interface CertPreviewProps {
  imageUrl: string | null;
  pdfUrl: string | null;
  title: string;
  openPdfLabel: string;
}

/** Image-first certificate preview; PDF stays available for inspect/download. */
export function CertPdfPreview({ imageUrl, pdfUrl, title, openPdfLabel }: CertPreviewProps) {
  if (!imageUrl && !pdfUrl) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-md border border-border bg-elevated">
      {imageUrl ? (
        <div className="bg-surface px-3 py-3 sm:px-4 sm:py-4">
          <img
            src={imageUrl}
            alt={title}
            className="mx-auto h-auto max-h-[min(62vh,640px)] w-full rounded-sm object-contain"
          />
        </div>
      ) : (
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
          title={title}
          className="h-[min(55vh,520px)] w-full bg-surface"
        />
      )}
      {pdfUrl && (
        <div className="border-t border-border px-3 py-2.5 text-center">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-primary transition-colors hover:text-accent"
          >
            {openPdfLabel}
          </a>
        </div>
      )}
    </div>
  );
}
