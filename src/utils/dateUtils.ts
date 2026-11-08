import { DayInfo, StreakStats } from '../types';

/**
 * Format a Date object to 'YYYY-MM-DD' in local time.
 */
export function formatToDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's local date string 'YYYY-MM-DD'
 */
export function getTodayDateString(): string {
  return formatToDateString(new Date());
}

/**
 * Get an offset date string from today (e.g. -1 for yesterday, -7 for 7 days ago)
 */
export function getOffsetDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatToDateString(d);
}

/**
 * Format today's date for display (e.g., "Wednesday, Nov 4")
 */
export function formatFriendlyDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns the last N days (including today) in chronological order
 */
export function getLastNDays(n: number = 7): DayInfo[] {
  const days: DayInfo[] = [];
  const todayStr = getTodayDateString();
  const now = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = formatToDateString(d);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' }); // 'M', 'T', 'W'...
    const dayNumber = d.getDate();

    days.push({
      dateStr,
      dayLabel,
      dayNumber,
      isToday: dateStr === todayStr,
      isFuture: false,
    });
  }

  return days;
}

/**
 * Calculates current streak and best streak from completed date strings
 */
export function calculateStreak(completedDates: string[]): StreakStats {
  const todayStr = getTodayDateString();
  const yesterdayStr = getOffsetDateString(-1);
  const dateSet = new Set(completedDates);

  const completedToday = dateSet.has(todayStr);
  const completedYesterday = dateSet.has(yesterdayStr);

  // Current streak calculation
  let currentStreak = 0;
  if (completedToday) {
    currentStreak = 1;
    let offset = -1;
    while (dateSet.has(getOffsetDateString(offset))) {
      currentStreak++;
      offset--;
    }
  } else if (completedYesterday) {
    // If today is not yet checked, but yesterday was, the streak is maintained!
    currentStreak = 1;
    let offset = -2;
    while (dateSet.has(getOffsetDateString(offset))) {
      currentStreak++;
      offset--;
    }
  } else {
    currentStreak = 0;
  }

  // Best streak calculation
  let bestStreak = currentStreak;
  const sortedDates = Array.from(dateSet).sort();
  if (sortedDates.length > 0) {
    let run = 1;
    bestStreak = Math.max(bestStreak, run);
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1] + 'T00:00:00');
      const curr = new Date(sortedDates[i] + 'T00:00:00');
      const diffTime = curr.getTime() - prev.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        run++;
        if (run > bestStreak) bestStreak = run;
      } else if (diffDays > 1) {
        run = 1;
      }
    }
  }

  return {
    currentStreak,
    bestStreak,
    completedToday,
    completedYesterday,
    totalCompleted: completedDates.length,
  };
}
