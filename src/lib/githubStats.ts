export type GitHubContributionStats = {
  total: number;
  currentStreak: number;
  longestStreak: number;
  rangeStart: string;
  currentStreakEnd: string;
  longestStreakStart: string;
  longestStreakEnd: string;
};

type ContributionDay = { date: string; count: number };

const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4';
const HISTORY_START_YEAR = 2022;

function localDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function computeLongestStreak(days: ContributionDay[]) {
  let best = 0;
  let bestStart = '';
  let bestEnd = '';
  let run = 0;
  let runStart = '';

  for (const day of days) {
    if (day.count > 0) {
      if (run === 0) runStart = day.date;
      run += 1;
      if (run > best) {
        best = run;
        bestStart = runStart;
        bestEnd = day.date;
      }
    } else {
      run = 0;
      runStart = '';
    }
  }

  return { longest: best, start: bestStart, end: bestEnd };
}

function computeCurrentStreak(days: ContributionDay[]) {
  if (days.length === 0) return { current: 0, end: '' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const byDate = new Map(days.map((d) => [d.date, d.count]));

  let cursor =
    (byDate.get(localDateKey(today)) ?? 0) > 0
      ? today
      : (byDate.get(localDateKey(yesterday)) ?? 0) > 0
        ? yesterday
        : null;

  if (!cursor) return { current: 0, end: '' };

  let streak = 0;
  const end = localDateKey(cursor);
  let walk: Date | null = cursor;

  while (walk) {
    const key = localDateKey(walk);
    if ((byDate.get(key) ?? 0) <= 0) break;
    streak += 1;
    const prev: Date = new Date(walk);
    prev.setDate(prev.getDate() - 1);
    walk = prev;
  }

  return { current: streak, end };
}

export function formatContributionDate(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${Number(d)}/${Number(m)}/${y}`;
}

async function fetchContributionYear(login: string, year: number) {
  const res = await fetch(`${CONTRIBUTIONS_API}/${login}?y=${year}`);
  if (!res.ok) return null;
  return res.json() as Promise<{
    contributions?: { date: string; count: number }[];
  }>;
}

export async function fetchGitHubContributionStats(
  login: string
): Promise<GitHubContributionStats | null> {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - HISTORY_START_YEAR + 1 },
    (_, i) => HISTORY_START_YEAR + i
  );

  try {
    const payloads = await Promise.all(years.map((year) => fetchContributionYear(login, year)));
    const byDate = new Map<string, number>();

    for (const payload of payloads) {
      for (const entry of payload?.contributions ?? []) {
        byDate.set(entry.date, (byDate.get(entry.date) ?? 0) + entry.count);
      }
    }

    if (byDate.size === 0) return null;

    const days = [...byDate.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const { longest, start, end } = computeLongestStreak(days);
    const { current, end: currentEnd } = computeCurrentStreak(days);
    const total = days.reduce((sum, day) => sum + day.count, 0);
    const rangeStart = days.find((day) => day.count > 0)?.date ?? days[0].date;

    return {
      total,
      currentStreak: current,
      longestStreak: longest,
      rangeStart,
      currentStreakEnd: currentEnd,
      longestStreakStart: start,
      longestStreakEnd: end,
    };
  } catch {
    return null;
  }
}
