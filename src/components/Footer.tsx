import { profile } from '../data/profile';
import { sections } from '../data/sections';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <div className="section-container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-sm font-semibold text-primary">{profile.name}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            © {year} · Built with React + Vite
          </p>
        </div>
        <ul className="flex flex-wrap justify-center gap-5">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className="font-mono text-xs text-muted hover:text-accent">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
