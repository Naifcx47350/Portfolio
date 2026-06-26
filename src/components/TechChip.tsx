import { TechIcon, hasTechIcon } from './TechIcon';

export function TechChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-primary">
      {hasTechIcon(name) && (
        <span className="text-primary">
          <TechIcon name={name} size={14} />
        </span>
      )}
      <span className="font-mono">{name}</span>
    </span>
  );
}
