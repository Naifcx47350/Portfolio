import { useCallback, useRef } from 'react';

interface MagneticOptions {
  strength?: number;
  disabled?: boolean;
}

export function useMagnetic({ strength = 0.35, disabled = false }: MagneticOptions = {}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [disabled, strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
