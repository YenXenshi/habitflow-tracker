export interface Habit {
  id: string;
  name: string;
  createdAt: string; // YYYY-MM-DD
  completedDates: string[]; // List of YYYY-MM-DD strings
  category?: string;
  color?: string;
}

export interface DayInfo {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // 'M', 'T', 'W', etc.
  dayNumber: number;
  isToday: boolean;
  isFuture: boolean;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  completedYesterday: boolean;
  totalCompleted: number;
}
