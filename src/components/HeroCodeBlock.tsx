import { useEffect, useMemo, useState } from 'react';

const CODE_LINES: { text: string; className: string }[] = [
  { text: 'const naif = {', className: 'code-kw' },
  { text: '  name: "Naif Alsahabi",', className: 'code-str' },
  { text: '  role: "AI Engineer",', className: 'code-str' },
  { text: '  based: "Riyadh, SA",', className: 'code-str' },
  { text: '  focus: ["LLMs & RAG", "Computer Vision", "NLP"],', className: 'code-arr' },
  { text: '  building: "end-to-end, bilingual AI systems",', className: 'code-str' },
  { text: '  currently: "SDA AI Engineering Bootcamp",', className: 'code-str' },
  { text: '};', className: 'code-kw' },
  { text: '', className: '' },
  { text: 'function buildWithNaif() {', className: 'code-kw' },
  { text: '  return naif.focus.map((area) => ship(area));', className: 'code-fn' },
  { text: '}', className: 'code-kw' },
];

const FULL_TEXT = CODE_LINES.map((l) => l.text).join('\n');

interface HeroCodeBlockProps {
  reducedMotion: boolean;
  /** Hold the typing animation until the hero is actually on screen (intro done). */
  start?: boolean;
  className?: string;
  id?: string;
}

export function HeroCodeBlock({ reducedMotion, start = true, className = '', id }: HeroCodeBlockProps) {
  const [charCount, setCharCount] = useState(() =>
    reducedMotion ? FULL_TEXT.length : 0
  );

  useEffect(() => {
    if (reducedMotion) {
      setCharCount(FULL_TEXT.length);
      return;
    }
    // Wait for the intro to finish so the type-out is actually visible.
    if (!start) {
      setCharCount(0);
      return;
    }

    // Time-based reveal aligned to the animation frame: smooth, frame-rate
    // independent, with far fewer state updates than per-char timeouts.
    const CHARS_PER_SECOND = 230;
    let rafId = 0;
    let startTs = 0;

    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const next = Math.min(FULL_TEXT.length, Math.floor((elapsed / 1000) * CHARS_PER_SECOND));
      setCharCount(next);
      if (next >= FULL_TEXT.length) return;
      rafId = requestAnimationFrame(step);
    };

    // Small beat after the hero settles, then type.
    const startTimeout = window.setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, 260);

    return () => {
      window.clearTimeout(startTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, start]);

  const rendered = useMemo(() => {
    let offset = 0;
    return CODE_LINES.map((line, lineIndex) => {
      const lineStart = offset;
      offset += line.text.length + (lineIndex < CODE_LINES.length - 1 ? 1 : 0);
      const sliceStart = Math.max(0, charCount - lineStart);
      const visiblePart = charCount > lineStart ? line.text.slice(0, Math.min(sliceStart, line.text.length)) : '';

      if (!visiblePart && charCount <= lineStart) return null;

      return (
        <div key={lineIndex} className="leading-relaxed">
          <span className={line.className}>{visiblePart || '\u00A0'}</span>
        </div>
      );
    });
  }, [charCount]);

  return (
    <div
      id={id}
      className={`code-window overflow-hidden rounded-lg border border-border bg-[var(--bg-surface)] shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border bg-elevated px-3 py-2">
        <span className="size-2.5 rounded-full bg-accent/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-border" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-border" aria-hidden="true" />
        <span className="ms-2 font-mono text-[10px] text-muted">naif.ts</span>
      </div>
      <pre
        className="max-h-[min(340px,42vh)] overflow-auto p-4 font-mono text-[11px] sm:text-xs"
        aria-label="Code introduction"
      >
        <code>{rendered}</code>
        {!reducedMotion && (
          <span className="code-cursor ms-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent align-middle" />
        )}
      </pre>
    </div>
  );
}

export { FULL_TEXT as HERO_CODE_FULL_TEXT };
