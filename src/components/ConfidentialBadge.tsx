import { Lock } from 'lucide-react';
import type { TranslationKeys } from '../data/i18n';

interface ConfidentialBadgeProps {
  t: TranslationKeys;
  compact?: boolean;
}

export function ConfidentialBadge({ t, compact = false }: ConfidentialBadgeProps) {
  const p = t.projects;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated ${
        compact ? 'px-2 py-1' : 'px-3 py-1.5'
      }`}
      title={`${p.confidentialBadge} — ${p.confidentialNote}`}
    >
      <Lock
        size={compact ? 11 : 13}
        className="shrink-0 text-accent"
        aria-hidden="true"
      />
      <span className={`font-mono leading-tight ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <span className="font-semibold text-primary">{p.confidentialBadge}</span>
        <span className="text-muted"> · {p.confidentialNote}</span>
      </span>
    </span>
  );
}
