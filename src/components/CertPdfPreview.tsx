interface CertPdfPreviewProps {
  url: string;
  title: string;
  openPdfLabel: string;
}

/** Instant PDF preview — no client-side render delay. */
export function CertPdfPreview({ url, title, openPdfLabel }: CertPdfPreviewProps) {
  const embedUrl = `${url}#toolbar=0&navpanes=0&view=FitH`;

  return (
    <div className="mb-6 overflow-hidden rounded-md border border-border bg-elevated">
      <iframe
        src={embedUrl}
        title={title}
        className="h-[min(55vh,520px)] w-full bg-surface"
      />
      <div className="border-t border-border px-3 py-2.5 text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-primary transition-colors hover:text-accent"
        >
          {openPdfLabel}
        </a>
      </div>
    </div>
  );
}
