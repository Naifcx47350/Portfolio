import { TechIcon, getTechBrandColor, hasTechIcon } from './TechIcon';

interface TechGridItemProps {
  name: string;
  reducedMotion: boolean;
}

export function TechGridItem({ name, reducedMotion }: TechGridItemProps) {
  const brandColor = getTechBrandColor(name);
  const hasColor = Boolean(brandColor);

  return (
    <li className="list-none">
      <div
        className={`tech-grid-item flex flex-col items-center gap-2 rounded-md border border-border bg-surface p-3 transition-colors duration-200 ${
          reducedMotion
            ? ''
            : 'hover:border-accent/50 hover:bg-elevated'
        }`}
      >
        <div
          className={`flex size-10 items-center justify-center rounded-md bg-elevated ${
            hasColor && !reducedMotion ? 'grayscale transition-[filter] duration-200 hover:grayscale-0' : ''
          }`}
          style={hasColor ? { color: brandColor! } : undefined}
        >
          {hasTechIcon(name) ? (
            <TechIcon name={name} size={24} colored={hasColor} />
          ) : (
            <span className="font-mono text-xs text-muted">{name.slice(0, 2)}</span>
          )}
        </div>
        <span className="text-center font-mono text-[10px] leading-tight text-primary sm:text-xs">
          {name}
        </span>
      </div>
    </li>
  );
}
