import { useEffect, useState } from 'react';

function formatRiyadhTime(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function LiveClock() {
  const [time, setTime] = useState(() => formatRiyadhTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatRiyadhTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time
      dateTime={time}
      className="hidden font-mono text-xs tracking-wide text-muted sm:block"
      aria-label={`Current time in Riyadh: ${time}`}
    >
      RUH {time}
    </time>
  );
}
